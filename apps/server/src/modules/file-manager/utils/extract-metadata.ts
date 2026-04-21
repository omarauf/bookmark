import { tmpdir } from "node:os";
import { join } from "node:path";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import type { FileMetadata, FileType, MimeType } from "@workspace/contracts/file-manager";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

export async function extractRichMetadata(
  buffer: Buffer,
  _mimeType: MimeType,
  fileType: FileType,
): Promise<FileMetadata | null> {
  switch (fileType) {
    case "image":
      return extractImageMetadata(buffer);
    case "video":
      return extractVideoMetadata(buffer);
    case "audio":
      return extractAudioMetadata(buffer);
    case "pdf":
      return extractPdfMetadata(buffer);
    default:
      return null;
  }
}

async function extractImageMetadata(buffer: Buffer): Promise<FileMetadata | null> {
  try {
    const meta = await sharp(buffer).metadata();
    if (!meta.width || !meta.height) return null;
    return {
      type: "image",
      width: meta.width,
      height: meta.height,
      format: meta.format,
    };
  } catch {
    return null;
  }
}

async function extractVideoMetadata(buffer: Buffer): Promise<FileMetadata | null> {
  try {
    const info = await probeMediaMetadata(buffer);
    if (!info) return null;

    const duration = parseFloat(info.format?.duration ?? "0");
    if (!duration && !info.streams?.length) return null;

    const videoStream = info.streams?.find((s) => s.codec_type === "video");
    const fps = parseFps(videoStream?.r_frame_rate);

    return {
      type: "video",
      duration: duration || 0,
      width: videoStream?.width,
      height: videoStream?.height,
      codec: videoStream?.codec_name,
      fps,
    };
  } catch {
    return null;
  }
}

async function extractAudioMetadata(buffer: Buffer): Promise<FileMetadata | null> {
  try {
    const info = await probeMediaMetadata(buffer);
    if (!info) return null;

    const duration = parseFloat(info.format?.duration ?? "0");
    const bitrate = info.format?.bit_rate
      ? Math.round(Number(info.format.bit_rate) / 1000)
      : undefined;
    const audioStream = info.streams?.find((s) => s.codec_type === "audio");

    return {
      type: "audio",
      duration: duration || 0,
      bitrate,
      codec: audioStream?.codec_name,
    };
  } catch {
    return null;
  }
}

async function extractPdfMetadata(buffer: Buffer): Promise<FileMetadata | null> {
  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    return {
      type: "pdf",
      pages: pdfDoc.getPageCount(),
      author: pdfDoc.getAuthor() || undefined,
    };
  } catch {
    return null;
  }
}

interface FfprobeStream {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
  r_frame_rate?: string;
}

interface FfprobeFormat {
  duration?: string;
  bit_rate?: string;
}

interface FfprobeOutput {
  streams?: FfprobeStream[];
  format?: FfprobeFormat;
}

async function probeMediaMetadata(buffer: Buffer): Promise<FfprobeOutput | null> {
  const tmpPath = join(tmpdir(), `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  try {
    await Bun.write(tmpPath, buffer);

    const proc = Bun.spawn({
      cmd: [
        ffprobeInstaller.path,
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        tmpPath,
      ],
      stdout: "pipe",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;
    if (exitCode !== 0) return null;

    const stdout = await new Response(proc.stdout).text();
    return JSON.parse(stdout) as FfprobeOutput;
  } catch {
    return null;
  } finally {
    try {
      await Bun.file(tmpPath).delete();
    } catch {
      // ignore cleanup errors
    }
  }
}

function parseFps(rFrameRate?: string): number | undefined {
  if (!rFrameRate) return undefined;
  const parts = rFrameRate.split("/");
  if (parts.length !== 2) {
    const fps = parseFloat(rFrameRate);
    return Number.isNaN(fps) ? undefined : fps;
  }
  const num = Number.parseFloat(parts[0]);
  const den = Number.parseFloat(parts[1]);
  if (den === 0 || Number.isNaN(num) || Number.isNaN(den)) return undefined;
  return Math.round((num / den) * 100) / 100;
}

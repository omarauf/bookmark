import youtubedl from "youtube-dl-exec";
import type { YtDlpFormat } from "./type";

type ListFormatsResult = { ok: true; data: YtDlpFormat[] } | { ok: false; error: string };

type DownloadResult = { ok: true } | { ok: false; error: string };

async function listFormats(videoUrl: string): Promise<ListFormatsResult> {
  try {
    const result = (await youtubedl(videoUrl, {
      dumpSingleJson: true,
      // biome-ignore lint/suspicious/noExplicitAny: youtube-dl-exec types don't include dumpSingleJson
    } as any)) as unknown as {
      formats?: Array<{
        format_id: string;
        ext: string;
        resolution?: string;
        filesize?: number;
        filesize_approx?: number;
        vcodec?: string;
        acodec?: string;
        fps?: number;
        quality_label?: string;
      }>;
    };

    const rawFormats = result.formats || [];

    const formats: YtDlpFormat[] = rawFormats.map((f) => ({
      formatId: f.format_id,
      ext: f.ext,
      resolution: f.resolution || "unknown",
      filesize: f.filesize || f.filesize_approx,
      vcodec: f.vcodec || "unknown",
      acodec: f.acodec || "unknown",
      fps: f.fps,
      qualityLabel: f.quality_label,
      hasVideo: f.vcodec !== "none" && !!f.vcodec,
      hasAudio: f.acodec !== "none" && !!f.acodec,
    }));

    return { ok: true, data: formats };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

async function download(
  videoUrl: string,
  formatId: string,
  outputPath: string,
  mergeOutputFormat?: string,
): Promise<DownloadResult> {
  try {
    const flags: Record<string, unknown> = {
      format: formatId,
      output: outputPath,
    };
    if (mergeOutputFormat) {
      flags.mergeOutputFormat = mergeOutputFormat;
    }
    // biome-ignore lint/suspicious/noExplicitAny: youtube-dl-exec types don't include mergeOutputFormat
    await youtubedl(videoUrl, flags as any);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: message };
  }
}

export const ytDlpClient = {
  listFormats,
  download,
};

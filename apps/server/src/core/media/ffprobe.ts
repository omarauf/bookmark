import ffprobeInstaller from "@ffprobe-installer/ffprobe";

type FfprobeStream = {
  codec_type?: string;
  codec_name?: string;
  width?: number;
  height?: number;
  r_frame_rate?: string;
};

type FfprobeFormat = {
  duration?: string;
  bit_rate?: string;
};

type FfprobeOutput = {
  streams?: FfprobeStream[];
  format?: FfprobeFormat;
};

export async function getMediaMetadata(filePath: string): Promise<FfprobeOutput | null> {
  try {
    const proc = Bun.spawn({
      cmd: [
        ffprobeInstaller.path,
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        filePath,
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
  }
}

import type { LinkPreview } from "@workspace/contracts/link";
import axios from "axios";
import { getPreviewFromContent } from "link-preview-js";

export async function fetchPreviewForUrl(
  url: string,
  headers?: Record<string, string>,
): Promise<LinkPreview | null> {
  try {
    // console.log(`[LinkPreview] Fetching ${url}`);
    const response = await axios.get<string>(url, {
      responseType: "text",
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        ...headers,
      },
    });

    if (response.status >= 400) {
      // console.log(`[LinkPreview] HTTP ${response.status} for ${url}, skipping`);
      return null;
    }

    const preFetched = {
      headers: { "content-type": String(response.headers["content-type"]) },
      status: response.status,
      url,
      data: response.data,
    };

    const data = await getPreviewFromContent(preFetched);

    return {
      url: data.url,
      mediaType: data.mediaType,
      favicons: data.favicons,
      title: "title" in data ? data.title || undefined : undefined,
      siteName: "siteName" in data ? data.siteName || undefined : undefined,
      description: "description" in data ? data.description || undefined : undefined,
      images: "images" in data ? data.images || undefined : undefined,

      charset: "charset" in data ? data.charset || undefined : undefined,
      contentType: "contentType" in data ? data.contentType || undefined : undefined,
      videos: "videos" in data ? data.videos || undefined : undefined,
    };
  } catch {
    // console.error(
    //   `[LinkPreview] Failed to fetch ${url}:`,
    //   err instanceof Error ? err.message : err,
    // );
    return null;
  }
}

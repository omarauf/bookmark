import type { Readable } from "node:stream";
import axios from "axios";

/**
 * Fetches a file from the provided URL and returns the data stream.
 *
 * @param url - The URL of the file to fetch.
 * @param cookie - Optional cookie header to include in the request.
 * @returns A promise that resolves with a readable stream of the file data.
 */
export async function getFileStream(url: string, cookie?: string): Promise<Readable> {
  const response = await axios.get<Readable>(url, {
    responseType: "stream",
    headers: cookie ? { Cookie: cookie } : undefined,
  });

  return response.data;
}

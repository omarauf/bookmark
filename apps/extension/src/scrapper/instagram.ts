declare global {
  interface Window {
    savedPosts: unknown[];
  }
}

export function instagramScrapper() {
  console.log("[bookmark]", "Instagram Scrapper initializing... v4");

  const savedPosts: unknown[] = [];

  function init() {
    const originalOpen = XMLHttpRequest.prototype.open;

    if (originalOpen.name !== "overrideRequestListener") {
      XMLHttpRequest.prototype.open = function overrideRequestListener(requestMethod, requestUrl) {
        this.addEventListener("readystatechange", function readystatechange() {
          if (
            this.responseType !== "arraybuffer" &&
            this.responseType !== "blob" &&
            this.readyState === 4
          ) {
            if (
              requestMethod === "GET" &&
              typeof requestUrl === "string" &&
              requestUrl.includes("feed/saved/posts")
            ) {
              // getData(this.response);
              const parsedResponse = JSON.parse(this.response);
              savedPosts.push(parsedResponse);
              window.savedPosts = savedPosts;
            }
          }
        });

        // @ts-expect-error
        // biome-ignore lint/complexity/noArguments: this is normal
        originalOpen.apply(this, arguments);
      };
    }
  }

  function openAllPostsPage() {
    const link = document.querySelector<HTMLAnchorElement>('a[href="/omarauf/saved/all-posts/"]');
    if (!link) return;

    link.click();
  }

  function getLastPostCode() {
    const anchors = Array.from(document.querySelectorAll('a[href^="/p/"]'));
    const matchingAnchors = anchors.filter((a) => {
      const href = a.getAttribute("href");
      return href !== null && /^\/p\/[^/]+\/$/.test(href);
    });
    const lastAnchor =
      matchingAnchors.length > 0 ? matchingAnchors[matchingAnchors.length - 1] : undefined;
    if (!lastAnchor) return undefined;
    const hrefValue = lastAnchor.getAttribute("href");
    const idPart = hrefValue?.split("/")[2];
    if (!idPart) return undefined;
    return [lastAnchor, idPart] as const;
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // // METHOD - I
  // async function scrollLoop() {
  //   let previousPostCode: string | undefined = undefined;

  //   while (true) {
  //     const result = getLastPostCode();
  //     if (!result) break;

  //     const [lastPostElement, lastPostCode] = result;

  //     // If the last post code hasn't changed, we assume we've reached the end
  //     if (lastPostCode === previousPostCode) {
  //       console.log("[bookmark]", "Reached end or no new posts loaded.");
  //       break;
  //     }

  //     // Scroll to the last post
  //     lastPostElement.scrollIntoView({ behavior: "smooth", block: "center" });

  //     // Update previous post code
  //     previousPostCode = lastPostCode;

  //     // Wait for a random delay between 1 to 2 seconds
  //     const delayMs = 2000 + Math.random() * 1000;
  //     console.log("[bookmark]", `Scrolling... Next delay: ${Math.round(delayMs)}ms | Saved posts so far: ${savedPosts.length}`);

  //     await delay(delayMs);
  //   }
  // }

  async function scrollLoop2() {
    while (true) {
      const result = getLastPostCode();
      if (!result) break;

      const [lastPostElement] = result;

      lastPostElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Wait for a random delay between 1 to 2 seconds
      const delayMs = 2000 + Math.random() * 1000;
      console.log(
        "[bookmark]",
        `Scrolling... Next delay: ${Math.round(delayMs)}ms | Saved posts so far: ${savedPosts.length}`,
      );

      await delay(delayMs);

      const loadingIndicator = document.querySelector('[data-visualcompletion="loading-state"]');
      if (loadingIndicator === null) {
        console.log("[bookmark]", "No loading indicator found, stopping scroll loop.");
        break;
      }
    }
  }

  function download() {
    const blob = new Blob([JSON.stringify(savedPosts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const date = new Date();
    const formattedDate = date.toISOString();
    a.download = `savedPosts_${formattedDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function scrape() {
    init();

    openAllPostsPage();
    await delay(5000);

    await scrollLoop2();

    download();
  }

  setTimeout(scrape, 5000);
}

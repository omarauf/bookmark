declare global {
  interface Window {
    savedPosts: unknown[];
  }
}

type Props = {
  pages?: number;
  download?: boolean;
  send?: boolean;
  filename: string;
};

export function tiktokScraper({ pages, download, send, filename }: Props) {
  console.log("[bookmark]", "Tiktok Scraper initializing... v4");

  const savedPosts: unknown[] = [];

  function init() {
    const originalFetch = window.fetch;

    if (originalFetch.name !== "overrideRequestListener") {
      console.log("AlgorithmX", "Request listener initialized", originalFetch.name);
      window.fetch = async function overrideRequestListener(resource, init) {
        // Make the actual fetch request
        const response = await originalFetch(resource, init);

        if (
          init?.method === "GET" &&
          typeof resource === "string" &&
          resource.includes("collect/item_list")
        ) {
          const clonedResponse = response.clone();
          const body = await clonedResponse.text();

          if (body.includes("fatal_item_ids")) {
            const parsedResponse = JSON.parse(body);
            savedPosts.push(parsedResponse);
            window.savedPosts = savedPosts;
          }
        }

        return response;
      };
    }
  }

  function openAllPostsPage() {
    const favoritesLink = Array.from(document.querySelectorAll("span")).find(
      (el) => el.textContent?.trim() === "Favorites",
    );
    if (!favoritesLink) return;

    favoritesLink.click();
  }

  function getLastPost() {
    const elements = document.querySelectorAll('[id^="column-item-video-container-"]');
    const lastElement = elements.length > 0 ? elements[elements.length - 1] : undefined;
    return lastElement;
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function scrollLoop2() {
    let lastScrollY = window.scrollY; // track initial scroll position
    let stagnantCount = 0; // count consecutive times scroll position didn't change
    const stagnantLimit = 2; // number of times to check before stopping

    while (true) {
      const lastPost = getLastPost();
      if (!lastPost) break;

      lastPost.scrollIntoView({ behavior: "smooth", block: "center" });

      // Wait for a random delay between 1 to 2 seconds
      const delayMs = 2000 + Math.random() * 1000;
      console.log(
        "[bookmark]",
        `Scrolling... Next delay: ${Math.round(delayMs)}ms | Saved posts so far: ${savedPosts.length}`,
      );

      await delay(delayMs);

      // Check if scroll position changed
      if (window.scrollY === lastScrollY) {
        stagnantCount++;
        console.log("[bookmark]", `Scroll position stagnant (${stagnantCount}/${stagnantLimit})`);
        if (stagnantCount >= stagnantLimit) {
          console.log("[bookmark]", "Scroll position didn't change, stopping scroll loop.");
          break;
        }
      } else {
        stagnantCount = 0;
      }

      lastScrollY = window.scrollY;

      if (pages && savedPosts.length >= pages) {
        console.log(
          "[bookmark]",
          `Reached the specified number of pages: ${pages}, stopping scroll loop.`,
        );
        break;
      }
    }
  }

  function downloadFile() {
    const blob = new Blob([JSON.stringify(savedPosts, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function sendFileToApi() {
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(savedPosts, null, 2)], {
      type: "application/json",
    });

    formData.append("file", blob, filename);

    fetch("http://localhost:3000/api/import", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function scrape() {
    init();

    openAllPostsPage();
    await delay(5000);

    await scrollLoop2();

    if (download) downloadFile();
    if (send) sendFileToApi();
  }

  setTimeout(scrape, 5000);
}

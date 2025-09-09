declare global {
  interface Window {
    savedPosts: unknown[];
  }
}

type Props = {
  pages?: number;
  download?: boolean;
  send?: boolean;
};

export function twitterScraper({ pages, download, send }: Props) {
  console.log("[bookmark]", "Twitter Scraper initializing... v4");

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
              requestUrl.includes("/i/api/graphql") &&
              this.response.includes("bookmark_timeline_v2")
            ) {
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
    const link = document.querySelector<HTMLAnchorElement>('a[href="/i/bookmarks"]');
    if (!link) return;

    link.click();
  }

  function getLastPost() {
    const articles = document.querySelectorAll("article");
    const lastArticle = articles.length > 0 ? articles[articles.length - 1] : undefined;
    return lastArticle;
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

  function downloadFile(filename: string) {
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

  //   function sendFileToApi(filename: string, date: Date) {
  //     const formData = new FormData();
  //     const blob = new Blob([JSON.stringify(savedPosts, null, 2)], {
  //       type: "application/json",
  //     });

  //     formData.append("file", blob, filename);
  //     formData.append("scrapedAt", date.toISOString());
  //     formData.append("type", "twitter");

  //     fetch("http://localhost:3000/api/import", {
  //       method: "POST",
  //       body: formData,
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Success:", data);
  //       })
  //       .catch((error) => {
  //         console.error("Error:", error);
  //       });
  //   }

  function formatDate(date = new Date()) {
    const pad = (n: number) => n.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  async function scrape() {
    init();

    openAllPostsPage();
    await delay(5000);

    await scrollLoop2();

    const date = new Date();
    const filename = `twitter_${formatDate(date)}.json`;

    if (download) downloadFile(filename);
    // if (send) sendFileToApi(filename, date);
  }

  setTimeout(scrape, 5000);
}

type Props = {
  posts?: number;
};

export function tiktokCleaner({ posts }: Props) {
  console.log("[bookmark]", "Tiktok Post Cleaner initializing... v4");

  function openAllPostsPage() {
    const favoritesLink = Array.from(document.querySelectorAll("span")).find(
      (el) => el.textContent?.trim() === "Favorites",
    );
    if (!favoritesLink) return;

    favoritesLink.click();
  }

  function openFirstPost() {
    const firstContainer = document.getElementById("column-item-video-container-0");
    if (!firstContainer) return;
    const href = firstContainer.querySelector<HTMLAnchorElement>('a[href*="/video/"]');
    if (!href) return;
    href.click();
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function remove() {
    const allButtons = document.querySelectorAll("button");

    const matchingButtons = Array.from(allButtons).filter((button) =>
      /ButtonActionItem/.test(button.className),
    );

    const unsavedButton = matchingButtons[matchingButtons.length - 1] as HTMLButtonElement | null;
    if (unsavedButton === null) {
      console.log("[bookmark]", "No more posts to remove.");
      return;
    }
    unsavedButton.click();
  }

  function nextPost() {
    const nextVideoButton = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Go to next video"]',
    );
    nextVideoButton?.click();
  }

  async function unsave() {
    openAllPostsPage();
    await delay(5000);
    openFirstPost();

    for (let i = 0; i < (posts || 10000); i++) {
      remove();
      nextPost();
      console.log("[bookmark]", `Post ${i + 1} un-saved.`);
      await delay(750);
    }
  }

  setTimeout(unsave, 5000);
}

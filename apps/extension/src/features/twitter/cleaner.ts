type Props = {
  posts?: number;
};

export function twitterCleaner({ posts }: Props) {
  console.log("[bookmark]", "Twitter Post Cleaner initializing... v4");

  function openAllPostsPage() {
    const link = document.querySelector<HTMLAnchorElement>('a[href="/i/bookmarks"]');
    if (!link) return;

    link.click();
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function remove() {
    const buttonsClass = `.css-175oi2r.r-1777fci.r-bt1l66.r-bztko3.r-lrvibr.r-1loqt21.r-1ny4l3l[data-testid="removeBookmark"]`;

    const unsavedButton = document.querySelector<HTMLButtonElement>(buttonsClass);
    if (unsavedButton === null) {
      console.log("[bookmark]", "No more posts to remove.");
      return;
    }

    unsavedButton.click();
  }

  async function unsave() {
    openAllPostsPage();
    await delay(5000);

    for (let i = 0; i < (posts || 10000); i++) {
      await remove();
      console.log("[bookmark]", `Post ${i + 1} un-saved.`);
      await delay(750);
    }
  }

  setTimeout(unsave, 5000);
}

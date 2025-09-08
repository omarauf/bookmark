type Props = {
  username: string;
  posts?: number;
};

export function instagramCleaner({ username, posts }: Props) {
  console.log("[bookmark]", "Instagram Post Cleaner initializing... v4");

  function openAllPostsPage() {
    const link = document.querySelector<HTMLAnchorElement>(
      `a[href="/${username}/saved/all-posts/"]`,
    );
    if (!link) return;
    link.click();
  }

  function openFirstPost() {
    const href = document.querySelector<HTMLAnchorElement>('a[href^="/p/"]');
    if (!href) return;
    href.click();
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function remove() {
    const unsaveSvg = document.querySelector('svg[aria-label="Remove"]');
    let divButton = unsaveSvg?.parentElement;

    while (divButton && divButton.getAttribute("role") !== "button") {
      divButton = divButton.parentElement;
    }

    if (divButton && "click" in divButton) {
      divButton.click();
    }

    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 50) + 100));

    const removeButton = Array.from(
      document.querySelectorAll<HTMLButtonElement>('button[tabindex="0"]'),
    ).find((btn) => btn.textContent.trim() === "Remove");

    if (removeButton) {
      removeButton.click();
    }

    const next = document.querySelector('svg[aria-label="Next"]')?.closest("button");
    next?.click();
    const delay = Math.floor(Math.random() * 50) + 750;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  async function unsave() {
    openAllPostsPage();
    await delay(5000);
    openFirstPost();

    for (let i = 0; i < (posts || 10000); i++) {
      await remove();
      console.log("[bookmark]", `Post ${i + 1} un-saved.`);
      await delay(750);
    }
  }

  setTimeout(unsave, 5000);
}

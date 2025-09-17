import type { PopulatedTwitterPost } from "@workspace/contracts/twitter/post";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { staticFile } from "@/api/static-file";
import { fShortenNumber } from "@/utils/format-number";
import { fDateTime } from "@/utils/format-time";
import { detectLanguage } from "@/utils/string";
import * as icons from "./icons";
import { TwitterMediaCard } from "./media";

type Props = {
  post: PopulatedTwitterPost;
};

export function TwitterCard({ post }: Props) {
  return (
    <div className="flex w-full max-w-[560px] flex-col gap-4 rounded-2xl border bg-primary-foreground p-4 text-foreground">
      <div dir="ltr" className="flex">
        <Avatar className="h-10.5 w-10.5">
          <AvatarImage
            src={staticFile(post.creator.profilePicture || "")}
            alt={post.creator.username}
          />
          <AvatarFallback>{post.creator.username.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="ml-3">
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm">{post.creator.name || "N/A"}</p>
            {post.creator.verified && <icons.Verified />}
          </div>
          <p className="font-medium text-xs opacity-60">@{post.creator.username}</p>
        </div>
        <div className="flex-grow" />
        <a href={post.url} className="opacity-80 hover:opacity-100" target="_blank">
          <icons.Twitter />
        </a>
      </div>

      <div className="text-sm" dir={detectLanguage(post.caption) === "arabic" ? "rtl" : "ltr"}>
        {post.caption
          ?.split("\n")
          .map((line, i) => (line === "" ? <br key={i} /> : <p key={i}>{line}</p>))}
      </div>

      <TwitterMediaCard media={post.media} />

      {post.quoted && (
        <div className="overflow-hidden rounded-2xl border border-[#EDF2F720]">
          <div dir="ltr" className="flex items-center gap-1 p-3 text-xs">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={staticFile(post.quoted.creator.profilePicture || "")}
                alt={post.quoted.creator.username}
              />
              <AvatarFallback>
                {post.quoted.creator.username.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <p>{post.quoted.creator.name}</p>
            {post.quoted.creator.verified && <icons.Verified />}
            <p className="opacity-60">@{post.quoted.creator.username}</p>
            <p> {fDateTime(post.quoted.createdAt, "MMM DD, YYYY")}</p>
          </div>
          <div className="px-4 text-sm">
            {post.quoted.caption
              ?.split("\n")
              .map((line, i) => (line === "" ? <br key={i} /> : <p key={i}>{line}</p>))}
          </div>

          <TwitterMediaCard
            media={post.quoted.media}
            className="mt-3 aspect-video w-full rounded-t-none"
          />
        </div>
      )}

      <p dir="ltr" className="text-xs opacity-60">
        {fDateTime(post.createdAt, "hh:mm A · MMM DD, YYYY")}
      </p>

      <div className="w-full border-red-[#ffffff10] border-t opacity-10" />

      <div dir="ltr" className="flex justify-between">
        <div className="flex items-center gap-2 text-sm opacity-60">
          <icons.Comment />
          <p>{fShortenNumber(post.replies)}</p>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-60">
          <icons.ReTweet />
          <p>{fShortenNumber(post.retweets)}</p>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-60">
          <icons.Like />
          <p>{fShortenNumber(post.likes)}</p>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-60">
          <icons.Bookmark />
          <p>{fShortenNumber(post.bookmarks)}</p>
        </div>

        <div className="flex items-center gap-2 text-sm opacity-60">
          <icons.Bookmark />
          <p>{fShortenNumber(post.views)}</p>
        </div>
      </div>
    </div>
  );
}

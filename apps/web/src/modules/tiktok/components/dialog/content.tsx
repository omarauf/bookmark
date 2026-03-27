import type { Post } from "@workspace/contracts/post";
import { staticFile } from "@/api/static-file";
import { cn } from "@/lib/utils";

type Props = {
  post: Post;
  className?: string;
};

export function RenderContent({ post, className }: Props) {
  const media = post.media[0];
  if (media.type === "video") {
    const aspectRatio = media.width / media.height;

    return (
      <video
        src={staticFile(media.key)}
        autoPlay
        controls
        tabIndex={-1}
        className={cn(className, "rounded-l-xl")}
        style={{
          aspectRatio: `${aspectRatio}`,
          width: "100%",
          height: "100%",
        }}
      >
        <track kind="captions" src={undefined} label="No captions" />
      </video>
    );
  }

  // if (media.type === "carousel") {
  //   return <CarouselPosts post={media} className={className} />;
  // }

  const aspectRatio = media.width / media.height;
  return (
    <img
      src={staticFile(media.key)}
      alt="Tiktok post media"
      className={className}
      style={{
        aspectRatio: `${aspectRatio}`,
        width: "100%",
        height: "100%",
      }}
    />
  );
}

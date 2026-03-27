import type { Post } from "@workspace/contracts/post";
import { staticFile } from "@/api/static-file";
import { cn } from "@/lib/utils";
import { CarouselPosts } from "./carousel";

type Props = {
  post: Post;
  className?: string;
};

export function RenderContent({ post, className }: Props) {
  const { media } = post;

  if (media.length === 0) return null;

  if (media.length === 1 && media[0].type === "video") {
    const aspectRatio = media[0].width / media[0].height;

    return (
      <video
        src={staticFile(media[0].key)}
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

  if (media.length === 1 && media[0].type === "image") {
    const aspectRatio = media[0].width / media[0].height;

    return (
      <img
        src={staticFile(media[0].key)}
        alt="Instagram post media"
        className={className}
        style={{
          aspectRatio: `${aspectRatio}`,
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  return <CarouselPosts post={post} className={className} />;
}

import type { PopulatedTiktokPost } from "@workspace/contracts/tiktok/post";
import { cn } from "@workspace/ui/lib/utils";
import { staticFile } from "@/api/static-file";

type Props = {
  post: PopulatedTiktokPost;
  className?: string;
};

export function RenderContent({ post, className }: Props) {
  const media = post.media[0];
  if (media.mediaType === "video") {
    const aspectRatio = media.width / media.height;

    return (
      <video
        src={staticFile(media.url)}
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

  // if (media.mediaType === "carousel") {
  //   return <CarouselPosts post={media} className={className} />;
  // }

  const aspectRatio = media.width / media.height;
  return (
    <img
      src={staticFile(media.url)}
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

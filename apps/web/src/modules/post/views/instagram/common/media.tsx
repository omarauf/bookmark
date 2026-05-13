import { staticFile } from "@/api/static-file";
import { cn } from "@/lib/utils";
import { useDisplaySettingsStore } from "@/modules/post/controls/display-setting-store";
import { useAutoPlay } from "@/modules/post/hooks/use-auto-play";
import { CarouselPosts } from "./carousel";
import { usePostContext } from "./context";

type Props = {
  className?: string;
};

export function Media({ className }: Props) {
  const autoPlay = useDisplaySettingsStore((s) => s.autoPlay);
  const videoRef = useAutoPlay(autoPlay);
  const { media } = usePostContext();

  if (media.length === 0) return null;

  const classNames = cn("h-full w-full object-cover", className);

  if (media.length === 1 && media[0].type === "video") {
    const aspectRatio = media[0].width / media[0].height;

    return (
      <video
        src={staticFile(media[0].key)}
        ref={videoRef}
        controls
        tabIndex={-1}
        className={classNames}
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
        className={classNames}
        style={{
          aspectRatio: `${aspectRatio}`,
          width: "100%",
          height: "100%",
        }}
      />
    );
  }

  return <CarouselPosts className={classNames} />;
}

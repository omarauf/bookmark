import type { InstagramCarouselMedia } from "@workspace/contracts/instagram/media";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import { staticFile } from "@/api/static-file";

type Props = { post: InstagramCarouselMedia; className?: string };

export function CarouselPosts({ post, className }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel className="relative h-ful max-w-[1000px]" setApi={setApi}>
      <CarouselContent className="h-full">
        {post.media.map((m, index) => (
          <CarouselItem key={index}>
            <img
              alt={`Instagram post ${index + 1}`}
              src={staticFile(m.url)}
              className={className}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 translate-x-1/2" />
      <CarouselNext className="-translate-x-1/2 right-0" />

      <div className="-translate-x-1/2 absolute bottom-2 left-1/2 flex translate-y-1/2 gap-2 rounded-full bg-black/50 p-2 text-white">
        {post.media.map((p, i) => (
          <div
            key={p.url}
            aria-hidden="true"
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "aspect-square w-3 cursor-pointer rounded-full bg-white",
              i === current && "bg-gray-600",
            )}
          />
        ))}
      </div>
    </Carousel>
  );
}

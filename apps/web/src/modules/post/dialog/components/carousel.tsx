import { useEffect, useState } from "react";
import { staticFile } from "@/api/static-file";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { usePostContext } from "../utils/context";

type Props = {
  className?: string;
};

export function CarouselPosts({ className }: Props) {
  const { media } = usePostContext();
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
    <Carousel className="relative h-ful max-w-250" setApi={setApi}>
      <CarouselContent className="bg-red-300" contentClassName="h-full flex items-center">
        {media.map((m, index) => (
          <CarouselItem key={index}>
            <img
              alt={`Instagram post ${index + 1}`}
              src={staticFile(m.key)}
              className={className}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious className="left-0 translate-x-1/2" />
      <CarouselNext className="right-0 -translate-x-1/2" />

      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 translate-y-1/2 gap-2 rounded-full bg-black/50 p-2 text-white">
        {media.map((p, i) => (
          <div
            key={p.key}
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

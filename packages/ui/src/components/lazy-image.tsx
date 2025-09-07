import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export function LazyImage({ src, alt, className }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative h-full w-full`}>
      <img
        src={src + "?thumbnail=true"}
        alt={`${alt} thumbnail`}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-150 ease-in-out",
          isLoaded ? "opacity-0" : "opacity-100",
          className,
        )}
        aria-hidden="true"
      />

      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-150 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

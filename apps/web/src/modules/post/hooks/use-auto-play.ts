import { useEffect, useRef } from "react";

export function useAutoPlay(enabled: boolean = false) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!enabled) {
      video.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return videoRef;
}

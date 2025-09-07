import { Button } from "@workspace/ui/components/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function GoTop() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={!isScrolled}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed right-8 bottom-8 z-50 h-9",
        "transition-opacity duration-300",
        isScrolled ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ArrowUp />
    </Button>
  );
}

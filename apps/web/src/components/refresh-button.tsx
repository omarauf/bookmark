import { motion, useAnimation } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  onRefresh: () => Promise<void>;
};

export function RefreshButton({ onRefresh }: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const controls = useAnimation();

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Start the spin animation with ease-in-out for acceleration/deceleration
    controls.start({
      rotate: 360,
      transition: {
        duration: 1.2,
        ease: "easeInOut", // Accelerates then decelerates
        repeat: Infinity,
        repeatType: "loop",
      },
    });

    try {
      await onRefresh();
    } finally {
      // Ensure minimum visible spin time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Stop at a natural completion point with deceleration
      await controls.start({
        rotate: 360,
        transition: {
          duration: 0.4,
          ease: "easeOut",
        },
      });

      // Reset to initial position without animation
      controls.set({ rotate: 0 });
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="h-8"
    >
      <motion.div animate={controls} initial={{ rotate: 0 }} style={{ display: "inline-flex" }}>
        <RefreshCw className="h-4 w-4" />
      </motion.div>
    </Button>
  );
}

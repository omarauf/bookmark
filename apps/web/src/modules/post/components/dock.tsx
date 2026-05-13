import { motion } from "framer-motion";
import { Home, Mail, Settings, User } from "lucide-react";
import { useState } from "react";

const dockItems = [
  { icon: Home, label: "Home" },
  { icon: User, label: "Profile" },
  { icon: Mail, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

export function FloatingDock() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="pointer-events-auto fixed top-1/2 right-0 z-60 -translate-y-1/2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        initial={{ width: 20 }}
        animate={{ width: hovered ? 200 : 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="overflow-hidden rounded-l-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl backdrop-blur-md"
      >
        {dockItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-800"
            >
              <Icon className="h-5 w-5 text-white" />

              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: hovered ? 1 : 0,
                  x: hovered ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap text-sm text-white"
              >
                {item.label}
              </motion.span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

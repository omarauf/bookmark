import { Bookmark } from "@/features/bookmark/app";
import { Instagram } from "@/features/instagram/app";
import { Tiktok } from "@/features/tiktok/app";
import { Twitter } from "@/features/twitter/app";

export default function App() {
  return (
    <div className="w-md bg-neutral-900 text-white">
      <Instagram />

      <Twitter />

      <Tiktok />

      <Bookmark />
    </div>
  );
}

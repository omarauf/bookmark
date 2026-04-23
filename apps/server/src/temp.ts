import { fetchLinkPreviews } from "./modules/link/background";

const a = await fetchLinkPreviews(1000);
console.log("Batch result:", a);

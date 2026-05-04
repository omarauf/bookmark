import { JobErrorCard } from "./error";
import { JobLogsCard } from "./log";
import { JobMetadataCard } from "./metadata";
import { JobProgressCard } from "./progress";
import { JobTimelineCard } from "./timeline";

export const JobCards = {
  Error: JobErrorCard,
  Log: JobLogsCard,
  Metadata: JobMetadataCard,
  Progress: JobProgressCard,
  Timeline: JobTimelineCard,
};

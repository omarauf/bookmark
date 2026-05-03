import type { JobStatus } from "@workspace/contracts/job";

export const STATUS_COLORS: Record<JobStatus, string> = {
  pending: "#64748b",
  processing: "#3b82f6",
  completed: "#10b981",
  failed: "#f43f5e",
  cancelled: "#a8a29e",
  retrying: "#f59e0b",
};

import type { Job } from "@workspace/contracts/job";
import { AlertTriangle, CheckCircle2, Clock, XCircle, ZapIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fDateTime } from "@/utils/format-time";

type Props = {
  job: Job;
};

export function JobTimelineCard({ job }: Props) {
  const events = buildTimeline(job);

  return (
    <Card className="rounded-none border-border/50 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-mono font-normal text-[10px] text-muted-foreground uppercase tracking-widest">
          <Clock className="h-3.5 w-3.5" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {events.map((event, i) => (
            <div key={event.label} className="flex items-start gap-3">
              {/* Line + Dot */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    eventStatusColor[event.status],
                  )}
                >
                  {event.icon}
                </div>
                {i < events.length - 1 && (
                  <div
                    className={cn(
                      "my-1 h-8 w-px",
                      event.status === "done" ? "bg-foreground" : "bg-muted-foreground/20",
                    )}
                  />
                )}
              </div>
              {/* Label */}
              <div className="pt-0.5 pb-6">
                <p className="font-mono text-foreground text-xs">{event.label}</p>

                <p className="font-mono text-[10px] text-muted-foreground">
                  {fDateTime(event.time, "DD MMM YYYY hh:mm:ss A")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const eventStatusColor: Record<string, string> = {
  done: "border-foreground bg-foreground text-background",
  active: "border-blue-400 bg-blue-400/10 text-blue-400",
  pending: "border-muted-foreground/30 text-muted-foreground",
};

function buildTimeline(job: Job) {
  const timeline = [
    {
      label: "Created",
      time: job.createdAt,
      icon: <Clock className="h-3 w-3" />,
      status: "done",
    },
    {
      label: "Started",
      time: job.startedAt,
      icon: <ZapIcon className="h-3 w-3" />,
      status: job.startedAt ? "done" : job.status === "pending" ? "pending" : "active",
    },
  ];

  if (job.status === "completed") {
    timeline.push({
      label: "Completed",
      time: job.completedAt,
      icon: <CheckCircle2 className="h-3 w-3" />,
      status: "done",
    });
  } else if (job.status === "failed") {
    timeline.push({
      label: "Failed",
      time: job.failedAt,
      icon: <XCircle className="h-3 w-3" />,
      status: "done",
    });
  } else if (job.status === "cancelled") {
    timeline.push({
      label: "Cancelled",
      time: job.cancelledAt,
      icon: <AlertTriangle className="h-3 w-3" />,
      status: "done",
    });
  }

  return timeline;
}

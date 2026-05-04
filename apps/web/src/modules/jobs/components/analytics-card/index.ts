import { AttemptDistribution } from "./attempt-distribution";
import { AverageDuration } from "./duration";
import { GroupSize } from "./group-size";
import { JobByType } from "./job-by-type";
import { JobOverTime } from "./job-over-time";
import { Overview } from "./overview";
import { StatusDistributionCard } from "./status-distribution";
import { TopError } from "./top-error";

export const AnalyticsCard = {
  Overview,
  StatusDistributionCard,
  JobByType,
  JobOverTime,
  AverageDuration,
  AttemptDistribution,
  GroupSize,
  TopError,
};

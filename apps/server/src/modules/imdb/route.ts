import { protectedProcedure } from "@/lib/orpc";
import { createSingleJob } from "@/modules/job/service";

export const imdbRouter = {
  sync: protectedProcedure.handler(async () => {
    const job = await createSingleJob({
      type: "imdb_discover",
      status: "pending",
      payload: {},
    });

    return job;
  }),
};

import { customType } from "drizzle-orm/pg-core";

export const ltree = customType<{ data: string; driverData: string }>({
  dataType() {
    return "ltree";
  },
});

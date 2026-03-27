import { getTableColumns, sql } from "drizzle-orm";
import type { AnyPgTable, PgTable } from "drizzle-orm/pg-core";
import { db } from "../index";

export async function getHistogram<T extends PgTable>(
  table: T,
  columnName: keyof T["_"]["columns"],
  bucketSize: number,
) {
  const columnMap = getTableColumns(table);

  const column = columnMap[columnName];

  const [{ min, max }] = await db
    .select({
      min: sql<number>`MIN(${column})`,
      max: sql<number>`MAX(${column})`,
    })
    .from(table as AnyPgTable);

  const bins = bucketSize;
  const binSize = (max - min) / bins;

  const results = await db.execute<{ min: number; max: number; count: number }>(sql`
    WITH calculated_bins AS (
      SELECT FLOOR((${column} - ${min}) / NULLIF(${binSize}, 0)) as bucket_idx FROM ${table}
    )
    SELECT 
      (bucket_idx * ${binSize}) + ${min} as "min",
      (bucket_idx * ${binSize}) + ${min} + ${binSize} as "max", 
      COUNT(*)::int as "count"
    FROM calculated_bins
    GROUP BY bucket_idx
    ORDER BY bucket_idx ASC
  `);

  return {
    min,
    max,
    bins: results.rows,
  };
}

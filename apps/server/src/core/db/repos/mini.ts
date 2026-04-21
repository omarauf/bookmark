// biome-ignore-all lint/suspicious/noExplicitAny: This file needs a lot of any to work with Drizzle ORM

import {
  asc,
  count,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
  ilike,
  inArray,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import type { PgColumn, PgTable, PgTableWithColumns } from "drizzle-orm/pg-core";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { PaginationResult } from "node_modules/@workspace/contracts/src/common/pagination-query";
import { type ReplaceNullWithUndefined, replaceNullWithUndefined } from "@/utils/object";

// Generic Repository Interface
interface IRepository<T extends PgTable> {
  findAll(): Promise<InferSelectModel<T>[]>;
  findById(id: string | number): Promise<InferSelectModel<T> | undefined>;
  findOne(where?: SQL): Promise<InferSelectModel<T> | undefined>;
  search(term: string, columns: (keyof T["_"]["columns"])[]): Promise<InferSelectModel<T>[]>;
  exists(where?: SQL): Promise<boolean>;
  existsById(id: string | number): Promise<boolean>;
  findMany(where: SQL): Promise<InferSelectModel<T>[]>;
  create(data: InferInsertModel<T>): Promise<InferSelectModel<T>>;
  createMany(data: InferInsertModel<T>[]): Promise<InferInsertModel<T>[]>;
  update(
    id: string | number,
    data: Partial<InferInsertModel<T>>,
  ): Promise<InferSelectModel<T> | undefined>;
  delete(id: string | number): Promise<boolean>;
  count(where?: SQL): Promise<number>;
}

// Generic Repository Implementation
export class MiniRepository<T extends PgTable> implements IRepository<T> {
  protected db: PostgresJsDatabase<Record<string, unknown>>;
  protected table: T;
  protected idColumn: PgColumn;

  constructor(db: PostgresJsDatabase<Record<string, unknown>>, table: T, idColumn: PgColumn) {
    this.db = db;
    this.table = table;
    this.idColumn = idColumn;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Resolve a column from the table by key, throwing if it doesn't exist.
   */
  protected col(key: string) {
    const column = (this.table as Record<string, unknown>)[key];
    if (!column) throw new Error(`Column "${key}" not found on table`);
    return column as SQL;
  }

  private buildOrderBy(orderBy: OrderByOption<T>[]) {
    return orderBy.map(({ column, direction = "asc" }) => {
      const col = this.col(column as string);
      return direction === "desc" ? desc(col) : asc(col);
    });
  }

  // ── Repository Methods ───────────────────────────────────────────────────────

  async findAll(): Promise<InferSelectModel<T>[]> {
    return (await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)) as InferSelectModel<T>[];
  }

  async findById(id: string | number): Promise<InferSelectModel<T> | undefined> {
    const results = await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(eq(this.idColumn, id))
      .limit(1);

    return results[0] as InferSelectModel<T> | undefined;
  }

  async findByIds(ids: (string | number)[]): Promise<InferSelectModel<T>[]> {
    const results = await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(inArray(this.idColumn, ids));

    return results as InferSelectModel<T>[];
  }

  async findOne(where?: SQL): Promise<InferSelectModel<T> | undefined> {
    const results = await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(where ?? sql`TRUE`)
      .limit(1);

    return results[0] as InferSelectModel<T> | undefined;
  }

  async search(term: string, columns: (keyof T["_"]["columns"])[]): Promise<InferSelectModel<T>[]> {
    if (!columns.length) return [];
    const pattern = `%${term}%`;
    const clauses = columns.map((col) => ilike(this.col(col as string), pattern));
    const rows = await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(or(...clauses));
    return rows as InferSelectModel<T>[];
  }

  async exists(where?: SQL): Promise<boolean> {
    const results = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table as PgTableWithColumns<any>)
      .where(where ?? sql`TRUE`)
      .limit(1);

    return (results[0]?.count ?? 0) > 0;
  }

  async existsById(id: string | number): Promise<boolean> {
    const results = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table as PgTableWithColumns<any>)
      .where(eq(this.idColumn, id))
      .limit(1);

    return (results[0]?.count ?? 0) > 0;
  }

  async findMany(where: SQL): Promise<InferSelectModel<T>[]> {
    return (await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(where)) as InferSelectModel<T>[];
  }

  async create(data: InferInsertModel<T>): Promise<InferSelectModel<T>> {
    const results = await this.db.insert(this.table).values(data).returning();

    return results[0] as InferSelectModel<T>;
  }

  /**
   * Insert multiple rows and return them.
   */
  async createMany(data: InferInsertModel<T>[]): Promise<InferInsertModel<T>[]> {
    if (data.length === 0) return [];
    const rows = await this.db
      .insert(this.table)
      .values(data as never)
      .returning();
    return rows as InferInsertModel<T>[];
  }

  async update(
    id: string | number,
    data: Partial<InferInsertModel<T>>,
  ): Promise<InferSelectModel<T> | undefined> {
    const results = (await this.db
      .update(this.table)
      .set(data as any)
      .where(eq(this.idColumn, id))
      .returning()) as InferSelectModel<T>[];

    return results[0] as InferSelectModel<T> | undefined;
  }

  async delete(id: string | number): Promise<boolean> {
    const results = await this.db.delete(this.table).where(eq(this.idColumn, id)).returning();

    return results.length > 0;
  }

  async count(where?: SQL): Promise<number> {
    let query = this.db
      .select({ total: count() })
      .from(this.table as PgTableWithColumns<any>)
      .$dynamic();
    if (where) query = query.where(where);
    const [{ total }] = await query;
    return total;
  }

  /**
   * Paginated query. Returns data + meta info.
   */
  async paginated(
    pagination?: FindManyOptions<T>,
  ): Promise<PaginationResult<ReplaceNullWithUndefined<InferSelectModel<T>>>> {
    const { page = 1, perPage = 10, where, orderBy } = pagination || {};
    const offset = (page - 1) * perPage;

    let dataQuery = this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .$dynamic();
    let countQuery = this.db
      .select({ total: count() })
      .from(this.table as PgTableWithColumns<any>)
      .$dynamic();

    if (where) {
      dataQuery = dataQuery.where(where);
      countQuery = countQuery.where(where);
    }
    if (orderBy?.length) dataQuery = dataQuery.orderBy(...this.buildOrderBy(orderBy));

    dataQuery = dataQuery.limit(perPage).offset(offset);

    const [rows, [{ total }]] = await Promise.all([dataQuery, countQuery]);
    const totalPages = Math.ceil(total);

    return {
      items: replaceNullWithUndefined(rows) as ReplaceNullWithUndefined<InferSelectModel<T>>[],
      total,
      page,
      perPage,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }
}

interface FindManyOptions<T extends PgTable> {
  where?: SQL;
  orderBy?: OrderByOption<T>[];
  offset?: number;
  page?: number;
  perPage?: number;
}

interface OrderByOption<T extends PgTable> {
  column: keyof T["_"]["columns"];
  direction?: "asc" | "desc";
}

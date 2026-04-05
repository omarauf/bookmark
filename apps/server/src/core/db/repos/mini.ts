// biome-ignore-all lint/suspicious/noExplicitAny: This file needs a lot of any to work with Drizzle ORM
import { eq, type InferInsertModel, type InferSelectModel, type SQL, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgColumn, PgTable, PgTableWithColumns } from "drizzle-orm/pg-core";

// Generic Repository Interface
export interface IRepository<T extends PgTable> {
  findAll(): Promise<InferSelectModel<T>[]>;
  findById(id: string | number): Promise<InferSelectModel<T> | undefined>;
  findOne(where?: SQL): Promise<InferSelectModel<T> | undefined>;
  exists(where?: SQL): Promise<boolean>;
  findMany(where: SQL): Promise<InferSelectModel<T>[]>;
  create(data: InferInsertModel<T>): Promise<InferSelectModel<T>>;
  update(
    id: string | number,
    data: Partial<InferInsertModel<T>>,
  ): Promise<InferSelectModel<T> | undefined>;
  delete(id: string | number): Promise<boolean>;
}

// Generic Repository Implementation
export class MiniRepository<T extends PgTable> implements IRepository<T> {
  protected db: NodePgDatabase<Record<string, unknown>>;
  protected table: T;
  protected idColumn: PgColumn;

  constructor(db: NodePgDatabase<Record<string, unknown>>, table: T, idColumn: PgColumn) {
    this.db = db;
    this.table = table;
    this.idColumn = idColumn;
  }

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

  async findOne(where?: SQL): Promise<InferSelectModel<T> | undefined> {
    const results = await this.db
      .select()
      .from(this.table as PgTableWithColumns<any>)
      .where(where ?? sql`TRUE`)
      .limit(1);

    return results[0] as InferSelectModel<T> | undefined;
  }

  async exists(where?: SQL): Promise<boolean> {
    const results = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table as PgTableWithColumns<any>)
      .where(where ?? sql`TRUE`)
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
}

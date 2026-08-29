
/**
 * Unified Postgres access.
 *
 * Production (Neon / any Postgres): set DATABASE_URL — uses the `pg` Pool.
 * Local dev / sandbox with no DATABASE_URL: uses an in-process PGlite database
 * persisted to ./.pgdata so data survives restarts. Same SQL either way.
 *
 * Query uses $1, $2 placeholders in both drivers.
 */

type Row = Record<string, unknown>;
export type QueryResult<T = Row> = { rows: T[]; rowCount: number };

interface Client {
  query<T = Row>(text: string, params?: unknown[]): Promise<QueryResult<T>>;
}

const g = globalThis as unknown as { __nsdb?: Client };

async function makeClient(): Promise<Client> {
  const url = process.env.DATABASE_URL;

  if (url) {
    // Production path: node-postgres. Works with Neon's direct/pooled URL.
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: url,
      ssl: url.includes("sslmode=require") || url.includes("neon.tech")
        ? { rejectUnauthorized: false }
        : undefined,
      max: 5,
    });
    return {
      async query<T = Row>(text: string, params: unknown[] = []) {
        const r = await pool.query(text, params);
        return { rows: r.rows as T[], rowCount: r.rowCount ?? 0 };
      },
    };
  }

  // Local/sandbox path: PGlite, persisted to disk.
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite(process.env.PGLITE_DIR || "./.pgdata");
  return {
    async query<T = Row>(text: string, params: unknown[] = []) {
      const r = await db.query(text, params as never[]);
      return { rows: (r.rows as T[]) ?? [], rowCount: (r.rows as T[])?.length ?? 0 };
    },
  };
}

export async function db(): Promise<Client> {
  if (!g.__nsdb) g.__nsdb = await makeClient();
  return g.__nsdb;
}

/** Convenience: run a query and return rows. */
export async function q<T = Row>(text: string, params: unknown[] = []): Promise<T[]> {
  const client = await db();
  const r = await client.query<T>(text, params);
  return r.rows;
}

/** Convenience: first row or null. */
export async function one<T = Row>(text: string, params: unknown[] = []): Promise<T | null> {
  const rows = await q<T>(text, params);
  return rows[0] ?? null;
}

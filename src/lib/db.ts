import { neon } from '@neondatabase/serverless';

type NeonClient = ReturnType<typeof neon>;

let cachedSql: NeonClient | null = null;

function getDatabaseUrl() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  return databaseUrl;
}

export function getSql() {
  if (!cachedSql) {
    cachedSql = neon(getDatabaseUrl());
  }

  return cachedSql;
}

const sqlTarget = function sqlProxy() {} as unknown as NeonClient;

const sql = new Proxy(
  sqlTarget,
  {
    apply(_target, _thisArg, argumentsList) {
      const client = getSql() as unknown as (...args: unknown[]) => unknown;
      return client(...argumentsList);
    },
    get(_target, property) {
      const client = getSql() as unknown as Record<PropertyKey, unknown>;
      const value = client[property];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  },
) as NeonClient;

/**
 * Direct query execution using Neon serverless
 * @example
 * const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
 */
export async function query<T = any>(
  queryString: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await getSql().query(queryString, params);
    // Normalize common return shapes
    if (result && typeof result === 'object' && 'rows' in result) {
      // @ts-ignore
      return result.rows as T[];
    }
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Test database connection
 * @example
 * await testConnection();
 */
export async function testConnection(): Promise<{ success: boolean; error?: string; result?: any }> {
  try {
    const res = await getSql().query('SELECT 1 as ok');
    console.log('✅ Database connection successful:', res);
    return { success: true, result: res };
  } catch (error: any) {
    // Log full error for server-side debugging
    console.error('❌ Database connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export { sql };

export default {
  query,
  testConnection,
  sql,
};

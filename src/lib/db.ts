import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create Neon client
const sql = neon(DATABASE_URL);

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
    const result = await sql.query(queryString, params);
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
    const res = await sql.query('SELECT 1 as ok');
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

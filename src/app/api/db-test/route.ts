export const runtime = 'nodejs';

import { testConnection, query } from '@/lib/db';
import { NextResponse } from 'next/server';

/**
 * GET /api/db-test
 * Test endpoint to verify Neon DB connection
 */
export async function GET() {
  try {
    // Test connection
    const conn = await testConnection();

    if (!conn.success) {
      return NextResponse.json(
        { success: false, message: 'Database connection failed', error: conn.error },
        { status: 500 }
      );
    }

    // Try a simple query
    const result = await query('SELECT NOW() as current_time, version() as db_version');

    return NextResponse.json(
      { success: true, message: 'Neon DB connection successful!', data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error testing database connection',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

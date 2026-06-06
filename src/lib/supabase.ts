import { createClient } from '@supabase/supabase-js';
import { TeacherRecord } from '../types';

// Read configuration from env or dynamic local state
export function getSupabaseConfig() {
  const envUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('APP_SUPABASE_URL') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('APP_SUPABASE_ANON_KEY') || '' : '';

  return {
    url: envUrl || localUrl,
    key: envKey || localKey,
    isConfigured: !!(envUrl || localUrl) && !!(envKey || localKey),
    source: envUrl ? 'Environment (.env/Vercel)' : (localUrl ? 'LocalStorage (Dynamic UI)' : 'Not Configured')
  };
}

// Generate client dynamically to avoid hard-crash on empty setup
export function getSupabaseClient() {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;
  try {
    return createClient(url, key, {
      auth: {
        persistSession: false
      }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * 🚀 High-Performance Pagination Bypass Algorithm
 * Supabase Free Tier and general instances default to a maximum limit of 1000 rows returned per request.
 * This recursive function paginates over range buckets [0..999], [1000..1999], etc. 
 * to securely pull ALL rows beyond the 1,000 limit, resolving potential count bottlenecks.
 */
export async function supabaseFetchAllRows<T>(
  tableName: string, 
  customOrderColumn: string = 'id',
  batchSize: number = 1000
): Promise<{ data: T[]; error: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return { data: [], error: new Error('Supabase client is not configured.') };
  }

  let allRows: T[] = [];
  let from = 0;
  let to = batchSize - 1;
  let completed = false;
  let safetyLoopCounter = 0;

  try {
    while (!completed && safetyLoopCounter < 50) { // Limit to 50,000 rows maximum for safety
      safetyLoopCounter++;
      
      const { data, error, status } = await client
        .from(tableName)
        .select('*')
        .range(from, to)
        .order(customOrderColumn, { ascending: true });

      if (error) {
        return { data: [], error };
      }

      if (data && data.length > 0) {
        allRows = [...allRows, ...(data as T[])];
        
        // If we fetched fewer rows than the index batch limit, we reached the end of the collection
        if (data.length < batchSize) {
          completed = true;
        } else {
          from += batchSize;
          to += batchSize;
        }
      } else {
        completed = true;
      }
    }
    
    return { data: allRows, error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

/**
 * Tests connection with Supabase by reading the list of tables or querying a line
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; rowsCount?: number }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL or Secret Key is missing in the configuration.' };
  }

  try {
    // Quick test against 'teachers' table
    const { data, error } = await client
      .from('teachers')
      .select('id')
      .limit(1);

    if (error) {
      // If error says 'relation does not exist', table schema needs to be established
      if (error.code === 'PGRST116' || error.message.includes('relation "teachers" does not exist')) {
        return { 
          success: true, 
          message: 'ភ្ជាប់ជាមួយ Supabase បានជោគជ័យ! ប៉ុន្តែតារាង "teachers" មិនទាន់ត្រូវបានបង្កើតឡើងក្នុង Project របស់អ្នកទេ។ សូមលិខិតបង្កើត Table Schema សិន។' 
        };
      }
      return { success: false, message: ` error code ${error.code}: ${error.message}` };
    }

    return { 
      success: true, 
      message: 'ការតភ្ជាប់ដោយជោគជ័យ! ប្រព័ន្ធត្រៀមខ្លួនរួចជាស្រេចសម្រាប់ដំណើរការទិន្នន័យ។'
    };
  } catch (err: any) {
    return { success: false, message: err.message || 'Unknown network error connecting to Supabase.' };
  }
}

/**
 * Sync Local / Initial Data payload to Supabase Database
 */
export async function syncTeachersToSupabase(teachers: TeacherRecord[]): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase is not configured yet.' };
  }

  try {
    // 1. Upsert Teachers information (matching column names in schema.sql)
    const teachersPayload = teachers.map(t => ({
      id: t.id,
      no: t.no,
      name: t.name,
      gender: t.gender,
      remarks: t.remarks || ''
    }));

    const { error: tError } = await client
      .from('teachers')
      .upsert(teachersPayload, { onConflict: 'id' });

    if (tError) {
      return { success: false, message: `បរាជ័យក្នុងការ Upsert Teachers: ${tError.message}` };
    }

    return { success: true, message: 'បានធ្វើសមកាលកម្មទិន្នន័យលោកគ្រូ/អ្នកគ្រូសរុប ' + teachers.length + ' នាក់ ទៅកាន់ Supabase!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Error occurred during sync.' };
  }
}

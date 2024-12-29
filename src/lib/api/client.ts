import { createClient } from '@supabase/supabase-js';
import { createModuleLogger } from '../logger';
import type { Database } from '../../types/supabase';

const logger = createModuleLogger('api-client');

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

class APIClient {
  private static instance: APIClient;
  private supabase;

  private constructor() {
    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  public getSupabase() {
    return this.supabase;
  }

  public async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { contentType?: string }
  ) {
    try {
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          contentType: options?.contentType,
          upsert: true
        });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to upload file', { bucket, path, error });
      throw error;
    }
  }

  public getFileUrl(bucket: string, path: string) {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}

export const apiClient = APIClient.getInstance();
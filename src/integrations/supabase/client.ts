
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wjqasapafpemwkiuvoyt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqcWFzYXBhZnBlbXdraXV2b3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjI5ODQsImV4cCI6MjA2NjkzODk4NH0.PX89a2IxtHadJN5D6xKRL-4ocp8b1c-cYvz_PkPgKa8";



export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
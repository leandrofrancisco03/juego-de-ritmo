import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameScore {
  id: string;
  user_id: string;
  username?: string;
  score: number;
  max_combo: number;
  perfect_hits: number;
  good_hits: number;
  miss_hits: number;
  accuracy: number;
  speed: number;
  youtube_url?: string;
  created_at: string;
}

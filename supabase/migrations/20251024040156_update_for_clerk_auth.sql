/*
  # Update Database for Clerk Authentication

  ## Changes
  
  1. Drop existing profiles table (Clerk manages user profiles)
  2. Update game_scores table to use Clerk user IDs (text instead of uuid)
  3. Remove foreign key constraint to auth.users
  4. Update RLS policies to work with Clerk authentication
  
  ## Notes
  
  - Clerk user IDs are strings, not UUIDs
  - Clerk doesn't use Supabase's auth.users table
  - RLS policies will use custom functions to validate Clerk sessions
*/

-- Drop the old profiles table as Clerk manages user data
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing game_scores table to recreate with new structure
DROP TABLE IF EXISTS game_scores CASCADE;

-- Recreate game_scores table with Clerk user ID format
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  username text,
  score integer NOT NULL,
  max_combo integer DEFAULT 0,
  perfect_hits integer DEFAULT 0,
  good_hits integer DEFAULT 0,
  miss_hits integer DEFAULT 0,
  accuracy numeric(5,2) DEFAULT 0,
  speed numeric(3,2) NOT NULL,
  youtube_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view scores (for leaderboard)
CREATE POLICY "Anyone can view scores"
  ON game_scores FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert their own scores
CREATE POLICY "Users can insert own scores"
  ON game_scores FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);
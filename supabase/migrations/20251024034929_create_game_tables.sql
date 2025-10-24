/*
  # Create Game Database Schema

  ## Tables Created
  
  ### profiles
  - `id` (uuid, primary key, references auth.users)
  - `username` (text, unique, required) - Display name for the player
  - `avatar_url` (text, optional) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### game_scores
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - Player who achieved the score
  - `score` (integer, required) - Final game score
  - `max_combo` (integer, default 0) - Highest combo achieved
  - `perfect_hits` (integer, default 0) - Number of perfect hits
  - `good_hits` (integer, default 0) - Number of good hits
  - `miss_hits` (integer, default 0) - Number of missed hits
  - `accuracy` (numeric, default 0) - Overall accuracy percentage
  - `speed` (numeric, required) - Game speed/difficulty multiplier
  - `youtube_url` (text, optional) - Song URL if played
  - `created_at` (timestamptz) - When the score was achieved

  ## Security
  
  - RLS enabled on all tables
  - Users can read all profiles
  - Users can only update their own profile
  - Users can read all scores (for leaderboard)
  - Users can only insert their own scores
  - Users can only delete their own scores

  ## Indexes
  
  - Index on game_scores.score for leaderboard queries
  - Index on game_scores.created_at for recent scores
  - Index on game_scores.user_id for user's score history
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_scores table
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Game scores policies
CREATE POLICY "Users can view all scores"
  ON game_scores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own scores"
  ON game_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores"
  ON game_scores FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_created_at ON game_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_user_id ON game_scores(user_id);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
/*
  # Initial Schema for AI-Powered Coding Leaderboard Platform

  ## Overview
  This migration creates the complete database schema for a competitive coding platform
  where users practice DSA problems, share notes, and compete on leaderboards.

  ## New Tables

  ### 1. profiles
  Stores extended user profile information and statistics
  - `id` (uuid, PK, FK to auth.users) - User identifier
  - `username` (text, unique) - Display name
  - `total_problems` (int) - Count of successfully solved problems
  - `current_streak` (int) - Consecutive days of activity
  - `longest_streak` (int) - Best streak achieved
  - `total_time_minutes` (int) - Total coding time
  - `rank` (int) - Current leaderboard position
  - `score` (int) - Computed performance score
  - `last_active` (timestamptz) - Last activity timestamp
  - `created_at` (timestamptz) - Account creation time

  ### 2. code_submissions
  Tracks every code submission from the IDE
  - `id` (uuid, PK) - Submission identifier
  - `user_id` (uuid, FK) - Who submitted the code
  - `language` (text) - Programming language used
  - `code` (text) - The actual code
  - `problem_title` (text) - Problem being solved
  - `difficulty` (text) - easy/medium/hard
  - `status` (text) - passed/failed/error
  - `time_spent_seconds` (int) - Time taken to solve
  - `execution_time_ms` (int) - Code runtime
  - `memory_used_kb` (int) - Memory consumption
  - `created_at` (timestamptz) - Submission time

  ### 3. notes
  Shared preparation notes and resources
  - `id` (uuid, PK) - Note identifier
  - `user_id` (uuid, FK) - Note creator
  - `title` (text) - Note title
  - `content` (text) - Note content
  - `file_url` (text) - Optional file attachment
  - `tags` (text[]) - Categorization tags
  - `created_at` (timestamptz) - Creation time

  ### 4. queries
  Discussion forum questions
  - `id` (uuid, PK) - Query identifier
  - `user_id` (uuid, FK) - Question author
  - `title` (text) - Question title
  - `content` (text) - Question details
  - `tags` (text[]) - Topic tags
  - `created_at` (timestamptz) - Posted time

  ### 5. query_responses
  Answers to discussion questions
  - `id` (uuid, PK) - Response identifier
  - `query_id` (uuid, FK) - Parent question
  - `user_id` (uuid, FK, nullable) - Responder (null if AI)
  - `content` (text) - Answer content
  - `is_ai_response` (boolean) - AI vs human response
  - `created_at` (timestamptz) - Response time

  ### 6. leaderboard_snapshots
  Periodic leaderboard rankings
  - `id` (uuid, PK) - Snapshot identifier
  - `period` (text) - daily/weekly/monthly
  - `period_date` (date) - Date of snapshot
  - `rankings` (jsonb) - Serialized ranking data
  - `created_at` (timestamptz) - Snapshot time

  ## Security
  - All tables have RLS enabled
  - Users can read their own data and public data
  - Users can only modify their own submissions/notes/queries
  - Leaderboard is read-only for all users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  total_problems int DEFAULT 0,
  current_streak int DEFAULT 0,
  longest_streak int DEFAULT 0,
  total_time_minutes int DEFAULT 0,
  rank int DEFAULT 0,
  score int DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create code_submissions table
CREATE TABLE IF NOT EXISTS code_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  language text NOT NULL,
  code text NOT NULL,
  problem_title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status text NOT NULL CHECK (status IN ('passed', 'failed', 'error')),
  time_spent_seconds int DEFAULT 0,
  execution_time_ms int DEFAULT 0,
  memory_used_kb int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  file_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create queries table
CREATE TABLE IF NOT EXISTS queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create query_responses table
CREATE TABLE IF NOT EXISTS query_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id uuid REFERENCES queries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  content text NOT NULL,
  is_ai_response boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create leaderboard_snapshots table
CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
  period_date date NOT NULL,
  rankings jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(period, period_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_code_submissions_user_id ON code_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_created_at ON code_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_query_responses_query_id ON query_responses(query_id);
CREATE INDEX IF NOT EXISTS idx_profiles_score ON profiles(score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_rank ON profiles(rank ASC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE query_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for code_submissions
CREATE POLICY "Users can view their own submissions"
  ON code_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions"
  ON code_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notes (public read, own write)
CREATE POLICY "All notes are viewable by everyone"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for queries (public read, own write)
CREATE POLICY "All queries are viewable by everyone"
  ON queries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own queries"
  ON queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own queries"
  ON queries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own queries"
  ON queries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for query_responses (public read, own write)
CREATE POLICY "All responses are viewable by everyone"
  ON query_responses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own responses"
  ON query_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for leaderboard_snapshots (read-only for all)
CREATE POLICY "Leaderboard is viewable by everyone"
  ON leaderboard_snapshots FOR SELECT
  TO authenticated
  USING (true);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user statistics after submission
CREATE OR REPLACE FUNCTION public.update_user_stats()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'passed' THEN
    UPDATE profiles
    SET 
      total_problems = total_problems + 1,
      total_time_minutes = total_time_minutes + (NEW.time_spent_seconds / 60),
      last_active = now()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update stats on successful submission
DROP TRIGGER IF EXISTS on_submission_success ON code_submissions;
CREATE TRIGGER on_submission_success
  AFTER INSERT ON code_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats();
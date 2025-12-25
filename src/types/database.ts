export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          total_problems: number
          current_streak: number
          longest_streak: number
          total_time_minutes: number
          rank: number
          score: number
          last_active: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          total_problems?: number
          current_streak?: number
          longest_streak?: number
          total_time_minutes?: number
          rank?: number
          score?: number
          last_active?: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          total_problems?: number
          current_streak?: number
          longest_streak?: number
          total_time_minutes?: number
          rank?: number
          score?: number
          last_active?: string
          created_at?: string
        }
      }
      code_submissions: {
        Row: {
          id: string
          user_id: string
          language: string
          code: string
          problem_title: string
          difficulty: 'easy' | 'medium' | 'hard'
          status: 'passed' | 'failed' | 'error'
          time_spent_seconds: number
          execution_time_ms: number
          memory_used_kb: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          language: string
          code: string
          problem_title: string
          difficulty: 'easy' | 'medium' | 'hard'
          status: 'passed' | 'failed' | 'error'
          time_spent_seconds?: number
          execution_time_ms?: number
          memory_used_kb?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          language?: string
          code?: string
          problem_title?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          status?: 'passed' | 'failed' | 'error'
          time_spent_seconds?: number
          execution_time_ms?: number
          memory_used_kb?: number
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          file_url: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          file_url?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          file_url?: string | null
          tags?: string[]
          created_at?: string
        }
      }
      queries: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
        }
      }
      query_responses: {
        Row: {
          id: string
          query_id: string
          user_id: string | null
          content: string
          is_ai_response: boolean
          created_at: string
        }
        Insert: {
          id?: string
          query_id: string
          user_id?: string | null
          content: string
          is_ai_response?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          query_id?: string
          user_id?: string | null
          content?: string
          is_ai_response?: boolean
          created_at?: string
        }
      }
      leaderboard_snapshots: {
        Row: {
          id: string
          period: 'daily' | 'weekly' | 'monthly'
          period_date: string
          rankings: Json
          created_at: string
        }
        Insert: {
          id?: string
          period: 'daily' | 'weekly' | 'monthly'
          period_date: string
          rankings: Json
          created_at?: string
        }
        Update: {
          id?: string
          period?: 'daily' | 'weekly' | 'monthly'
          period_date?: string
          rankings?: Json
          created_at?: string
        }
      }
    }
  }
}

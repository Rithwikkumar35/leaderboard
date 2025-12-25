import { useEffect, useState } from 'react';
import { Code2, Trophy, TrendingUp, Clock, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';
import StatsCard from '../components/dashboard/StatsCard';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import LanguageStats from '../components/dashboard/LanguageStats';
import AIInsights from '../components/dashboard/AIInsights';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Submission = Database['public']['Tables']['code_submissions']['Row'];

interface DashboardProps {
  userId: string;
  onSignOut: () => void;
  onNavigate: (page: string) => void;
}

export default function Dashboard({ userId, onSignOut, onNavigate }: DashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentActivity, setRecentActivity] = useState<Submission[]>([]);
  const [languageStats, setLanguageStats] = useState<Array<{ language: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const { data: submissions } = await supabase
      .from('code_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: allSubmissions } = await supabase
      .from('code_submissions')
      .select('language')
      .eq('user_id', userId)
      .eq('status', 'passed');

    if (profileData) {
      setProfile(profileData);
    }

    if (submissions) {
      setRecentActivity(submissions);
    }

    if (allSubmissions) {
      const langCounts: Record<string, number> = {};
      allSubmissions.forEach((sub) => {
        langCounts[sub.language] = (langCounts[sub.language] || 0) + 1;
      });
      const stats = Object.entries(langCounts)
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
      setLanguageStats(stats);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-8 h-8 text-blue-400" />
            <span className="text-white font-bold text-xl">CodeArena</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-white hover:text-blue-400 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-white hover:text-blue-400 transition"
            >
              Leaderboard
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="text-white hover:text-blue-400 transition"
            >
              Notes
            </button>
            <button
              onClick={() => onNavigate('queries')}
              className="text-white hover:text-blue-400 transition"
            >
              Q&A
            </button>
            <button
              onClick={onSignOut}
              className="text-white hover:text-red-400 transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome, {profile?.username}!
          </h1>
          <p className="text-gray-400">Track your coding progress and compete with friends</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Code2}
            value={profile?.total_problems || 0}
            label="Problems Solved"
            iconColor="text-blue-400"
          />
          <StatsCard
            icon={TrendingUp}
            value={profile?.current_streak || 0}
            label="Current Streak"
            iconColor="text-green-400"
          />
          <StatsCard
            icon={Clock}
            value={profile?.total_time_minutes || 0}
            label="Minutes Coded"
            iconColor="text-yellow-400"
          />
          <StatsCard
            icon={Trophy}
            value={`#${profile?.rank || 0}`}
            label="Leaderboard Rank"
            iconColor="text-yellow-400"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Language Stats</h2>
            <LanguageStats stats={languageStats} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 md:col-span-2">
            <AIInsights
              totalProblems={profile?.total_problems || 0}
              currentStreak={profile?.current_streak || 0}
              totalTime={profile?.total_time_minutes || 0}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Activity</h2>
            <ActivityTimeline activities={recentActivity} />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button
                onClick={() => onNavigate('ide')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Open IDE
              </button>
              <button
                onClick={() => onNavigate('leaderboard')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                View Leaderboard
              </button>
              <button
                onClick={() => onNavigate('notes')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                Browse Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

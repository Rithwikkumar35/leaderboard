import { useEffect, useState } from 'react';
import { Trophy, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface LeaderboardProps {
  onNavigate: (page: string) => void;
}

export default function Leaderboard({ onNavigate }: LeaderboardProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('score', { ascending: false })
      .limit(50);

    if (data) {
      setProfiles(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-white hover:text-blue-400 transition flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top performers in the CodeArena</p>
        </div>

        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Username</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Problems</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Streak</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile, index) => (
                  <tr
                    key={profile.id}
                    className="border-t border-white/10 hover:bg-white/5 transition cursor-pointer"
                    onClick={() => onNavigate(`profile-${profile.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && <Trophy className="w-5 h-5 text-yellow-400" />}
                        {index === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                        {index === 2 && <Trophy className="w-5 h-5 text-orange-400" />}
                        <span className="text-white font-semibold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{profile.username}</td>
                    <td className="px-6 py-4 text-right text-gray-300">{profile.total_problems}</td>
                    <td className="px-6 py-4 text-right text-gray-300">{profile.current_streak}</td>
                    <td className="px-6 py-4 text-right text-white font-semibold">{profile.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

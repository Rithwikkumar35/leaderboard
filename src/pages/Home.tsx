import { Code2, Trophy, Users, TrendingUp } from 'lucide-react';

interface HomeProps {
  onGetStarted: () => void;
}

export default function Home({ onGetStarted }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            CodeArena
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-Powered Competitive Coding Platform
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition"
          >
            Get Started
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Built-in IDE</h3>
            <p className="text-gray-300">
              Code directly in your browser with support for all major programming languages
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Tracking</h3>
            <p className="text-gray-300">
              Automated progress tracking and personalized insights powered by AI
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compete & Win</h3>
            <p className="text-gray-300">
              Climb the leaderboard and compete with friends in daily challenges
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold">Platform Features</h2>
          </div>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Individual dashboards with comprehensive statistics
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Real-time leaderboard rankings
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Shared notes and resources
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Q&A discussion forum
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Coding streak tracking
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

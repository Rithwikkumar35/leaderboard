import { Brain, TrendingUp, Target, Award } from 'lucide-react';

interface AIInsightsProps {
  totalProblems: number;
  currentStreak: number;
  totalTime: number;
}

export default function AIInsights({ totalProblems, currentStreak, totalTime }: AIInsightsProps) {
  const generateInsights = () => {
    const insights = [];

    if (totalProblems === 0) {
      insights.push({
        icon: Target,
        text: 'Start your coding journey by solving your first problem!',
        color: 'text-blue-400',
      });
    } else if (totalProblems < 10) {
      insights.push({
        icon: TrendingUp,
        text: `Great start! You've solved ${totalProblems} problems. Keep going to reach 10!`,
        color: 'text-green-400',
      });
    } else {
      insights.push({
        icon: Award,
        text: `Impressive! You've solved ${totalProblems} problems. You're becoming a coding master!`,
        color: 'text-yellow-400',
      });
    }

    if (currentStreak === 0) {
      insights.push({
        icon: Target,
        text: 'Build consistency by coding daily. Start your streak today!',
        color: 'text-blue-400',
      });
    } else if (currentStreak >= 7) {
      insights.push({
        icon: TrendingUp,
        text: `Amazing ${currentStreak}-day streak! Consistency is key to mastery.`,
        color: 'text-green-400',
      });
    } else {
      insights.push({
        icon: TrendingUp,
        text: `${currentStreak}-day streak! Keep it up to reach 7 days.`,
        color: 'text-yellow-400',
      });
    }

    const hours = Math.floor(totalTime / 60);
    if (hours >= 10) {
      insights.push({
        icon: Award,
        text: `You've invested ${hours} hours in coding. Dedication pays off!`,
        color: 'text-yellow-400',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-6 h-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">AI Insights</h3>
      </div>
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <div
            key={index}
            className="flex items-start gap-3 bg-white/5 rounded-lg p-4"
          >
            <Icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
            <p className="text-gray-300 text-sm leading-relaxed">{insight.text}</p>
          </div>
        );
      })}
    </div>
  );
}

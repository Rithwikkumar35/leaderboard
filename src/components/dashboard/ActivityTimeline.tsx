import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Activity {
  id: string;
  problem_title: string;
  language: string;
  status: 'passed' | 'failed' | 'error';
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No recent activity</p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
          >
            <div className="mt-1">
              {activity.status === 'passed' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-medium">{activity.problem_title}</h4>
                <span className={`text-xs font-semibold uppercase ${getDifficultyColor(activity.difficulty)}`}>
                  {activity.difficulty}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="bg-slate-800 px-2 py-1 rounded">{activity.language}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(activity.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

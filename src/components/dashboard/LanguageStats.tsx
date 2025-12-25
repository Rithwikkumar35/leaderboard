import { Code2 } from 'lucide-react';

interface LanguageCount {
  language: string;
  count: number;
}

interface LanguageStatsProps {
  stats: LanguageCount[];
}

export default function LanguageStats({ stats }: LanguageStatsProps) {
  const total = stats.reduce((sum, stat) => sum + stat.count, 0);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      python: 'bg-blue-500',
      javascript: 'bg-yellow-500',
      typescript: 'bg-blue-600',
      java: 'bg-red-500',
      cpp: 'bg-pink-500',
      c: 'bg-gray-500',
      go: 'bg-cyan-500',
      rust: 'bg-orange-500',
    };
    return colors[language.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <div className="space-y-4">
      {stats.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No submissions yet</p>
      ) : (
        <>
          <div className="flex gap-2 h-4 rounded-full overflow-hidden">
            {stats.map((stat) => (
              <div
                key={stat.language}
                className={`${getLanguageColor(stat.language)}`}
                style={{ width: `${(stat.count / total) * 100}%` }}
                title={`${stat.language}: ${stat.count}`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => (
              <div key={stat.language} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getLanguageColor(stat.language)}`} />
                <span className="text-white text-sm capitalize">{stat.language}</span>
                <span className="text-gray-400 text-sm ml-auto">{stat.count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

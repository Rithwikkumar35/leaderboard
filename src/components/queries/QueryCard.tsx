import { MessageSquare, User, Calendar } from 'lucide-react';

interface QueryCardProps {
  title: string;
  content: string;
  username: string;
  createdAt: string;
  tags: string[];
  responseCount: number;
  onClick: () => void;
}

export default function QueryCard({
  title,
  content,
  username,
  createdAt,
  tags,
  responseCount,
  onClick,
}: QueryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-4">
        <MessageSquare className="w-6 h-6 text-green-400 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 line-clamp-2">{content}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-400">
          <MessageSquare className="w-4 h-4" />
          <span>{responseCount} responses</span>
        </div>
      </div>
    </div>
  );
}

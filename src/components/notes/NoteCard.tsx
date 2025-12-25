import { FileText, User, Calendar } from 'lucide-react';

interface NoteCardProps {
  title: string;
  content: string;
  username: string;
  createdAt: string;
  tags: string[];
}

export default function NoteCard({ title, content, username, createdAt, tags }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/15 transition">
      <div className="flex items-start gap-3 mb-4">
        <FileText className="w-6 h-6 text-blue-400 mt-1" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-300 line-clamp-3">{content}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-white/10">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{username}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  iconColor: string;
}

export default function StatsCard({ icon: Icon, value, label, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${iconColor}`} />
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-gray-300">{label}</p>
    </div>
  );
}

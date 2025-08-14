import React from 'react';
import Card from './Card';

interface ProgressCardProps {
  title: string;
  current: number;
  total: number;
  color?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  current,
  total,
  color = 'bg-blue-500',
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">{current}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <p className="text-sm text-gray-600 mt-2">{percentage}% complete</p>
      )}
    </Card>
  );
};

export default ProgressCard; 
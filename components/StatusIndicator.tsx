import React from 'react';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const isActive = status === 'active';
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          isActive ? 'bg-green-500' : 'bg-gray-400'
        )}
      />
      <span className="text-xs font-medium text-gray-600">
        {isActive ? 'Aktif' : 'Nonaktif'}
      </span>
    </div>
  );
};

export default StatusIndicator;

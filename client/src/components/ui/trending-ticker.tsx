import React from 'react';
import { TrendingItem } from '@/lib/types';

interface TrendingTickerProps {
  items: TrendingItem[];
}

const TrendingTicker = ({ items }: TrendingTickerProps) => {
  return (
    <div className="bg-neutral-900 text-white rounded-md p-2 overflow-hidden">
      <div className="flex animate-scroll">
        {items.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center whitespace-nowrap px-4">
            <span className={`material-icons mr-1 ${item.change > 0 ? 'text-success' : 'text-error'}`}>
              {item.change > 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span className="font-medium">{item.name}</span>
            <span className={`ml-1 ${item.change > 0 ? 'text-success' : 'text-error'}`}>
              {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
            </span>
          </div>
        ))}
        {/* Duplicate the items to create a seamless loop */}
        {items.map((item, index) => (
          <div key={`${item.id}-${index}-dup`} className="flex items-center whitespace-nowrap px-4">
            <span className={`material-icons mr-1 ${item.change > 0 ? 'text-success' : 'text-error'}`}>
              {item.change > 0 ? 'trending_up' : 'trending_down'}
            </span>
            <span className="font-medium">{item.name}</span>
            <span className={`ml-1 ${item.change > 0 ? 'text-success' : 'text-error'}`}>
              {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTicker;

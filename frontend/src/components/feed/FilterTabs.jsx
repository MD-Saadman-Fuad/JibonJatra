import React from 'react';
import { Globe, MessageSquare, ShoppingBag, Store, Search, Wrench } from 'lucide-react';

const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Updates', icon: Globe },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'market', label: 'Market', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Store },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'services', label: 'Services', icon: Wrench },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex-shrink-0 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm scale-102'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <Icon size={14} className={isActive ? 'text-white' : 'text-gray-500'} />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterTabs;
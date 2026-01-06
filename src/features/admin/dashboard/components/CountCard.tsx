import React from 'react';

const COLOR_CONFIG = {
  blue: { iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  green: { iconBg: "bg-green-100", iconColor: "text-green-600" },
  orange: { iconBg: "bg-orange-100", iconColor: "text-orange-600" },
  purple: { iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  red: { iconBg: "bg-red-100", iconColor: "text-red-600" },
};

export const CountCard = React.memo(function CountCard({ 
  color = "blue", 
  icon, 
  title, 
  count, 
  loading = false, 
  onClick 
}) {
  const getDisplayCount = () => {
    if (loading) return "...";
    if (count == null) return 0;
    if (typeof count === 'number' || typeof count === 'string') return count;
    if (typeof count === 'object') {
      return count.count ?? count.length ?? count.total ?? 0;
    }
    return 0;
  };

  const config = COLOR_CONFIG[color] || COLOR_CONFIG.blue;
  const displayCount = getDisplayCount();
  const isClickable = !!onClick;

  return (
    <div 
      className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 ${
        isClickable ? 'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300' : ''
      }`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{displayCount}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-3 ${config.iconBg}`}>
          <div className={config.iconColor}>{icon}</div>
        </div>
      </div>
    </div>
  );
});


import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Dashboard', id: 'dashboard' },
    { path: '/matches', label: '⚔️ Kamper', id: 'matches' },
    { path: '/standings', label: '🏆 Tabell', id: 'standings' },
    { path: '/playoffs', label: '🥇 Sluttspill', id: 'playoffs' },
    { path: '/analytics', label: '📊 Analytics', id: 'analytics' },
    { path: '/players', label: '👥 Spillere', id: 'players' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;


import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, BookOpen, History, User, Info, Mail } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assessment', label: 'Assessment', icon: Mic },
    { to: '/practice', label: 'Practice', icon: BookOpen },
    { to: '/history', label: 'History', icon: History },
    { to: '/profile', label: 'Profile Settings', icon: User },
  ];

  const supportItems = [
    { to: '/about', label: 'About Lumina', icon: Info },
    { to: '/contact', label: 'Get Support', icon: Mail },
  ];

  return (
    <aside className="w-64 border-r bg-card text-card-foreground hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto">
        {/* Core Sections */}
        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platform Menu
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Resources & Support */}
        <div className="space-y-2">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resources
          </p>
          <nav className="space-y-1">
            {supportItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Tiny Status / Version Footer */}
      <div className="p-4 border-t text-center text-xs text-muted-foreground">
        LuminaSpeech v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
export { Sidebar };

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, MessageSquareCode } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand/Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-tr from-primary to-indigo-500 p-2 rounded-xl text-primary-foreground">
            <MessageSquareCode className="h-6 w-6" />
          </div>
          <span className="hidden font-bold sm:inline-block text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            LuminaSpeech
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/30 to-indigo-500/30 flex items-center justify-center border font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-2 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };

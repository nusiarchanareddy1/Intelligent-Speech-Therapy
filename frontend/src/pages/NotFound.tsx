import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="mx-auto bg-amber-500/10 text-amber-500 p-4 rounded-full w-fit border border-amber-500/20">
          <AlertTriangle className="h-10 w-10 animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight">404 - Page Not Found</h1>
          <p className="text-sm text-muted-foreground">
            The page you are looking for does not exist or has been relocated to another therapist portal.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-2xl shadow hover:bg-primary/95 transition-all"
        >
          <Home className="h-4.5 w-4.5" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
export { NotFound };

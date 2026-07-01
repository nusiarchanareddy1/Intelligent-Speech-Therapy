import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div
        className={`${sizeClasses[size]} border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
export { Loader };

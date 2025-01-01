import React from 'react';
import { theme } from '../../theme/theme';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-48">
      <div className="relative">
        {/* Main circle */}
        <div 
          className="w-12 h-12 rounded-full animate-pulse"
          style={{ backgroundColor: theme.colors.primary.light }}
        ></div>
        
        {/* Orbiting circles */}
        <div className="absolute top-0 left-0 w-full h-full animate-spin" style={{ animationDuration: '3s' }}>
          <div 
            className="absolute top-0 left-1/2 w-3 h-3 -ml-1.5 rounded-full"
            style={{ backgroundColor: theme.colors.primary.main }}
          ></div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full animate-spin" style={{ animationDuration: '3s', animationDelay: '0.2s' }}>
          <div 
            className="absolute top-1/4 right-0 w-2 h-2 rounded-full"
            style={{ backgroundColor: theme.colors.primary.dark }}
          ></div>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full animate-spin" style={{ animationDuration: '3s', animationDelay: '0.4s' }}>
          <div 
            className="absolute bottom-0 left-1/2 w-2.5 h-2.5 -ml-1 rounded-full"
            style={{ backgroundColor: theme.colors.primary.main }}
          ></div>
        </div>

        {/* Loading text */}
        <div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-medium"
          style={{ color: theme.colors.primary.main }}
        >
          Loading...
        </div>
      </div>
    </div>
  );
};

export default Loading;

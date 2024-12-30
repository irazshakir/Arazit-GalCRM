import React from 'react';
import { theme } from '../../theme/theme';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-3 px-6 border-t border-gray-200">
      <div className="container mx-auto flex justify-center items-center text-xs text-gray-500">
        <p>
          Designed and Developed by{' '}
          <a
            href="https://arazit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:text-primary-main transition-colors"
            style={{ color: theme.colors.primary.main }}
          >
            Arazit
          </a>{' '}
          &copy; {currentYear}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

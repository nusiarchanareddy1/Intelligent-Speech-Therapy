import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              LuminaSpeech
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              Empowering confident voices through AI speech therapy analysis.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} LuminaSpeech Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export { Footer };

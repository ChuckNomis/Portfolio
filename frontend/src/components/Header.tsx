import React from "react";
import { Bot, Github, ExternalLink } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-background-sidebar border-b border-divider px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
          <Bot size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">NadavBot</h1>
          <p className="text-sm text-text-secondary">
            Personal Portfolio Assistant
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://github.com/[username]/nadavbot-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          title="View on GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="https://nadav-portfolio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          title="Visit Portfolio"
        >
          <ExternalLink size={20} />
        </a>
      </div>
    </header>
  );
};

export default Header;

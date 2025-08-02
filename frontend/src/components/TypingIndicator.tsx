import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 items-center">
      <div className="w-2 h-2 bg-text-secondary rounded-full typing-indicator"></div>
      <div className="w-2 h-2 bg-text-secondary rounded-full typing-indicator"></div>
      <div className="w-2 h-2 bg-text-secondary rounded-full typing-indicator"></div>
    </div>
  );
};

export default TypingIndicator;

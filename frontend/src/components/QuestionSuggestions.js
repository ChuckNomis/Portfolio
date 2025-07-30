import React from 'react';
import { GraduationCap, Code, MessageCircle, User, BookOpen } from 'lucide-react';
import './QuestionSuggestions.css';

const QuestionSuggestions = ({ onQuestionSelect }) => {
  const questions = [
    {
      id: 1,
      question: "What is his educational background?",
      icon: <GraduationCap size={16} />,
    },
    {
      id: 2,
      question: "Show me his projects",
      icon: <Code size={16} />,
    },
    {
      id: 3,
      question: "What skills does he have?",
      icon: <MessageCircle size={16} />,
    },
    {
      id: 4,
      question: "Tell me about Nadav",
      icon: <User size={16} />,
    },
    {
      id: 5,
      question: "What courses did Nadav do?",
      icon: <BookOpen size={16} />,
    }
  ];

  return (
    <div className="question-suggestions">
      <div className="suggestions-container">
        {questions.map((item) => (
          <button
            key={item.id}
            className="suggestion-chip"
            onClick={() => onQuestionSelect(item.question)}
          >
            <span className="chip-icon">{item.icon}</span>
            <span className="chip-text">{item.question}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSuggestions;
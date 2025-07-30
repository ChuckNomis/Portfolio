import React from 'react';
import { Sparkles, MessageCircle, User, Code, GraduationCap, BookOpen } from 'lucide-react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onQuestionSelect }) => {
  const predefinedQuestions = [
    {
      id: 1,
      question: "What is his educational background?",
      icon: <GraduationCap size={20} />,
      category: "Education"
    },
    {
      id: 2,
      question: "Show me his projects",
      icon: <Code size={20} />,
      category: "Projects"
    },
    {
      id: 3,
      question: "What skills does he have?",
      icon: <MessageCircle size={20} />,
      category: "Skills"
    },
    {
      id: 4,
      question: "Tell me about Nadav",
      icon: <User size={20} />,
      category: "About"
    },
    {
      id: 5,
      question: "What courses did Nadav do?",
      icon: <BookOpen size={20} />,
      category: "Learning"
    }
  ];

  return (
    <div className="welcome-screen">
      <div className="welcome-header">
        <div className="welcome-icon">
          <Sparkles size={48} color="var(--accent-primary)" />
        </div>
        <h2 className="welcome-title">Welcome to NadavGPT</h2>
        <p className="welcome-description">
          I'm here to answer questions about Nadav Simon's background, projects, and expertise in AI engineering. 
          Choose a question below to get started!
        </p>
      </div>

      <div className="questions-grid">
        {predefinedQuestions.map((item) => (
          <button
            key={item.id}
            className="question-card"
            onClick={() => onQuestionSelect(item.question)}
          >
            <div className="question-icon">
              {item.icon}
            </div>
            <div className="question-content">
              <span className="question-category">{item.category}</span>
              <span className="question-text">{item.question}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="welcome-footer">
        <p className="footer-note">
          💡 <strong>Tip:</strong> Click on any question above to learn more about Nadav's background and experience!
        </p>
        <p className="footer-warning">
          ⚠️ Try typing your own question and see what happens...
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
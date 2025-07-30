import React, { useState } from 'react';
import { MessageSquare, Plus, Settings, Folder, Mail, Phone, Linkedin, Github, Wrench } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = () => {
    window.location.reload();
  };

  const chatHistory = [
    "AI Engineer Learning Path",
    "What is his educational background?", 
    "AI Ad Video Generator",
    "Show me his projects",
    "LLM Stock Market Prediction",
    "What skills does he have?",
    "Tell me about Nadav"
  ];

  return (
    <div className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header Section */}
      <div className="sidebar-top">
        <div className="project-header">
          <div className="project-icon">
            <Folder size={20} />
          </div>
          {!isCollapsed && <span className="project-name">nadav</span>}
        </div>

        <div className="new-chat-section">
          <div className="new-chat-label">
            {!isCollapsed && <span>New chat in nadav</span>}
          </div>
          
          <div className="chat-input-area">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={16} />
            </button>
            
            <button className="tools-btn">
              <Wrench size={16} />
              {!isCollapsed && <span>Tools</span>}
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        {!isCollapsed && (
          <div className="feature-cards">
            <div className="feature-card">
              <h4>Add files</h4>
              <p>Chats in this project can access file content</p>
            </div>
            
            <div className="feature-card">
              <h4>Add instructions</h4>
              <p>Tailor the way ChatGPT responds in this project</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat History */}
      <div className="chat-history-section">
        {!isCollapsed && (
          <>
            {chatHistory.map((chat, index) => (
              <div key={index} className="chat-history-item">
                <MessageSquare size={16} />
                <span className="chat-title">{chat}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Contact Section */}
      {!isCollapsed && (
        <div className="contact-section">
          <div className="contact-header">
            <h4>Contact Nadav</h4>
          </div>
          <div className="contact-links">
            <a href="mailto:nadav@s1mon.co.il" className="contact-link">
              <Mail size={16} />
              <span>nadav@s1mon.co.il</span>
            </a>
            
            <a href="tel:+972586655447" className="contact-link">
              <Phone size={16} />
              <span>+972-58-665-5447</span>
            </a>
            
            <a href="https://linkedin.com/in/nadav-simon" target="_blank" rel="noopener noreferrer" className="contact-link">
              <Linkedin size={16} />
              <span>LinkedIn Profile</span>
            </a>
            
            <a href="https://github.com/nadav-simon" target="_blank" rel="noopener noreferrer" className="contact-link">
              <Github size={16} />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        className="toggle-sidebar"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Settings size={16} />
      </button>
    </div>
  );
};

export default Sidebar;
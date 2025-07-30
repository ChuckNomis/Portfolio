import React, { useState } from 'react';
import { MessageSquare, User, Github, Linkedin, Mail, Phone, Plus, Search, Library, Sparkles } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNewChat = () => {
    window.location.reload(); // Simple way to start new chat
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Sparkles size={24} color="var(--accent-primary)" />
          </div>
          {!isCollapsed && <span className="logo-text">NadavGPT</span>}
        </div>
        
        <button className="new-chat-btn" onClick={handleNewChat} title="New chat">
          <Plus size={20} />
          {!isCollapsed && <span>New chat</span>}
        </button>
      </div>

      <div className="sidebar-nav">
        <div className="nav-item active">
          <MessageSquare size={20} />
          {!isCollapsed && <span>Chat</span>}
        </div>
        
        <div className="nav-item">
          <Search size={20} />
          {!isCollapsed && <span>Search</span>}
        </div>
        
        <div className="nav-item">
          <Library size={20} />
          {!isCollapsed && <span>Library</span>}
        </div>
      </div>

      <div className="sidebar-content">
        {!isCollapsed && (
          <>
            <div className="chat-history">
              <h3 className="section-title">Recent chats</h3>
              <div className="chat-item">
                <MessageSquare size={16} />
                <span>About Nadav's Projects</span>
              </div>
              <div className="chat-item">
                <MessageSquare size={16} />
                <span>Educational Background</span>
              </div>
              <div className="chat-item">
                <MessageSquare size={16} />
                <span>Technical Skills</span>
              </div>
            </div>

            <div className="contact-section">
              <h3 className="section-title">Contact Nadav</h3>
              <div className="contact-links">
                <a href="mailto:nadav@s1mon.co.il" className="contact-link" title="Email">
                  <Mail size={18} />
                  <span>nadav@s1mon.co.il</span>
                </a>
                
                <a href="tel:+972586655447" className="contact-link" title="Phone">
                  <Phone size={18} />
                  <span>+972-58-665-5447</span>
                </a>
                
                <a href="https://linkedin.com/in/nadav-simon" target="_blank" rel="noopener noreferrer" className="contact-link" title="LinkedIn">
                  <Linkedin size={18} />
                  <span>LinkedIn Profile</span>
                </a>
                
                <a href="https://github.com/nadav-simon" target="_blank" rel="noopener noreferrer" className="contact-link" title="GitHub">
                  <Github size={18} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={20} />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">Nadav Simon</span>
              <span className="user-role">AI Engineer</span>
            </div>
          )}
        </div>
        
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <MessageSquare size={16} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
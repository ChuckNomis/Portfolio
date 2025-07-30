import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Settings, Folder, Mail, Phone, Linkedin, Github, Wrench } from 'lucide-react';
import { chatAPI } from '../services/api';
import './Sidebar.css';

const Sidebar = ({ onNewChat, chatSessions = [], currentSessionId, onSessionSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      const contact = await chatAPI.getContactInfo();
      setContactInfo(contact);
    } catch (error) {
      console.error('Error loading contact info:', error);
      // Fallback contact info
      setContactInfo({
        name: "Nadav Simon",
        title: "AI Engineer",
        email: "nadav@s1mon.co.il",
        phone: "+972586655447",
        linkedin: "https://linkedin.com/in/nadav-simon",
        github: "https://github.com/nadav-simon"
      });
    }
  };

  const formatPhoneNumber = (phone) => {
    // Format phone number for display
    return phone.replace(/(\+\d{3})(\d{2})(\d{3})(\d{4})/, '$1-$2-$3-$4');
  };

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
            <button className="new-chat-btn" onClick={onNewChat} title="New chat">
              <Plus size={16} />
            </button>
            
            <button className="tools-btn" title="Tools">
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
            {chatSessions.length > 0 && (
              <>
                <div className="section-divider">Recent Chats</div>
                {chatSessions.map((session) => (
                  <div 
                    key={session.session_id} 
                    className={`chat-history-item ${session.session_id === currentSessionId ? 'active' : ''}`}
                    onClick={() => onSessionSelect(session.session_id)}
                    title={session.title}
                  >
                    <MessageSquare size={16} />
                    <span className="chat-title">{session.title}</span>
                    <span className="message-count">({session.message_count})</span>
                  </div>
                ))}
              </>
            )}
            
            {/* Sample history items for visual appeal */}
            <div className="section-divider">Examples</div>
            <div className="chat-history-item example">
              <MessageSquare size={16} />
              <span className="chat-title">AI Engineer Learning Path</span>
            </div>
            <div className="chat-history-item example">
              <MessageSquare size={16} />
              <span className="chat-title">What is his educational background?</span>
            </div>
            <div className="chat-history-item example">
              <MessageSquare size={16} />
              <span className="chat-title">Show me his projects</span>
            </div>
          </>
        )}
      </div>

      {/* Contact Section */}
      {!isCollapsed && contactInfo && (
        <div className="contact-section">
          <div className="contact-header">
            <h4>Contact Nadav</h4>
          </div>
          <div className="contact-links">
            <a href={`mailto:${contactInfo.email}`} className="contact-link" title="Email">
              <Mail size={16} />
              <span>{contactInfo.email}</span>
            </a>
            
            <a href={`tel:${contactInfo.phone}`} className="contact-link" title="Phone">
              <Phone size={16} />
              <span>{formatPhoneNumber(contactInfo.phone)}</span>
            </a>
            
            <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link" title="LinkedIn">
              <Linkedin size={16} />
              <span>LinkedIn Profile</span>
            </a>
            
            <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="contact-link" title="GitHub">
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
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <Settings size={16} />
      </button>
    </div>
  );
};

export default Sidebar;
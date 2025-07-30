# NadavGPT Backend Integration Contracts

## Overview
Transform the frontend mock data system into a full-stack application with FastAPI backend and MongoDB storage.

## API Endpoints

### 1. Chat Messages
```
POST /api/chat/message
Request: {
  "message": "What is his educational background?",
  "session_id": "uuid-string"
}
Response: {
  "response": "formatted response text",
  "question_type": "education|projects|skills|about|courses|custom",
  "timestamp": "2025-01-30T08:00:00Z",
  "session_id": "uuid-string"
}
```

### 2. Get Chat History
```
GET /api/chat/history/{session_id}
Response: {
  "messages": [
    {
      "id": "message-id",
      "type": "user|assistant",
      "content": "message content",
      "timestamp": "2025-01-30T08:00:00Z"
    }
  ],
  "session_id": "uuid-string"
}
```

### 3. New Chat Session
```
POST /api/chat/new-session
Response: {
  "session_id": "uuid-string",
  "created_at": "2025-01-30T08:00:00Z"
}
```

### 4. Get All Chat Sessions
```
GET /api/chat/sessions
Response: {
  "sessions": [
    {
      "session_id": "uuid-string",
      "title": "About Nadav's Projects",
      "created_at": "2025-01-30T08:00:00Z",
      "message_count": 4
    }
  ]
}
```

### 5. Contact Information
```
GET /api/contact
Response: {
  "name": "Nadav Simon",
  "title": "AI Engineer",
  "email": "nadav@s1mon.co.il",
  "phone": "+972586655447",
  "linkedin": "https://linkedin.com/in/nadav-simon",
  "github": "https://github.com/nadav-simon"
}
```

## Database Models

### ChatSession
```python
{
  "_id": ObjectId,
  "session_id": str (UUID),
  "title": str,
  "created_at": datetime,
  "updated_at": datetime
}
```

### ChatMessage
```python
{
  "_id": ObjectId,
  "session_id": str (UUID),
  "message_id": str (UUID),
  "type": str ("user" | "assistant"),
  "content": str,
  "question_type": str ("education" | "projects" | "skills" | "about" | "courses" | "custom"),
  "timestamp": datetime
}
```

## Response Data Sources

### Current Mock Data Location
- File: `/app/frontend/src/data/mockData.js`
- Content: education, projects, skills, about, courses responses

### Backend Implementation
- Move response content to backend
- Store in MongoDB or keep as static data in backend
- Implement intelligent question matching logic
- Add session management and history

## Frontend Changes Required

### Remove Mock Dependencies
1. Remove `import { mockResponses } from '../data/mockData'`
2. Replace mock response logic with API calls
3. Add session management
4. Implement proper error handling

### API Integration Points
1. **ChatInterface.js**: Replace handleSendMessage with API calls
2. **Sidebar.js**: Load chat history from API
3. **App.js**: Add session management context
4. Add loading states and error handling

### Session Management
1. Generate session ID on app start
2. Store session ID in localStorage
3. Create new session on "New Chat" button
4. Load chat history when switching sessions

## Error Handling

### API Errors
- Network failures
- Server errors (500)
- Invalid requests (400)
- Rate limiting

### Frontend Error States
- Loading indicators during API calls
- Error messages for failed requests
- Retry mechanisms
- Offline state handling

## Implementation Steps

1. **Backend Setup**
   - Create MongoDB models
   - Implement API endpoints
   - Add response matching logic
   - Test with curl/Postman

2. **Frontend Integration**
   - Add API service layer
   - Replace mock data calls
   - Implement session management
   - Add error handling

3. **Testing**
   - Test all API endpoints
   - Verify chat functionality
   - Test session persistence
   - Mobile responsiveness check

## Special Logic

### Question Matching
```python
def match_question_type(message: str) -> str:
    message_lower = message.lower()
    
    if any(keyword in message_lower for keyword in ['educational background', 'education']):
        return 'education'
    elif any(keyword in message_lower for keyword in ['projects', 'show me']):
        return 'projects'
    # ... other matches
    else:
        return 'custom'
```

### Custom Message Response
Any message that doesn't match predefined patterns returns:
"Don't be greedy! Please select from the available questions to learn about Nadav."

## Performance Considerations
- Cache responses for frequently asked questions
- Implement pagination for chat history
- Add request rate limiting
- Optimize database queries
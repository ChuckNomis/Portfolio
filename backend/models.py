from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid
from datetime import datetime

# Request/Response Models
class ChatMessageRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatMessageResponse(BaseModel):
    response: str
    question_type: str
    timestamp: datetime
    session_id: str

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: Literal["user", "assistant"]
    content: str
    question_type: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    message_count: int = 0

class NewSessionResponse(BaseModel):
    session_id: str
    created_at: datetime

class ChatHistoryResponse(BaseModel):
    messages: List[dict]
    session_id: str

class SessionsResponse(BaseModel):
    sessions: List[dict]

class ContactInfo(BaseModel):
    name: str = "Nadav Simon"
    title: str = "AI Engineer"
    email: str = "nadav@s1mon.co.il"
    phone: str = "+972586655447"
    linkedin: str = "https://linkedin.com/in/nadav-simon"
    github: str = "https://github.com/nadav-simon"
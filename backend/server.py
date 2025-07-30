from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from datetime import datetime
import uuid

# Import our models and response data
from models import (
    ChatMessageRequest, 
    ChatMessageResponse, 
    ChatMessage, 
    ChatSession, 
    NewSessionResponse,
    ChatHistoryResponse,
    SessionsResponse,
    ContactInfo
)
from responses import match_question_type, get_response, generate_session_title

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="NadavGPT API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Add your routes to the router
@api_router.get("/")
async def root():
    return {"message": "NadavGPT API is running!", "version": "1.0.0"}

@api_router.post("/chat/message", response_model=ChatMessageResponse)
async def send_message(request: ChatMessageRequest):
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Check if this is the first message in the session
        existing_messages = await db.chat_messages.find({"session_id": session_id}).to_list(1)
        is_first_message = len(existing_messages) == 0
        
        # If first message, create session
        if is_first_message:
            session_title = generate_session_title(request.message)
            session = ChatSession(
                session_id=session_id,
                title=session_title
            )
            await db.chat_sessions.insert_one(session.dict())
        
        # Save user message
        user_message = ChatMessage(
            session_id=session_id,
            type="user",
            content=request.message
        )
        await db.chat_messages.insert_one(user_message.dict())
        
        # Generate response
        question_type = match_question_type(request.message)
        response_text = get_response(question_type)
        
        # Save assistant message
        assistant_message = ChatMessage(
            session_id=session_id,
            type="assistant",
            content=response_text,
            question_type=question_type
        )
        await db.chat_messages.insert_one(assistant_message.dict())
        
        # Update session message count
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$inc": {"message_count": 2},
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return ChatMessageResponse(
            response=response_text,
            question_type=question_type,
            timestamp=datetime.utcnow(),
            session_id=session_id
        )
        
    except Exception as e:
        logging.error(f"Error in send_message: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/chat/history/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(session_id: str):
    try:
        messages = await db.chat_messages.find(
            {"session_id": session_id}
        ).sort("timestamp", 1).to_list(1000)
        
        # Format messages for frontend
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "id": msg["message_id"],
                "type": msg["type"],
                "content": msg["content"],
                "timestamp": msg["timestamp"]
            })
        
        return ChatHistoryResponse(
            messages=formatted_messages,
            session_id=session_id
        )
        
    except Exception as e:
        logging.error(f"Error in get_chat_history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.post("/chat/new-session", response_model=NewSessionResponse)
async def create_new_session():
    try:
        session_id = str(uuid.uuid4())
        return NewSessionResponse(
            session_id=session_id,
            created_at=datetime.utcnow()
        )
        
    except Exception as e:
        logging.error(f"Error in create_new_session: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/chat/sessions", response_model=SessionsResponse)
async def get_chat_sessions():
    try:
        sessions = await db.chat_sessions.find().sort("updated_at", -1).to_list(100)
        
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                "session_id": session["session_id"],
                "title": session["title"],
                "created_at": session["created_at"],
                "message_count": session.get("message_count", 0)
            })
        
        return SessionsResponse(sessions=formatted_sessions)
        
    except Exception as e:
        logging.error(f"Error in get_chat_sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@api_router.get("/contact", response_model=ContactInfo)
async def get_contact_info():
    return ContactInfo()

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    # Create indexes for better performance
    await db.chat_messages.create_index("session_id")
    await db.chat_messages.create_index("timestamp")
    await db.chat_sessions.create_index("session_id", unique=True)
    logger.info("Database indexes created successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
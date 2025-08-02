"""
FastAPI backend for NadavBot Portfolio
Integrates with LangGraph for conversational AI functionality.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

from langgraph_runner import NadavBotRunner
from prompt_templates import SYSTEM_PROMPT, format_context_prompt

# Load environment variables
load_dotenv()

app = FastAPI(
    title="NadavBot API",
    description="Personal portfolio chatbot API using Graph RAG",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://nadavbot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global chatbot runner instance
chatbot_runner = None


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []


class ChatResponse(BaseModel):
    response: str
    sources: List[str] = []
    conversation_id: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    message: str


@app.on_event("startup")
async def startup_event():
    """Initialize the chatbot runner on startup."""
    global chatbot_runner

    # Check for required environment variables
    if not os.getenv("OPENAI_API_KEY"):
        print("Warning: OPENAI_API_KEY not found. Chatbot functionality will be limited.")
        return

    try:
        chatbot_runner = NadavBotRunner()
        await chatbot_runner.initialize()
        print("NadavBot initialized successfully!")
    except Exception as e:
        print(f"Failed to initialize NadavBot: {e}")


@app.get("/", response_model=HealthResponse)
async def root():
    """Health check endpoint."""
    return HealthResponse(
        status="healthy",
        message="NadavBot API is running!"
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Detailed health check including chatbot status."""
    global chatbot_runner

    if chatbot_runner and chatbot_runner.is_ready():
        return HealthResponse(
            status="healthy",
            message="NadavBot API and chatbot are ready!"
        )
    else:
        return HealthResponse(
            status="degraded",
            message="API is running but chatbot is not initialized"
        )


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for conversing with NadavBot."""
    global chatbot_runner

    if not chatbot_runner:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not initialized. Please check your configuration."
        )

    if not chatbot_runner.is_ready():
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not ready. Please try again in a moment."
        )

    try:
        # Process the chat request through LangGraph
        response = await chatbot_runner.process_message(
            message=request.message,
            conversation_history=request.conversation_history
        )

        return ChatResponse(
            response=response["response"],
            sources=response.get("sources", []),
            conversation_id=response.get("conversation_id")
        )

    except Exception as e:
        print(f"Error processing chat request: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing your message: {str(e)}"
        )


@app.get("/info")
async def get_bot_info():
    """Get information about NadavBot's capabilities."""
    return {
        "name": "NadavBot",
        "description": "Personal portfolio chatbot for Nadav",
        "capabilities": [
            "Answer questions about Nadav's experience and skills",
            "Provide information about projects and achievements",
            "Discuss technical expertise and career timeline",
            "Share insights about values and working style"
        ],
        "example_questions": [
            "What are Nadav's main technical skills?",
            "Tell me about Nadav's AI projects",
            "What technologies does Nadav use for frontend development?",
            "When did Nadav start working with AI?",
            "What's Nadav's experience with React?",
            "Tell me about Nadav's recent projects"
        ],
        "limitations": [
            "Only provides information about Nadav",
            "Cannot answer general questions unrelated to Nadav",
            "Information is based on provided portfolio data"
        ]
    }


@app.get("/conversation/suggest")
async def get_conversation_starters():
    """Get suggested conversation starters."""
    return {
        "starters": [
            "Hi! Tell me about yourself.",
            "What are your core technical skills?",
            "Show me your most recent projects.",
            "What's your experience with AI and machine learning?",
            "How do you approach full-stack development?",
            "What technologies do you prefer to work with?",
            "Tell me about your career journey.",
            "What are you passionate about in tech?"
        ]
    }


@app.get("/debug/graph-status")
async def debug_graph_status():
    """Debug endpoint to check knowledge graph status."""
    global chatbot_runner

    if not chatbot_runner:
        return {"status": "not_initialized", "error": "Chatbot runner not created"}

    return chatbot_runner.get_debug_info()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

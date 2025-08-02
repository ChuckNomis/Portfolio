"""
Prompt templates and formatting utilities for NadavBot.
"""

from typing import List, Dict, Any

SYSTEM_PROMPT = """You are NadavBot, an AI assistant representing Nadav, a skilled software engineer and AI enthusiast.

CORE IDENTITY:
- You speak AS Nadav, using first person ("I", "my", "me")
- You have a friendly, professional, and enthusiastic tone
- You are passionate about technology, AI, and building great products
- You value code quality, user experience, and continuous learning

KNOWLEDGE SCOPE:
- You can ONLY discuss information about Nadav's professional experience, skills, projects, and background
- You have access to detailed information about Nadav's resume, projects, timeline, and technical skills
- You cannot answer general questions unrelated to Nadav
- You cannot provide information about other people or topics outside of Nadav's portfolio

BEHAVIOR RULES:
1. Always stay in character as Nadav
2. Only use information from the provided context
3. If you don't have information about something, say "I don't have that information in my portfolio" rather than guessing
4. Be enthusiastic about technical topics and projects
5. Provide specific details when available (technologies used, timeframes, achievements)
6. Keep responses conversational and engaging
7. If asked about something outside your scope, politely redirect to topics you can discuss

RESPONSE STYLE:
- Be concise but informative
- Use technical terms appropriately but explain complex concepts
- Show enthusiasm for the work and technologies discussed
- Include specific examples from projects when relevant
- Maintain a professional yet approachable tone"""


def format_context_prompt(
    context: str,
    conversation_history: List[Dict[str, str]],
    user_query: str
) -> str:
    """
    Format the final prompt with context, conversation history, and current query.
    """

    # Format conversation history
    history_text = format_conversation_history(conversation_history)

    prompt = f"""RELEVANT CONTEXT FROM NADAV'S PORTFOLIO:
{context}

{history_text}

CURRENT USER QUESTION:
{user_query}

Please respond as Nadav, using the context provided above. Stay in character and only discuss information that's available in the context. Be enthusiastic and conversational while being accurate and helpful."""

    return prompt


def format_conversation_history(conversation_history: List[Dict[str, str]]) -> str:
    """
    Format conversation history for inclusion in prompts.
    """
    if not conversation_history:
        return "CONVERSATION HISTORY:\n(This is the start of our conversation)\n"

    history_text = "CONVERSATION HISTORY:\n"

    # Only include last 6 messages (3 exchanges) to keep context manageable
    recent_history = conversation_history[-6:] if len(
        conversation_history) > 6 else conversation_history

    for message in recent_history:
        role = message["role"]
        content = message["content"]

        if role == "user":
            history_text += f"User: {content}\n"
        elif role == "assistant":
            history_text += f"You (Nadav): {content}\n"

    history_text += "\n"
    return history_text


def get_greeting_prompt() -> str:
    """
    Get a prompt for generating a greeting message.
    """
    return """Please provide a brief, friendly greeting as Nadav. Introduce yourself and mention that users can ask about your experience, skills, and projects. Keep it conversational and welcoming."""


def get_example_questions() -> List[str]:
    """
    Get a list of example questions users might ask.
    """
    return [
        "What are your main technical skills?",
        "Tell me about your recent AI projects",
        "What's your experience with React and frontend development?",
        "How did you get started in software engineering?",
        "What technologies do you prefer for backend development?",
        "Tell me about a challenging project you've worked on",
        "What's your approach to full-stack development?",
        "How do you stay updated with new technologies?",
        "What are you most passionate about in tech?",
        "What's your experience with machine learning and AI?"
    ]


def format_error_response(error_type: str = "general") -> str:
    """
    Format error responses in character.
    """
    error_responses = {
        "general": "I apologize, but I'm having some technical difficulties right now. Could you please try asking your question again?",
        "out_of_scope": "I focus on discussing my professional experience, skills, and projects. Is there something specific about my background or work you'd like to know about?",
        "no_context": "I don't have that specific information readily available in my portfolio. Is there something else about my experience or projects you'd like to know about?",
        "initialization": "I'm still getting set up. Please give me a moment and try again shortly."
    }

    return error_responses.get(error_type, error_responses["general"])


def should_use_context(user_query: str) -> bool:
    """
    Determine if a user query requires context retrieval.
    Simple keyword-based approach for now.
    """
    greeting_keywords = ["hi", "hello", "hey", "greetings"]
    query_lower = user_query.lower().strip()

    # If it's just a greeting, we might not need heavy context retrieval
    if any(keyword in query_lower for keyword in greeting_keywords) and len(query_lower.split()) <= 3:
        return False

    return True


def extract_intent(user_query: str) -> str:
    """
    Extract the likely intent from a user query.
    """
    query_lower = user_query.lower()

    if any(word in query_lower for word in ["skill", "technology", "tech", "programming", "language"]):
        return "skills"
    elif any(word in query_lower for word in ["project", "work", "built", "developed", "created"]):
        return "projects"
    elif any(word in query_lower for word in ["experience", "career", "job", "work", "timeline"]):
        return "experience"
    elif any(word in query_lower for word in ["ai", "machine learning", "ml", "artificial intelligence"]):
        return "ai"
    elif any(word in query_lower for word in ["frontend", "react", "javascript", "ui", "interface"]):
        return "frontend"
    elif any(word in query_lower for word in ["backend", "api", "server", "database"]):
        return "backend"
    elif any(word in query_lower for word in ["hello", "hi", "hey", "intro", "about"]):
        return "greeting"
    else:
        return "general"

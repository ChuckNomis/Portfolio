"""
LangGraph runner for NadavBot
Implements the conversational AI workflow using LangGraph.
"""

from prompt_templates import SYSTEM_PROMPT, format_context_prompt, format_conversation_history
from graph.build_graph import NadavBotKnowledgeGraph
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from typing_extensions import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, END
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import asyncio
from datetime import datetime

# Add parent directory to path for importing graph module
sys.path.append(str(Path(__file__).parent.parent))


class ConversationState(TypedDict):
    """State structure for the conversation workflow."""
    messages: Annotated[list, add_messages]
    user_query: str
    retrieved_context: str
    conversation_history: List[Dict[str, str]]
    response: str
    sources: List[str]
    conversation_id: str


class NadavBotRunner:
    """
    Main runner class that orchestrates the LangGraph workflow for NadavBot.
    """

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0.3,
            max_tokens=1000
        )
        self.kg_builder = None
        self.workflow = None
        self.ready = False

    async def initialize(self):
        """Initialize the knowledge graph and build the workflow."""
        try:
            print("Initializing NadavBot Knowledge Graph...")

            # Initialize knowledge graph
            self.kg_builder = NadavBotKnowledgeGraph(
                data_dir="../data",
                storage_dir="../storage"
            )

            # Load existing indices or build new ones
            if not self.kg_builder.load_existing_indices():
                print("Building knowledge graph (this may take a few minutes)...")
                self.kg_builder.build_knowledge_graph()

            # Build the LangGraph workflow
            self._build_workflow()

            self.ready = True
            print("NadavBot initialization complete!")

        except Exception as e:
            print(f"Error initializing NadavBot: {e}")
            raise e

    def _build_workflow(self):
        """Build the LangGraph workflow for conversation processing."""

        def extract_query(state: ConversationState) -> ConversationState:
            """Extract and prepare the user query."""
            messages = state["messages"]
            user_query = ""

            # Get the latest user message
            for msg in reversed(messages):
                if isinstance(msg, HumanMessage):
                    user_query = msg.content
                    break

            return {
                **state,
                "user_query": user_query
            }

        def retrieve_context(state: ConversationState) -> ConversationState:
            """Retrieve relevant context from the knowledge graph."""
            user_query = state["user_query"]

            try:
                # Query both graph and vector indices for comprehensive retrieval
                graph_context = self.kg_builder.query_graph(
                    user_query, mode="graph")
                vector_context = self.kg_builder.query_graph(
                    user_query, mode="vector")

                # Combine contexts
                combined_context = f"Graph Context:\n{graph_context}\n\nVector Context:\n{vector_context}"

                return {
                    **state,
                    "retrieved_context": combined_context,
                    "sources": ["knowledge_graph", "vector_search"]
                }

            except Exception as e:
                print(f"Error retrieving context: {e}")
                return {
                    **state,
                    "retrieved_context": "I apologize, but I'm having trouble accessing my knowledge base right now.",
                    "sources": []
                }

        def generate_response(state: ConversationState) -> ConversationState:
            """Generate the final response using the LLM."""
            user_query = state["user_query"]
            retrieved_context = state["retrieved_context"]
            conversation_history = state.get("conversation_history", [])

            # Format the prompt with context and history
            formatted_prompt = format_context_prompt(
                context=retrieved_context,
                conversation_history=conversation_history,
                user_query=user_query
            )

            # Create messages for the LLM
            messages = [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=formatted_prompt)
            ]

            try:
                # Generate response
                response = self.llm.invoke(messages)
                response_text = response.content

                return {
                    **state,
                    "response": response_text
                }

            except Exception as e:
                print(f"Error generating response: {e}")
                return {
                    **state,
                    "response": "I apologize, but I'm having trouble generating a response right now. Please try again."
                }

        # Build the workflow graph
        workflow = StateGraph(ConversationState)

        # Add nodes
        workflow.add_node("extract_query", extract_query)
        workflow.add_node("retrieve_context", retrieve_context)
        workflow.add_node("generate_response", generate_response)

        # Add edges
        workflow.set_entry_point("extract_query")
        workflow.add_edge("extract_query", "retrieve_context")
        workflow.add_edge("retrieve_context", "generate_response")
        workflow.add_edge("generate_response", END)

        # Compile the workflow
        self.workflow = workflow.compile()

    async def process_message(
        self,
        message: str,
        conversation_history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Process a user message through the LangGraph workflow."""

        if not self.ready:
            raise RuntimeError(
                "NadavBot is not initialized. Call initialize() first.")

        if conversation_history is None:
            conversation_history = []

        # Create initial state
        initial_state = ConversationState(
            messages=[HumanMessage(content=message)],
            user_query="",
            retrieved_context="",
            conversation_history=conversation_history,
            response="",
            sources=[],
            conversation_id=self._generate_conversation_id()
        )

        try:
            # Run the workflow
            result = await asyncio.get_event_loop().run_in_executor(
                None,
                self.workflow.invoke,
                initial_state
            )

            return {
                "response": result["response"],
                "sources": result["sources"],
                "conversation_id": result["conversation_id"]
            }

        except Exception as e:
            print(f"Error processing message: {e}")
            return {
                "response": "I apologize, but I encountered an error processing your message. Please try again.",
                "sources": [],
                "conversation_id": self._generate_conversation_id()
            }

    def is_ready(self) -> bool:
        """Check if the runner is ready to process messages."""
        return self.ready and self.kg_builder is not None and self.workflow is not None

    def get_debug_info(self) -> Dict[str, Any]:
        """Get debug information about the current state."""
        return {
            "ready": self.ready,
            "kg_builder_initialized": self.kg_builder is not None,
            "workflow_built": self.workflow is not None,
            "indices_loaded": (
                self.kg_builder.kg_index is not None and
                self.kg_builder.vector_index is not None
            ) if self.kg_builder else False
        }

    def _generate_conversation_id(self) -> str:
        """Generate a unique conversation ID."""
        return f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Example usage for testing


async def main():
    """Test function for the LangGraph runner."""
    runner = NadavBotRunner()

    try:
        await runner.initialize()

        # Test queries
        test_queries = [
            "Hi! Tell me about yourself.",
            "What are your main technical skills?",
            "Tell me about your AI projects.",
            "What's your experience with React?"
        ]

        conversation_history = []

        for query in test_queries:
            print(f"\n{'='*50}")
            print(f"User: {query}")
            print(f"{'='*50}")

            result = await runner.process_message(query, conversation_history)

            print(f"NadavBot: {result['response']}")
            print(f"Sources: {result['sources']}")

            # Add to conversation history
            conversation_history.append({"role": "user", "content": query})
            conversation_history.append(
                {"role": "assistant", "content": result['response']})

            # Keep only last 6 messages (3 exchanges)
            if len(conversation_history) > 6:
                conversation_history = conversation_history[-6:]

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())

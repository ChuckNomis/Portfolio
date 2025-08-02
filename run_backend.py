#!/usr/bin/env python3
"""
Convenience script to run the NadavBot backend.
This script handles the setup and starts the FastAPI server.
"""

import os
import sys
import subprocess
from pathlib import Path


def check_requirements():
    """Check if required packages are installed."""
    try:
        import fastapi
        import uvicorn
        import openai
        import langchain
        import langgraph
        from llama_index.core import VectorStoreIndex
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("Please install requirements: pip install -r backend/requirements.txt")
        return False


def check_env_vars():
    """Check if required environment variables are set."""
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY not found in environment variables")
        print("Please set your OpenAI API key:")
        print("  export OPENAI_API_KEY=your_api_key_here")
        print("  or create a .env file with OPENAI_API_KEY=your_api_key_here")
        return False
    print("✅ Environment variables are set")
    return True


def build_knowledge_graph():
    """Build the knowledge graph if it doesn't exist."""
    storage_dir = Path("storage")
    if not storage_dir.exists() or not any(storage_dir.iterdir()):
        print("🔨 Building knowledge graph (this may take a few minutes)...")
        try:
            result = subprocess.run([
                sys.executable, "graph/build_graph.py"
            ], check=True, capture_output=True, text=True)
            print("✅ Knowledge graph built successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to build knowledge graph: {e}")
            print(f"Error output: {e.stderr}")
            return False
    else:
        print("✅ Knowledge graph already exists")
        return True


def main():
    """Main function to start the backend."""
    print("🚀 Starting NadavBot Backend")
    print("=" * 40)

    # Check requirements
    if not check_requirements():
        sys.exit(1)

    # Check environment variables
    if not check_env_vars():
        sys.exit(1)

    # Build knowledge graph
    if not build_knowledge_graph():
        sys.exit(1)

    # Start the server
    print("🌐 Starting FastAPI server...")
    print("Backend will be available at: http://localhost:8000")
    print("API docs will be available at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)

    try:
        os.chdir("backend")
        subprocess.run([
            sys.executable, "-m", "uvicorn", "main:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

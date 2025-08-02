#!/usr/bin/env python3
"""
Virtual Environment Setup Script for NadavBot Portfolio
This script creates and sets up the Python virtual environment with all dependencies.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path


def run_command(command, shell=False):
    """Run a command and return the result."""
    try:
        result = subprocess.run(command, shell=shell,
                                check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr


def create_virtual_environment():
    """Create a Python virtual environment."""
    print("🐍 Creating Python virtual environment...")

    venv_path = Path("venv")
    if venv_path.exists():
        print("✅ Virtual environment already exists")
        return True

    success, output = run_command([sys.executable, "-m", "venv", "venv"])
    if success:
        print("✅ Virtual environment created successfully")
        return True
    else:
        print(f"❌ Failed to create virtual environment: {output}")
        return False


def get_activation_command():
    """Get the command to activate the virtual environment based on OS."""
    if platform.system() == "Windows":
        return "venv\\Scripts\\activate"
    else:
        return "source venv/bin/activate"


def get_python_executable():
    """Get the Python executable path for the virtual environment."""
    if platform.system() == "Windows":
        return "venv\\Scripts\\python.exe"
    else:
        return "venv/bin/python"


def get_pip_executable():
    """Get the pip executable path for the virtual environment."""
    if platform.system() == "Windows":
        return "venv\\Scripts\\pip.exe"
    else:
        return "venv/bin/pip"


def install_dependencies():
    """Install all project dependencies in the virtual environment."""
    print("📦 Installing dependencies...")

    pip_exe = get_pip_executable()

    # Upgrade pip first
    print("⬆️ Upgrading pip...")
    success, output = run_command([pip_exe, "install", "--upgrade", "pip"])
    if not success:
        print(f"⚠️ Warning: Failed to upgrade pip: {output}")

    # Install graph dependencies
    print("🔗 Installing graph dependencies...")
    success, output = run_command(
        [pip_exe, "install", "-r", "graph/requirements.txt"])
    if not success:
        print(f"❌ Failed to install graph dependencies: {output}")
        return False

    # Install backend dependencies
    print("🚀 Installing backend dependencies...")
    success, output = run_command(
        [pip_exe, "install", "-r", "backend/requirements.txt"])
    if not success:
        print(f"❌ Failed to install backend dependencies: {output}")
        return False

    print("✅ All Python dependencies installed successfully")
    return True


def create_activation_scripts():
    """Create convenient activation scripts."""
    print("📝 Creating activation scripts...")

    # Windows activation script
    windows_script = """@echo off
echo 🐍 Activating NadavBot virtual environment...
call venv\\Scripts\\activate.bat
echo ✅ Virtual environment activated!
echo.
echo Available commands:
echo   python run_backend.py    - Start the backend server
echo   python graph/build_graph.py - Build knowledge graph
echo   cd frontend ^&^& npm start - Start frontend (in new terminal)
echo.
"""

    # Unix/Linux/macOS activation script
    unix_script = """#!/bin/bash
echo "🐍 Activating NadavBot virtual environment..."
source venv/bin/activate
echo "✅ Virtual environment activated!"
echo ""
echo "Available commands:"
echo "  python run_backend.py    - Start the backend server"
echo "  python graph/build_graph.py - Build knowledge graph"
echo "  cd frontend && npm start - Start frontend (in new terminal)"
echo ""
"""

    try:
        with open("activate_venv.bat", "w") as f:
            f.write(windows_script)

        with open("activate_venv.sh", "w") as f:
            f.write(unix_script)

        # Make the shell script executable on Unix systems
        if platform.system() != "Windows":
            os.chmod("activate_venv.sh", 0o755)

        print("✅ Activation scripts created")
        return True
    except Exception as e:
        print(f"⚠️ Warning: Failed to create activation scripts: {e}")
        return False


def main():
    """Main setup function."""
    print("🚀 Setting up NadavBot Portfolio Virtual Environment")
    print("=" * 50)

    # Check if Python is available
    if not sys.executable:
        print("❌ Python not found. Please install Python 3.8+ and try again.")
        sys.exit(1)

    print(f"🐍 Using Python: {sys.executable}")
    print(f"📍 Working directory: {os.getcwd()}")

    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)

    # Install dependencies
    if not install_dependencies():
        sys.exit(1)

    # Create activation scripts
    create_activation_scripts()

    # Final instructions
    print("\n" + "=" * 50)
    print("🎉 Virtual Environment Setup Complete!")
    print("=" * 50)

    activation_cmd = get_activation_command()
    print(f"\n📋 Next Steps:")
    print(f"1. Activate the virtual environment:")
    if platform.system() == "Windows":
        print(f"   .\\activate_venv.bat")
        print(f"   OR: {activation_cmd}")
    else:
        print(f"   ./activate_venv.sh")
        print(f"   OR: {activation_cmd}")

    print(f"\n2. Set your OpenAI API key:")
    print(f"   echo 'OPENAI_API_KEY=your_api_key_here' > .env")

    print(f"\n3. Start the application:")
    print(f"   python run_backend.py    # Terminal 1")
    print(f"   cd frontend && npm start # Terminal 2")

    print(f"\n💡 Tip: Always activate the virtual environment before running Python commands!")


if __name__ == "__main__":
    main()

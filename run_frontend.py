#!/usr/bin/env python3
"""
Convenience script to run the NadavBot frontend.
This script handles npm installation and starts the React development server.
"""

import os
import sys
import subprocess
from pathlib import Path


def check_node():
    """Check if Node.js and npm are installed."""
    try:
        node_result = subprocess.run(
            ["node", "--version"], capture_output=True, text=True, check=True)
        npm_result = subprocess.run(
            ["npm", "--version"], capture_output=True, text=True, check=True)
        print(f"✅ Node.js {node_result.stdout.strip()}")
        print(f"✅ npm {npm_result.stdout.strip()}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Node.js or npm not found")
        print("Please install Node.js from https://nodejs.org/")
        return False


def install_dependencies():
    """Install npm dependencies if needed."""
    frontend_dir = Path("frontend")
    node_modules = frontend_dir / "node_modules"

    if not node_modules.exists():
        print("📦 Installing npm dependencies...")
        try:
            os.chdir("frontend")
            subprocess.run(["npm", "install"], check=True)
            print("✅ Dependencies installed successfully")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to install dependencies: {e}")
            return False
    else:
        print("✅ Dependencies already installed")
        return True


def start_dev_server():
    """Start the React development server."""
    print("🌐 Starting React development server...")
    print("Frontend will be available at: http://localhost:3000")
    print("\nPress Ctrl+C to stop the server")
    print("=" * 40)

    try:
        if not os.getcwd().endswith("frontend"):
            os.chdir("frontend")
        subprocess.run(["npm", "start"])
    except KeyboardInterrupt:
        print("\n👋 Development server stopped")
    except Exception as e:
        print(f"❌ Error starting development server: {e}")
        sys.exit(1)


def main():
    """Main function to start the frontend."""
    print("🚀 Starting NadavBot Frontend")
    print("=" * 40)

    # Check Node.js installation
    if not check_node():
        sys.exit(1)

    # Install dependencies
    if not install_dependencies():
        sys.exit(1)

    # Start development server
    start_dev_server()


if __name__ == "__main__":
    main()

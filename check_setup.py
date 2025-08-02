#!/usr/bin/env python3
"""
Setup Checker for NadavBot Portfolio
Verifies that everything is properly configured and ready to run.
"""

import os
import sys
import json
import subprocess
from pathlib import Path


def check_file_exists(filepath, description):
    """Check if a file exists and report status."""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (MISSING)")
        return False


def check_directory_exists(dirpath, description):
    """Check if a directory exists and report status."""
    if Path(dirpath).exists() and Path(dirpath).is_dir():
        print(f"✅ {description}: {dirpath}")
        return True
    else:
        print(f"❌ {description}: {dirpath} (MISSING)")
        return False


def check_env_variable(var_name):
    """Check if environment variable is set."""
    if os.getenv(var_name):
        print(f"✅ Environment variable {var_name} is set")
        return True
    else:
        print(f"❌ Environment variable {var_name} is NOT set")
        return False


def check_env_file():
    """Check if .env file exists and contains OpenAI API key."""
    env_file = Path(".env")
    if not env_file.exists():
        print("❌ .env file not found")
        return False

    try:
        with open(env_file, 'r') as f:
            content = f.read()
            if "OPENAI_API_KEY" in content and "sk-" in content:
                print("✅ .env file exists with OpenAI API key")
                return True
            else:
                print("❌ .env file exists but doesn't contain valid OpenAI API key")
                return False
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False


def check_virtual_environment():
    """Check if virtual environment is activated."""
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("✅ Virtual environment is activated")
        return True
    else:
        print("❌ Virtual environment is NOT activated")
        print("   Run: venv\\Scripts\\activate (Windows) or source venv/bin/activate (Mac/Linux)")
        return False


def check_python_packages():
    """Check if required Python packages are installed."""
    required_packages = [
        'fastapi', 'uvicorn', 'openai', 'langchain', 'langgraph',
        'llama-index', 'pydantic', 'pyyaml'
    ]

    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ Python package: {package}")
        except ImportError:
            print(f"❌ Python package: {package} (NOT INSTALLED)")
            missing_packages.append(package)

    return len(missing_packages) == 0, missing_packages


def check_node_modules():
    """Check if Node.js dependencies are installed."""
    package_json = Path("frontend/package.json")
    node_modules = Path("frontend/node_modules")

    if not package_json.exists():
        print("❌ frontend/package.json not found")
        return False

    if not node_modules.exists():
        print("❌ frontend/node_modules not found")
        print("   Run: cd frontend && npm install")
        return False

    print("✅ Node.js dependencies installed")
    return True


def check_data_files():
    """Check if portfolio data files exist."""
    data_files = [
        ("data/resume.md", "Resume data"),
        ("data/projects.yaml", "Projects data"),
        ("data/timeline.json", "Timeline data"),
        ("data/skills.txt", "Skills data")
    ]

    all_good = True
    for filepath, description in data_files:
        if not check_file_exists(filepath, description):
            all_good = False

    return all_good


def main():
    """Main setup checker function."""
    print("🔍 NadavBot Portfolio Setup Checker")
    print("=" * 50)

    all_checks_passed = True

    # Check project structure
    print("\n📁 Project Structure:")
    structure_checks = [
        ("data", "Data directory"),
        ("graph", "Graph directory"),
        ("backend", "Backend directory"),
        ("frontend", "Frontend directory"),
        ("venv", "Virtual environment")
    ]

    for dirpath, description in structure_checks:
        if not check_directory_exists(dirpath, description):
            all_checks_passed = False

    # Check core files
    print("\n📄 Core Files:")
    core_files = [
        ("README.md", "README file"),
        ("package.json", "Root package.json"),
        ("run_backend.py", "Backend runner"),
        ("run_frontend.py", "Frontend runner"),
        (".gitignore", "Git ignore file")
    ]

    for filepath, description in core_files:
        if not check_file_exists(filepath, description):
            all_checks_passed = False

    # Check environment setup
    print("\n🔐 Environment Setup:")
    if not check_env_file():
        all_checks_passed = False

    if not check_virtual_environment():
        all_checks_passed = False

    # Check Python packages
    print("\n🐍 Python Dependencies:")
    packages_ok, missing = check_python_packages()
    if not packages_ok:
        all_checks_passed = False
        print(f"   Missing packages: {', '.join(missing)}")
        print("   Run: pip install -r graph/requirements.txt && pip install -r backend/requirements.txt")

    # Check Node.js setup
    print("\n📦 Node.js Dependencies:")
    if not check_node_modules():
        all_checks_passed = False

    # Check data files
    print("\n📊 Portfolio Data:")
    if not check_data_files():
        all_checks_passed = False

    # Final verdict
    print("\n" + "=" * 50)
    if all_checks_passed:
        print("🎉 Setup Check PASSED!")
        print("=" * 50)
        print("\n✅ Your NadavBot portfolio is ready to run!")
        print("\n🚀 To start the project:")
        print("1. Make sure virtual environment is activated: venv\\Scripts\\activate")
        print("2. Start backend: python run_backend.py")
        print("3. Start frontend: cd frontend && npm start")
        print("4. Open: http://localhost:3000")
    else:
        print("❌ Setup Check FAILED!")
        print("=" * 50)
        print("\n⚠️ Please fix the issues above before running the project.")
        print("\n📚 Quick fixes:")
        print("- Missing .env: echo 'OPENAI_API_KEY=your_key_here' > .env")
        print("- Missing packages: pip install -r graph/requirements.txt && pip install -r backend/requirements.txt")
        print("- Missing Node modules: cd frontend && npm install")
        print("- Activate venv: venv\\Scripts\\activate")


if __name__ == "__main__":
    main()

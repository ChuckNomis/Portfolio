# 🚀 NadavBot Portfolio - Quick Start Guide

## ✅ **What You Have Now**

Your NadavBot portfolio is completely built! Here's what's ready:

```
Portfolio/
├── 📁 data/           # Your portfolio data (resume, projects, timeline, skills)
├── 📁 graph/          # Knowledge graph builder
├── 📁 backend/        # FastAPI server with LangGraph AI workflow
├── 📁 frontend/       # React ChatGPT-style interface
├── 📁 venv/          # Python virtual environment (✅ CREATED)
└── 📄 setup files    # Convenient startup scripts
```

## 🎯 **Start the Project in 4 Simple Steps**

### **Step 1: Get Your OpenAI API Key**

1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-...`)

### **Step 2: Set Your API Key**

```bash
# Create .env file with your API key
echo OPENAI_API_KEY=your_actual_api_key_here > .env
```

### **Step 3: Activate Virtual Environment**

```bash
# Windows (PowerShell/Command Prompt)
venv\Scripts\activate

# You should see (venv) at the start of your command prompt
```

### **Step 4: Start Both Servers**

**Terminal 1 - Backend:**

```bash
# Make sure (venv) is active, then:
python run_backend.py
```

Wait for: "NadavBot initialized successfully!"

**Terminal 2 - Frontend:**

```bash
# New terminal window:
cd frontend
npm install    # First time only
npm start
```

## 🌐 **Access Your Portfolio**

- **🎨 Frontend (Main Site)**: http://localhost:3000
- **🤖 Backend API**: http://localhost:8000
- **📚 API Docs**: http://localhost:8000/docs

## 🗨️ **Try These Questions**

Once running, try asking NadavBot:

- "Hi! Tell me about yourself"
- "What are your main technical skills?"
- "Tell me about your AI projects"
- "What's your experience with React?"
- "How did you get started in software engineering?"

## ⚠️ **Common Issues & Solutions**

### **"Command not found" errors**

```bash
# Make sure virtual environment is activated
venv\Scripts\activate
# You should see (venv) in your prompt
```

### **OpenAI API errors**

```bash
# Check your .env file exists and has your key
type .env    # Windows
# Should show: OPENAI_API_KEY=sk-your-key-here
```

### **Port already in use**

```bash
# Kill any processes using the ports
netstat -ano | findstr :8000    # Find process using port 8000
taskkill /PID [process_id] /F    # Kill the process
```

### **React won't start**

```bash
cd frontend
npm install    # Install dependencies
npm start      # Try again
```

## 🔄 **Daily Workflow**

**Every time you want to work on the project:**

1. Open terminal in project root
2. Activate venv: `venv\Scripts\activate`
3. Start backend: `python run_backend.py`
4. In new terminal: `cd frontend && npm start`
5. Open http://localhost:3000

## 🎨 **Customization**

**Update your portfolio data:**

1. Edit files in `data/` folder with your real information
2. Restart the backend to rebuild knowledge graph
3. Your chatbot will have updated information!

**Change the design:**

- Modify `frontend/tailwind.config.js` for colors/styling
- Update components in `frontend/src/components/`

## 📞 **Need Help?**

If something doesn't work:

1. Check that virtual environment is activated (`(venv)` in prompt)
2. Verify your OpenAI API key is set correctly
3. Make sure both servers are running (backend first, then frontend)
4. Check the terminal for error messages

## 🎉 **You're All Set!**

Your AI-powered portfolio is ready! The backend builds a knowledge graph from your data, and the frontend provides a beautiful ChatGPT-style interface for visitors to learn about you.

**Happy coding!** 🚀

# NadavBot Portfolio 🤖

A personal portfolio website built as a ChatGPT-style chatbot using Graph RAG (Retrieval-Augmented Generation) technology.

## Features

- **ChatGPT-Style Interface**: Dark theme UI that mirrors the ChatGPT experience
- **Graph RAG Technology**: Uses LlamaIndex and LangGraph for accurate information retrieval
- **AI-Powered Conversations**: Powered by OpenAI GPT models with custom knowledge graph
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Chat**: Fast, interactive conversations about Nadav's experience and skills

## Tech Stack

| Component       | Technology                                     |
| --------------- | ---------------------------------------------- |
| Frontend        | React, TypeScript, TailwindCSS                 |
| Backend         | FastAPI, Python                                |
| AI Framework    | LangGraph, LangChain                           |
| Knowledge Graph | LlamaIndex                                     |
| Language Model  | OpenAI GPT-3.5/4                               |
| Styling         | TailwindCSS with custom ChatGPT-inspired theme |

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- OpenAI API key

### 🚀 Quick Setup (Recommended)

**Option 1: Automated Setup**

```bash
# 1. Set up virtual environment and install Python dependencies
python setup_venv.py

# 2. Activate virtual environment
venv\Scripts\activate  # Windows
# OR source venv/bin/activate  # macOS/Linux

# 3. Create environment file with your OpenAI API key
echo OPENAI_API_KEY=your_openai_api_key_here > .env

# 4. Install frontend dependencies
cd frontend
npm install
cd ..

# 5. Start backend (Terminal 1)
python run_backend.py

# 6. Start frontend (Terminal 2 - new terminal)
cd frontend && npm start
```

### 📋 Manual Setup (Alternative)

**1. Environment Setup**

Create a `.env` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**2. Python Virtual Environment**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate  # Windows
# OR source venv/bin/activate  # macOS/Linux

# Install Python dependencies
pip install -r graph/requirements.txt
pip install -r backend/requirements.txt
```

**3. Frontend Setup**

```bash
cd frontend
npm install
cd ..
```

**4. Start the Application**

```bash
# Terminal 1: Backend (with venv activated)
python run_backend.py

# Terminal 2: Frontend
cd frontend
npm start
```

### 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Project Structure

```
nadavbot-portfolio/
├── data/                    # Knowledge base data
│   ├── resume.md
│   ├── projects.yaml
│   ├── timeline.json
│   └── skills.txt
├── graph/                   # Knowledge graph building
│   ├── build_graph.py
│   └── requirements.txt
├── backend/                 # FastAPI backend
│   ├── main.py
│   ├── langgraph_runner.py
│   ├── prompt_templates.py
│   └── requirements.txt
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Features in Detail

### Graph RAG System

- **Knowledge Graph**: Built with LlamaIndex from structured portfolio data
- **Dual Retrieval**: Both graph-based and vector-based search for comprehensive answers
- **Context-Aware**: Maintains conversation context for natural dialogue

### ChatGPT-Style UI

- **Dark Theme**: Custom color scheme matching ChatGPT aesthetics
- **Message Bubbles**: Distinct styling for user and assistant messages
- **Typing Indicators**: Real-time loading animations
- **Markdown Support**: Rich text rendering with code highlighting
- **Responsive**: Mobile-friendly design

### Conversation Features

- **Welcome Message**: Automatic greeting when chat starts
- **Conversation Starters**: Suggested questions in the sidebar
- **Message History**: Maintains context across conversation
- **Error Handling**: Graceful error messages and retry functionality

## API Endpoints

- `GET /` - Health check
- `POST /chat` - Send message and get response
- `GET /info` - Get bot information and capabilities
- `GET /conversation/suggest` - Get conversation starters
- `GET /health` - Detailed health status

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render)

```bash
cd backend
# Deploy using Docker or direct deployment
```

## Example Questions

- "What are Nadav's main technical skills?"
- "Tell me about Nadav's AI projects"
- "What's Nadav's experience with React?"
- "How did Nadav get started in software engineering?"
- "What technologies does Nadav prefer for backend development?"

## Development

### Adding New Data

1. Update files in the `data/` directory
2. Rebuild the knowledge graph: `python graph/build_graph.py`
3. Restart the backend

### Customizing the UI

- Modify `frontend/tailwind.config.js` for theme changes
- Update components in `frontend/src/components/`
- Styling follows the design in `Style.json`

### Extending Functionality

- Add new API endpoints in `backend/main.py`
- Modify the LangGraph workflow in `backend/langgraph_runner.py`
- Update prompt templates in `backend/prompt_templates.py`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

MIT License - see LICENSE file for details

---

Built with ❤️ using modern AI and web technologies

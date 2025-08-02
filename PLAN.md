# 📘 PLAN.md – NadavBot Portfolio Site

# You have the Style.json file in the dir for the style in the front.

## 🧠 Goal

Create a **personal portfolio site** that is built as a **ChatGPT-style chatbot**, where users can:

- Chat with “NadavBot”
- Ask questions about **you** (Nadav), your projects, experience, values, skills
- Get accurate answers using **Graph RAG**
- See a beautifully styled interface like **ChatGPT**
- Experience your **technical skills** through the product itself

---

## ⚙️ Tech Stack

| Component      | Tool / Framework                                   |
| -------------- | -------------------------------------------------- |
| Language Model | OpenAI API (GPT-4 / GPT-3.5)                       |
| RAG Framework  | LangGraph (based on LangChain)                     |
| Graph Store    | LlamaIndex Knowledge Graph                         |
| Frontend       | React + TailwindCSS + shadcn/ui (ChatGPT-style UI) |
| State / Memory | Short-term memory (3–5 messages in context)        |

---

## 🧩 System Overview

### 🗃️ 1. Knowledge Graph (Graph RAG)

- Use **LangGraph** + LlamaIndex to:
  - Ingest structured data (resume, timeline, project metadata, skills)
  - Build a **graph** of interconnected entities (e.g. Project A → Python → AI)
  - Retrieve **subgraphs** relevant to a user query

### 🧠 2. Prompt Engineering

- Custom **system prompt** with your tone, personality, and limits
- Use prompt template to ensure the model only speaks _as Nadav_ and only from known info
- Short memory: include last 5 exchanges in prompt context

### 💬 3. Chat UI

- Mirror **ChatGPT UI**
  - Chat bubbles (user + bot)
  - Sidebar for theme, info, maybe a few preset prompts
  - Markdown support in responses

---

## 🗂 Suggested Project Structure

```
/nadavbot
├── plan.md
├── data/
│   ├── resume.md
│   ├── projects.yaml
│   ├── timeline.json
│   └── skills.txt
├── graph/
│   └── build_graph.py
├── backend/
│   ├── main.py (FastAPI or Express)
│   ├── langgraph_runner.py
│   └── prompt_templates.py
├── frontend/
│   ├── components/
│   ├── pages/
│   └── app.tsx
├── public/
│   └── og-image.png
├── .env
└── README.md
```

---

## 🛠 Development Steps

### 📦 Phase 1: Graph RAG Setup

- [ ] Prepare data: resume, project list, timeline, skills
- [ ] Ingest data with **LlamaIndex's KG ingestion tools**
- [ ] Build graph with entity linking (e.g. job → project → skill)
- [ ] Test graph queries manually via LangGraph

### 🧠 Phase 2: Prompt Engineering

- [ ] Create a **system prompt** that defines:
  - Nadav's personality and tone
  - Scope of answers ("only answer about Nadav")
  - Rules for behavior ("don't hallucinate or guess")
- [ ] Format final prompt template:

  ```txt
  SYSTEM:
  You are NadavBot, representing Nadav.

  CONTEXT:
  {retrieved_graph_context}

  CHAT HISTORY:
  {previous_messages}

  USER QUESTION:
  {question}
  ```

### 🧠 Phase 3: LangGraph Workflow

- [ ] Define LangGraph nodes:
  - Input handler
  - Graph retriever (query subgraph)
  - Prompt builder
  - LLM response node
- [ ] Add short-term memory window (buffer of past 3–5 messages)

### 💬 Phase 4: Frontend UI

- [ ] Build ChatGPT-like UI (React + Tailwind + shadcn/ui)
- [ ] Add message bubbles, loading indicator, markdown rendering
- [ ] Connect to backend via `/chat` endpoint (calls LangGraph)

### ☁️ Phase 5: Deployment

- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Fly.io / Render / Railway
- [ ] Secure OpenAI key, add CORS config

---

## 🎯 Example Questions NadavBot Should Handle

- “What are Nadav’s core skills?”
- “Tell me about Nadav’s last AI project.”
- “Where did Nadav work in 2023?”
- “Which projects used both Python and LLMs?”
- “How does Nadav think about open source?”

---

## 🧪 Future Ideas (Post-MVP)

- Add voice input/output
- Add “interactive timeline” or “project explorer” mode
- Support file uploads for job-specific questions (“Can Nadav fit this job?”)
- Add security filters (e.g. prevent prompt injection)

---

## ✅ Next Steps

1. Scaffold project folders and init Git repo
2. Write `build_graph.py` and ingest data
3. Test LangGraph pipeline
4. Build initial chat interface
5. Hook it all up and deploy MVP

---

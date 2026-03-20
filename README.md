# HCP CRM — AI-Powered CRM for Life Sciences

HCP CRM is an AI-powered CRM system designed specifically for pharmaceutical Life Sciences field representatives. It leverages advanced Large Language Models (LLMs) to streamline the process of logging, managing, and analyzing interactions with Healthcare Professionals (HCPs).

## 🚀 Tech Stack

- **Frontend:** React 19, Redux Toolkit, Vite
- **Backend:** FastAPI, LangGraph, LangChain
- **LLM:** Groq LLM (`llama-3.3-70b-versatile`)
- **Database:** PostgreSQL via Supabase
- **API Client:** Axios

## ✨ Key Features

- **AI Form Filling:** Describe your meeting in plain English, and the AI automatically extracts relevant data points (HCP name, summary, sentiment, date, time, etc.).
- **Follow-up Suggestions:** Receive intelligent suggestions for the next steps based on the sentiment and outcomes of your interactions.
- **Search Past Interactions:** Easily retrieve history and context for any HCP using natural language queries.
- **Chat-Based Editing:** Update or delete past interactions directly through the chat interface.

## 📁 Folder Structure

```text
.
├── backend/                # FastAPI Backend
│   ├── app/                # Application logic
│   │   ├── agent/          # LangGraph agent and tools
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routes/         # API endpoints
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   └── requirements.txt    # Python dependencies
├── Crm/                    # React Frontend
│   ├── src/                # Source code
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices and API logic
│   │   └── pages/          # Application views
│   └── package.json        # Node.js dependencies
└── LICENSE                 # Apache License 2.0
```

## 🛠 Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- PostgreSQL database (e.g., Supabase)
- Groq API Key

## ⚙️ Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file (see [Environment Variables](#-environment-variables)).
5. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the `Crm` directory:
   ```bash
   cd Crm
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see [Environment Variables](#-environment-variables)).
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://user:password@host:port/dbname
GROQ_API_KEY=your_groq_api_key
```

### Frontend (`Crm/.env`)
```env
VITE_API_URL=http://localhost:8000
```

## 🔌 API Endpoints

- `POST /chat`: Send a natural language query to the AI agent.
- `POST /interactions`: Manually log a new HCP interaction.
- `GET /interactions`: Retrieve a list of all logged interactions.
- `GET /interactions/search?name={hcp_name}`: Search interactions by HCP name.

## 🤖 How to use the AI Assistant

The AI assistant is designed to understand natural language. Here are some example prompts:

- **Logging a meeting:** "I just met with Dr. Smith. We discussed the new efficacy data. He was very positive but had some questions about the side effects."
- **Retrieving history:** "Show me my past meetings with Dr. Jones."
- **Updating records:** "Change the sentiment for my last meeting with Dr. Smith to Neutral."
- **Deleting records:** "Delete my last interaction with Dr. Brown."

## 📸 Screenshots
![Dashboard Placeholder](https://github.com/user-attachments/assets/e4645071-e6e2-4666-9a32-05946510885d)

## 📄 License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

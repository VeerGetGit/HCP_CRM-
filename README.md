# HCP CRM Assistant

A specialized CRM platform designed for Pharmaceutical Sales Representatives to efficiently manage interactions with Healthcare Professionals (HCPs). This system features an integrated AI Assistant that streamlines data entry, provides interaction insights, and suggests next steps.

## 🚀 Features

- **Interaction Management**: Log, search, edit, and delete interactions with HCPs.
- **AI-Powered Assistant**:
  - Natural language interaction logging.
  - Automated outcome generation.
  - Intelligent follow-up suggestions based on sentiment and discussion content.
  - History retrieval via chat.
- **Sentiment Analysis**: Automatically identifies the tone of interactions (Positive, Neutral, Negative).
- **Responsive Dashboard**: A modern, clean interface built with React and styled with Inter font.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit & React-Redux
- **HTTP Client**: Axios
- **Styling**: CSS-in-JS (Flexbox/Grid)

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL (via `psycopg2-binary`) or SQLite
- **Validation**: Pydantic Settings

### AI Engine
- **Orchestration**: LangGraph & LangChain
- **LLM**: Llama-3.3-70b-versatile via Groq
- **Tools**: Custom LangChain tools for database operations

## 📂 Project Structure

```text
HCP_CRM-/
├── Crm/                # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── features/   # Redux logic and API services
│   │   ├── pages/      # Application views (Dashboard)
│   │   └── App.jsx     # Main entry point
│   └── package.json
├── backend/            # FastAPI Backend
│   ├── app/
│   │   ├── agent/      # AI Agent logic (LangGraph)
│   │   ├── models/     # SQLAlchemy models
│   │   ├── routes/     # FastAPI endpoints
│   │   ├── services/   # Business logic
│   │   └── main.py     # API entry point
│   └── requirements.txt
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Groq API Key

### Backend Setup

1. Navigate to the backend directory:
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
4. Configure environment variables. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=sqlite:///./sql_app.db  # Or your PostgreSQL URL
   GROQ_API_KEY=your_groq_api_key_here
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the Crm directory:
   ```bash
   cd Crm
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🤖 AI Assistant Capabilities

The integrated AI assistant (powered by Llama 3.3 via Groq) can:
- **Search**: "What did Dr. Smith say in our last meeting?"
- **Edit**: "Change the sentiment of my last meeting with Dr. Jones to Positive."
- **Summarize**: "Give me a summary of all my interactions."
- **Auto-Fill**: Describe a meeting naturally, and the agent will parse it into structured data, generating outcomes and 3 specific follow-up suggestions.

## 📄 License

This project is licensed under the Apache License 2.0.

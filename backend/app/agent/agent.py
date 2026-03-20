from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from app.agent.tools import (
    log_interaction,
    search_hcp,
    edit_interaction,
    delete_interaction,
    summarize_interactions,
    create_followup,
    suggest_followups,
    generate_outcomes,
)
from app.config import settings

SYSTEM_PROMPT = """You are a CRM assistant for pharma sales reps.

CONTEXT: User may send [CONTEXT]{...}[/CONTEXT] — use current_hcp for edits.

RULES:
1. User asks about past meetings/history → call search_hcp → return {"type":"search","message":"..."}
2. User says update/change/edit/fix → call edit_interaction(hcp_name, field, new_value) → return {"type":"edit","message":"..."}
3. User says delete/remove → call delete_interaction(hcp_name) → return {"type":"search","message":"..."}
4. User describes a NEW meeting/interaction → call generate_outcomes + suggest_followups → return:
{"type":"fill","hcp_name":"...","summary":"...","sentiment":"Positive|Neutral|Negative","follow_up":"...","outcomes":"...","date":"YYYY-MM-DD or empty","time":"HH:MM or empty","attendees":"...","interaction_type":"Meeting|Call|Email|Conference","suggested_followups":["...","...","..."]}
5. Anything else → {"type":"search","message":"..."}

STRICT:
- NEVER invent past data — always call search_hcp
- For edits use hcp_name from [CONTEXT] current_hcp if available
- Convert times: 3pm→15:00, 4:30pm→16:30
- Always return valid JSON with "type" field
- suggested_followups = list of exactly 3 strings
"""

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=settings.GROQ_API_KEY
)

tools = [
    log_interaction,
    search_hcp,
    edit_interaction,
    delete_interaction,
    summarize_interactions,
    create_followup,
    suggest_followups,
    generate_outcomes,
]

agent = create_react_agent(
    llm,
    tools,
    prompt=SystemMessage(content=SYSTEM_PROMPT)
)
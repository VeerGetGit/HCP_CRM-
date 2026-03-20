from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Request: AI chat ───────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    query: str


# ── Response: AI chat  (data dict maps to Redux fillForm fields) ───────────────
class ChatResponse(BaseModel):
    success: bool
    data: dict  # keys: hcp_name, summary, sentiment, follow_up, date, time, etc.


# ── Request: create / update interaction ──────────────────────────────────────
class InteractionCreate(BaseModel):
    hcp_name: Optional[str] = ""
    interaction_type: Optional[str] = "Meeting"
    summary: Optional[str] = ""
    sentiment: Optional[str] = "Neutral"
    follow_up: Optional[str] = ""
    date: Optional[str] = ""
    time: Optional[str] = ""
    attendees: Optional[str] = ""
    outcomes: Optional[str] = ""


# ── Response: single interaction ──────────────────────────────────────────────
class InteractionResponse(BaseModel):
    id: int
    hcp_name: Optional[str]
    interaction_type: Optional[str]
    summary: Optional[str]
    sentiment: Optional[str]
    follow_up: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True  # replaces orm_mode in Pydantic v2

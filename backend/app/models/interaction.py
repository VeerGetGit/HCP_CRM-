from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    interaction_type = Column(String, default="Meeting")
    summary = Column(Text)
    sentiment = Column(String, default="Neutral")
    follow_up = Column(Text)
    date = Column(String)           # stored as string "YYYY-MM-DD"
    time = Column(String)           # stored as string "HH:MM"
    attendees = Column(Text)
    outcomes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

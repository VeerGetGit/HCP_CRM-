from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.services.interaction_service import InteractionService
from app.agent.agent import agent
from app.schemas.interaction_schema import (
    InteractionCreate,
    InteractionResponse,
    ChatRequest,
    ChatResponse,
)
from langchain_core.messages import HumanMessage
import json
import re
import traceback

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = agent.invoke({
            "messages": [HumanMessage(content=request.query)]
        })

        last_message = result["messages"][-1].content

        # Extract JSON from the response
        json_match = re.search(r"\{.*\}", last_message, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group())
        else:
            # Fallback: treat as plain message
            data = {"type": "search", "message": last_message}

        return ChatResponse(success=True, data=data)

    except Exception as e:
        print(f"❌ CHAT ERROR: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interactions", response_model=InteractionResponse)
def create_interaction(
    payload: InteractionCreate, db: Session = Depends(get_db)
):
    try:
        interaction = InteractionService.create(db, payload.model_dump())
        return interaction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interactions")
def list_interactions(db: Session = Depends(get_db)):
    return InteractionService.get_all(db)


@router.get("/interactions/search")
def search_interactions(name: str, db: Session = Depends(get_db)):
    return InteractionService.search(db, name)
from langchain.tools import tool
from app.database import SessionLocal
from app.services.interaction_service import InteractionService
from app.models.interaction import Interaction


@tool
def log_interaction(hcp_name: str, summary: str) -> str:
    """Log a new HCP interaction with the given name and summary."""
    db = SessionLocal()
    try:
        InteractionService.create(db, {
            "hcp_name": hcp_name,
            "summary": summary
        })
        return "Logged successfully"
    finally:
        db.close()


@tool
def search_hcp(hcp_name: str) -> str:
    """
    Search for all past interactions with a specific HCP by name.
    Returns a formatted summary of interaction history including dates,
    sentiment, outcomes and follow-ups. Use this when the user asks about
    a doctor's history, past meetings, or previous interactions.
    """
    db = SessionLocal()
    try:
        data = InteractionService.search(db, hcp_name)
        if not data:
            return f"No past interactions found for {hcp_name}."

        results = []
        for i, d in enumerate(data, 1):
            entry = [f"Interaction #{i} (ID: {d.id})"]
            if d.created_at:
                entry.append(f"  Date: {d.created_at.strftime('%Y-%m-%d')}")
            if d.interaction_type:
                entry.append(f"  Type: {d.interaction_type}")
            if d.summary:
                entry.append(f"  Summary: {d.summary}")
            if d.sentiment:
                entry.append(f"  Sentiment: {d.sentiment}")
            if d.outcomes:
                entry.append(f"  Outcomes: {d.outcomes}")
            if d.follow_up:
                entry.append(f"  Follow-up: {d.follow_up}")
            if d.time:
                entry.append(f"  Time: {d.time}")
            if d.date:
                entry.append(f"  Date recorded: {d.date}")
            results.append("\n".join(entry))

        return (
            f"Found {len(data)} interaction(s) with {hcp_name}:\n\n"
            + "\n\n".join(results)
        )
    finally:
        db.close()


@tool
def edit_interaction(
    hcp_name: str,
    field: str,
    new_value: str
) -> str:
    """
    Edit a specific field of the most recent interaction for a given HCP.
    
    Args:
        hcp_name: Name of the HCP whose interaction to edit
        field: The field to update. Must be one of:
               'summary', 'time', 'date', 'sentiment', 'follow_up',
               'outcomes', 'attendees', 'interaction_type'
        new_value: The new value to set for the field

    Use this when the user says 'update', 'change', 'edit', 'fix',
    'correct' any field of an existing interaction.
    Examples:
      - "change the time to 3pm" -> field='time', new_value='15:00'
      - "update summary to X"    -> field='summary', new_value='X'
      - "change sentiment to Positive" -> field='sentiment', new_value='Positive'
    """
    db = SessionLocal()
    try:
        data = InteractionService.search(db, hcp_name)
        if not data:
            return f"No interactions found for {hcp_name}. Please check the name."

        # Always edit the most recent interaction
        obj = data[-1]

        # Map field name to model attribute
        allowed_fields = {
            "summary":          "summary",
            "time":             "time",
            "date":             "date",
            "sentiment":        "sentiment",
            "follow_up":        "follow_up",
            "followup":         "follow_up",
            "outcomes":         "outcomes",
            "attendees":        "attendees",
            "interaction_type": "interaction_type",
            "type":             "interaction_type",
        }

        model_field = allowed_fields.get(field.lower())
        if not model_field:
            return (
                f"Unknown field '{field}'. "
                f"Allowed fields: {', '.join(allowed_fields.keys())}"
            )

        # Normalize time values like "3pm" -> "15:00"
        if model_field == "time":
            new_value = normalize_time(new_value)

        setattr(obj, model_field, new_value)
        db.commit()
        db.refresh(obj)

        return (
            f"✅ Updated {field} for {hcp_name}'s latest interaction "
            f"to '{new_value}'."
        )
    finally:
        db.close()


def normalize_time(value: str) -> str:
    """Convert time strings like '3pm', '3:30pm', '15:00' to HH:MM format."""
    import re
    value = value.strip().lower()

    # Already HH:MM format
    if re.match(r"^\d{1,2}:\d{2}$", value):
        return value

    # Match patterns like 3pm, 3:30pm, 3:30 pm
    match = re.match(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", value)
    if match:
        hour = int(match.group(1))
        minute = int(match.group(2)) if match.group(2) else 0
        period = match.group(3)

        if period == "pm" and hour != 12:
            hour += 12
        elif period == "am" and hour == 12:
            hour = 0

        return f"{hour:02d}:{minute:02d}"

    return value  # Return as-is if can't parse


@tool
def delete_interaction(hcp_name: str) -> str:
    """
    Delete the most recent interaction for a given HCP from the database.
    Use this when user says 'delete', 'remove', 'clear' an interaction.
    """
    db = SessionLocal()
    try:
        data = InteractionService.search(db, hcp_name)
        if not data:
            return f"No interactions found for {hcp_name}."

        obj = data[-1]
        db.delete(obj)
        db.commit()
        return f"✅ Deleted latest interaction for {hcp_name}."
    finally:
        db.close()


@tool
def summarize_interactions() -> str:
    """Summarize all logged HCP interactions in the database."""
    db = SessionLocal()
    try:
        data = db.query(Interaction).all()
        if not data:
            return "No interactions logged yet."
        return " | ".join([
            f"{d.hcp_name}: {d.summary}" for d in data if d.summary
        ])
    finally:
        db.close()


@tool
def create_followup(hcp_name: str, task: str) -> str:
    """Create a follow-up task for a specific HCP."""
    return f"Follow-up for {hcp_name}: {task}"


@tool
def suggest_followups(
    hcp_name: str,
    summary: str,
    sentiment: str
) -> list:
    """
    Suggest 3 relevant follow-up actions based on the HCP interaction.
    Always call this after every new interaction description.
    """
    suggestions = []

    if sentiment == "Positive":
        suggestions.append(
            f"Schedule a follow-up meeting with {hcp_name} in 2 weeks"
        )
        suggestions.append(
            f"Send {hcp_name} the latest product efficacy data"
        )
    elif sentiment == "Neutral":
        suggestions.append(
            f"Send {hcp_name} additional product information via email"
        )
        suggestions.append(
            f"Schedule a call with {hcp_name} to address any concerns"
        )
    elif sentiment == "Negative":
        suggestions.append(
            f"Escalate {hcp_name}'s concerns to the medical affairs team"
        )
        suggestions.append(
            f"Prepare a detailed response to {hcp_name}'s objections"
        )

    summary_lower = summary.lower()
    if "efficacy" in summary_lower or "clinical" in summary_lower:
        suggestions.append(
            f"Share clinical trial data or case studies with {hcp_name}"
        )
    if "sample" in summary_lower or "brochure" in summary_lower:
        suggestions.append(
            f"Send product samples or brochure to {hcp_name}"
        )
    if "conference" in summary_lower or "event" in summary_lower:
        suggestions.append(
            f"Invite {hcp_name} to the upcoming medical conference"
        )
    if "concern" in summary_lower or "question" in summary_lower:
        suggestions.append(
            f"Follow up with {hcp_name} to address raised concerns"
        )
    if "prescription" in summary_lower or "prescrib" in summary_lower:
        suggestions.append(
            f"Track prescription patterns for {hcp_name} next month"
        )

    suggestions.append(
        f"Add {hcp_name} to the next advisory board invite list"
    )

    return list(dict.fromkeys(suggestions))[:3]


@tool
def generate_outcomes(summary: str, sentiment: str) -> str:
    """
    Generate a professional outcome statement based on the interaction.
    Always call this after every new interaction description.
    """
    sentiment_map = {
        "Positive": "The HCP showed strong interest and positive engagement.",
        "Neutral":  "The HCP was receptive but requires further follow-up.",
        "Negative": "The HCP raised concerns that need to be addressed.",
    }
    base = sentiment_map.get(sentiment, "Interaction completed.")
    return f"{base} Discussion covered: {summary}."
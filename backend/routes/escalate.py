from fastapi import APIRouter, HTTPException
from models.escalation_models import EscalationTicket

router = APIRouter()
tickets = []  # simple in-memory list for now


@router.post("/")
async def create_ticket(ticket: EscalationTicket):
    t = ticket.dict()
    t["id"] = len(tickets) + 1
    tickets.append(t)
    return {"ticket_id": t["id"], "status": "created"}


@router.get("/list")
async def list_tickets():
    return {"tickets": tickets}

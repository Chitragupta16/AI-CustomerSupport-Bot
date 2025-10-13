```python
from fastapi import APIRouter, HTTPException
from models.escalation_models import EscalationTicket
from database.postgres import PostgresService
from services.redis_service import RedisService
from typing import List

router = APIRouter()
postgres = PostgresService()
redis = RedisService()

@router.post("")
async def create_ticket(ticket: EscalationTicket):
    try:
        ticket_id = await postgres.create_ticket(ticket)
        await redis.log_escalation(ticket.customer_email)
        return {"ticket_id": ticket_id, "status": "created"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list")
async def list_tickets(status: str = None):
    try:
        tickets = await postgres.get_tickets(status)
        return {"tickets": tickets}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

# backend/database/postgres.py
import os
from typing import List, Optional
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models.escalation_models import EscalationTicket, TicketResponse, EscalationORM

DATABASE_URL = os.getenv("POSTGRES_URL", "postgresql+asyncpg://user:pass@localhost:5432/db")

engine = create_async_engine(DATABASE_URL, future=True, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class PostgresService:
    async def create_ticket(self, ticket: EscalationTicket) -> int:
        async with AsyncSessionLocal() as session:
            # create ORM model and persist
            orm = EscalationORM(
                customer_email=ticket.customer_email,
                subject=ticket.subject,
                message=ticket.message,
                status="open"
            )
            session.add(orm)
            await session.commit()
            await session.refresh(orm)
            return orm.id

    async def get_tickets(self, status: Optional[str] = None) -> List[TicketResponse]:
        async with AsyncSessionLocal() as session:
            q = session.query(EscalationORM)
            if status:
                q = q.filter(EscalationORM.status == status)
            results = (await session.execute(q)).scalars().all()
            return [TicketResponse.from_orm(r) for r in results]

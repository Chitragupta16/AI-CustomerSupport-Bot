# backend/models/escalation_models.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class EscalationTicket(BaseModel):
    customer_email: EmailStr
    subject: str
    message: str
    metadata: Optional[dict] = None

class TicketResponse(BaseModel):
    id: int
    customer_email: EmailStr
    subject: str
    message: str
    status: str
    created_at: Optional[str]

    class Config:
        orm_mode = True

class EscalationORM(Base):
    __tablename__ = "escalations"
    id = Column(Integer, primary_key=True, index=True)
    customer_email = Column(String(256), nullable=False)
    subject = Column(String(256), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(32), default="open")
    created_at = Column(DateTime, server_default=func.now())

from pydantic import BaseModel, EmailStr

class EscalationTicket(BaseModel):
    customer_email: EmailStr
    subject: str
    message: str

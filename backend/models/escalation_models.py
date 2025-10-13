```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EscalationTicket(BaseModel):
    issue: str
    description: str
    customer_email: str
    status: Optional[str] = "open"
    created_at: Optional[datetime] = None

class TicketResponse(EscalationTicket):
    id: int
```

```python
from pydantic import BaseModel
from typing import Optional

class ChatMessage(BaseModel):
    type: str
    content: str
    timestamp: Optional[float] = None
```

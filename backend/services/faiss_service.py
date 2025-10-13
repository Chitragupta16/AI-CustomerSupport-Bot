```python
import faiss
import numpy as np
import os
from services.gemini_service import GeminiService

class FAISSService:
    def __init__(self):
        self.gemini = GeminiService()
        self.index_path = "faiss_index.index"
        self.index = None
    
    async def create_index(self, documents: list[str]):
        embeddings = await self.gemini.generate_embeddings(documents)
        vectors = np.array(embeddings).astype('float32')
        
        dimension = vectors.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(vectors)
        
        faiss.write_index(self.index, self.index_path)
    
    def load_index(self):
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
    
    async def search(self, query: str, k: int = 3):
        if not self.index:
            self.load_index()
        
        query_embedding = await self.gemini.generate_embeddings([query])
        query_vector = np.array(query_embedding).astype('float32')
        
        distances, indices = self.index.search(query_vector, k)
        return distances, indices
```

# backend/services/faiss_service.py
import os
import json
import uuid
import numpy as np
import faiss
from typing import List, Dict, Any
from services.gemini_service import GeminiService
import asyncio

INDEX_PATH = "faiss_index.index"
META_PATH = "faiss_meta.json"

class FAISSService:
    def __init__(self):
        self.gemini = GeminiService()
        self.index = None
        self.meta: List[Dict[str, Any]] = []

    async def create_index(self, documents: List[str]):
        # embed documents (blocking call handled in gemini_service)
        embeddings = await self.gemini.generate_embeddings(documents)
        vectors = np.array(embeddings).astype('float32')
        if vectors.ndim != 2:
            raise ValueError("Embeddings must be 2D array (n_documents, dim)")
        d = vectors.shape[1]
        index = faiss.IndexFlatL2(d)
        index.add(vectors)
        faiss.write_index(index, INDEX_PATH)

        # store metadata
        self.meta = [{"id": str(uuid.uuid4()), "text": doc} for doc in documents]
        with open(META_PATH, "w", encoding="utf-8") as f:
            json.dump(self.meta, f)

        self.index = index

    def load_index(self):
        if os.path.exists(INDEX_PATH) and os.path.exists(META_PATH):
            self.index = faiss.read_index(INDEX_PATH)
            with open(META_PATH, "r", encoding="utf-8") as f:
                self.meta = json.load(f)

    async def search(self, query: str, k: int = 3):
        if self.index is None:
            self.load_index()
        if self.index is None:
            return []

        query_embedding = await self.gemini.generate_embeddings([query])
        q = np.array(query_embedding).astype('float32')
        if q.ndim == 2:
            q_vec = q
        else:
            q_vec = q.reshape(1, -1)

        distances, indices = self.index.search(q_vec, k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx < len(self.meta):
                results.append({"doc": self.meta[idx]["text"], "meta": self.meta[idx], "score": float(dist)})
        return results

import faiss, numpy as np, json, os, uuid
from typing import List

INDEX_PATH = "faiss.index"
META_PATH = "faiss_meta.json"

class FAISSService:
    def __init__(self):
        self.index = None
        self.meta = []

    async def create_index(self, documents: List[str]):
        # Fake embeddings: random 64D for now (replace later if needed)
        embeddings = np.random.rand(len(documents), 64).astype("float32")
        index = faiss.IndexFlatL2(64)
        index.add(embeddings)
        faiss.write_index(index, INDEX_PATH)
        self.meta = [{"id": str(uuid.uuid4()), "text": d} for d in documents]
        with open(META_PATH, "w") as f:
            json.dump(self.meta, f)

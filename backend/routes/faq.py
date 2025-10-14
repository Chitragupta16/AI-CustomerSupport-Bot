# backend/routes/faq.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import csv, io, os

from services.faiss_service import FAISSService
from services.gemini_service import GeminiService

router = APIRouter()
faiss = FAISSService()
gemini = GeminiService()


@router.post("/upload")
async def upload_faq(file: UploadFile = File(...)):
    """
    Accepts CSV or Markdown file.
    CSV expected columns: id,title,content  (or content-only)
    """
    filename = file.filename or "upload"
    contents = await file.read()

    docs: List[str] = []
    if filename.lower().endswith(".csv"):
        s = contents.decode("utf-8", errors="replace")
        reader = csv.DictReader(io.StringIO(s))
        # prefer 'content' column; if not, join remaining fields
        for row in reader:
            if "content" in row and row["content"].strip():
                docs.append(row["content"].strip())
            else:
                docs.append(" ".join([v for v in row.values() if v]))
    elif filename.lower().endswith(".md") or filename.lower().endswith(".markdown"):
        s = contents.decode("utf-8", errors="replace")
        # simple split by paragraphs
        chunks = [p.strip() for p in s.split("\n\n") if p.strip()]
        docs.extend(chunks)
    else:
        raise HTTPException(status_code=422, detail="Unsupported file type. Use .csv or .md")

    if not docs:
        raise HTTPException(status_code=400, detail="No documents found in upload")

    # Create embeddings and index in FAISS
    await faiss.create_index(documents=docs)
    return {"ok": True, "indexed": len(docs)}

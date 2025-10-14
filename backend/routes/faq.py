from fastapi import APIRouter, UploadFile, File, HTTPException
import io, csv
from services.faiss_service import FAISSService

router = APIRouter()
faiss = FAISSService()


@router.post("/upload")
async def upload_faq(file: UploadFile = File(...)):
    data = await file.read()
    docs = []

    if file.filename.endswith(".csv"):
        reader = csv.DictReader(io.StringIO(data.decode("utf-8")))
        for row in reader:
            docs.append(" ".join(row.values()))
    else:
        docs = data.decode("utf-8").split("\n")

    if not docs:
        raise HTTPException(status_code=400, detail="No FAQ data found")

    await faiss.create_index(docs)
    return {"ok": True, "indexed": len(docs)}

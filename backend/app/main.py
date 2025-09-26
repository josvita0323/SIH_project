import os
import shutil
from fastapi import Body, FastAPI, Form, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session
from werkzeug.utils import secure_filename
from app.crud import *
from app.models import Job
from app.database import create_db_and_tables, get_session

UPLOAD_FOLDER = os.path.join(os.path.dirname(
    os.path.dirname(__file__)), "upload")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="PDF Job Processor")

create_db_and_tables()


class UploadRequest(BaseModel):
    user_id: int

def parse_payload(payload: str = Form(...)) -> UploadRequest:
    try:
        return UploadRequest.model_validate_json(payload)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON in payload")


@app.post("/upload/")
def upload_pdf(file: UploadFile = File(...), payload: UploadRequest = Depends(parse_payload)):
    if file.content_type != "application/pdf" or not file.filename:
        raise HTTPException(
            status_code=400, detail="Invalid file type, only PDFs allowed"
        )

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    user_id = payload.user_id
    job = create_job(user_id=user_id)
    upload = upsert_upload(job_id=job.id, file_path=save_path)
    extract_data(upload.id)

    return {"job_id": job.id, "upload_id": upload.id}


@app.get("/job-status/{job_id}")
def job_status(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"job_id": job.id, "status": job.status}

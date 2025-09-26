import os
import shutil
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from sqlmodel import Session, select
from werkzeug.utils import secure_filename

from app.ocr import OCR_Manager
from app.crud import *
from app.models import Job, JobState, Upload
from app.database import create_db_and_tables, get_session

UPLOAD_FOLDER = os.path.join(os.path.dirname(
    os.path.dirname(__file__)), "upload")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="PDF Job Processor")

create_db_and_tables()


@app.post("/upload/")
def upload_pdf(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if file.content_type != "application/pdf" or not file.filename:
        raise HTTPException(
            status_code=400, detail="Invalid file type, only PDFs allowed"
        )

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Create a job
    # TODO: replace with real user_id
    job = Job(status=JobState.PENDING, user_id=1)
    session.add(job)
    session.commit()
    session.refresh(job)

    # Create an upload linked to this job
    upload = Upload(file_path=save_path, job_id=job.id)
    session.add(upload)
    session.commit()
    extract_data(upload.id, session)

    return {"job_id": job.id, "upload_id": upload.id}

def extract_data(upload_id:int, session:Session = Depends(get_session)):
    upload_path = session.exec(select(Upload.file_path).where(Upload.id == upload_id)).first()
    ocm = OCR_Manager(upload_path)
    pages = ocm.process_doc()
    for page in pages:
        extrcontent = upsert_extracted_content(session, upload_id, " ".join(page["content"]), page["page-number"])
        print(f"{extrcontent.id} has been inserted!")
    print(session.exec(select(ExtractedContent.text)).all())


@app.get("/job-status/{job_id}")
def job_status(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"job_id": job.id, "status": job.status}

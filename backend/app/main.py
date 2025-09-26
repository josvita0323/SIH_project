import os
import shutil
from fastapi import Body, FastAPI, Form, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlmodel import Session
from werkzeug.utils import secure_filename
from app.crud import *
from app.models import Job
from app.database import create_db_and_tables, get_session
from app.summarizer import *
from fastapi.middleware.cors import CORSMiddleware

UPLOAD_FOLDER = os.path.join(os.path.dirname(
    os.path.dirname(__file__)), "upload")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI(title="PDF Job Processor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js port
    allow_methods=["*"],
    allow_headers=["*"],
)

create_db_and_tables()


class UploadRequest(BaseModel):
    user_id: int


def parse_payload(payload: str = Form(...)) -> UploadRequest:
    try:
        return UploadRequest.model_validate_json(payload)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON in payload")


@app.post("/upload/")
def upload_pdf(file: UploadFile = File(...), user_id: int = Form(...)):
    if file.content_type != "application/pdf" or not file.filename:
        raise HTTPException(
            status_code=400, detail="Invalid file type, only PDFs allowed"
        )

    filename = secure_filename(file.filename)
    save_path = os.path.join(UPLOAD_FOLDER, filename)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    job = create_job(user_id=user_id)
    upload = upsert_upload(job_id=job.id, file_path=save_path)
    extraction_text_lists, analysis_data = extract_data(upload.id)
    print(analysis_data)
    for i, page_analysis in enumerate(analysis_data):
        for department_analysis in page_analysis["analysis_results"]:
            sum_obj = summarize_and_store(upload.id, department_analysis["Topic_Name"], str(
                extraction_text_lists[i]), department_analysis["Department_Name"])
            print(f"Added Summarized Content {sum_obj.id}")

    return {"job_id": job.id, "upload_id": upload.id}


@app.get("/job-status/{job_id}")
def job_status(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {"job_id": job.id, "status": job.status}


@app.get("/file/{upload_id}")
def get_file_by_upload_id(upload_id: int, session: Session = Depends(get_session)):
    upload = session.get(Upload, upload_id)
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")

    file_path = upload.file_path
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found on server")

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{os.path.basename(file_path)}"'}
    )


@app.get("/summarized-content/department/{department_name}", response_model=List[SummarizedContent])
def get_summarized_by_department(department_name: str, session: Session = Depends(get_session)):
    statement = select(SummarizedContent).where(
        SummarizedContent.department == department_name)
    results = session.exec(statement).all()
    if not results:
        raise HTTPException(
            status_code=404, detail="No summarized content found for department")
    return results

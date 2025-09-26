from sqlmodel import Session, select
from typing import Optional, List
from app.models import Users, Job, ActionableLine, JobState, Upload, ExtractedContent
from app.database import get_session
from app.ocr import OCR_Manager
from app.llm import *
import json

# Singleton session
session: Session = next(get_session())

# ------------------------------
# Create or Update a Users
# ------------------------------


def upsert_user(email: str, full_name: Optional[str] = None) -> Users:
    stmt = select(Users).where(Users.email == email)
    user = session.exec(stmt).first()

    if user:
        user.full_name = full_name or user.full_name
    else:
        user = Users(email=email, full_name=full_name)
        session.add(user)

    session.commit()
    session.refresh(user)
    return user


# ------------------------------
# Create a Job (always PENDING)
# ------------------------------
def create_job(user_id: int) -> Job:
    job = Job(user_id=user_id, status=JobState.PENDING)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


# ------------------------------
# Complete a Job (mark as FINISHED)
# ------------------------------
def complete_job(job_id: int) -> Job:
    stmt = select(Job).where(Job.id == job_id)
    job = session.exec(stmt).first()

    if not job:
        raise ValueError(f"Job with id {job_id} not found")

    job.status = JobState.FINISHED
    session.commit()
    session.refresh(job)
    return job


# ------------------------------
# Insert Actionable Line
# ------------------------------
def insert_actionable_line(
    upload_id: int,
    job_id: Optional[int],
    content_id: Optional[int],
    paraphrased_line: str,
    departments: List[str],
) -> ActionableLine:
    line = ActionableLine(
        upload_id=upload_id,
        job_id=job_id,
        content_id=content_id,
        paraphrased_line=paraphrased_line,
        departments=departments,
    )
    session.add(line)
    session.commit()
    session.refresh(line)
    return line


# ------------------------------
# Create or Update Upload
# ------------------------------
def upsert_upload(job_id: int | None, file_path: str) -> Upload:
    stmt = select(Upload).where(Upload.job_id ==
                                job_id, Upload.file_path == file_path)
    upload = session.exec(stmt).first()

    if upload:
        upload.file_path = file_path
    else:
        upload = Upload(job_id=job_id, file_path=file_path)
        session.add(upload)

    session.commit()
    session.refresh(upload)
    return upload


# ------------------------------
# Create or Update Extracted Content
# ------------------------------
def upsert_extracted_content(
    upload_id: int,
    text: str,
    page_number: Optional[int] = None,
) -> ExtractedContent:
    stmt = select(ExtractedContent).where(
        ExtractedContent.upload_id == upload_id,
        ExtractedContent.text == text,
        ExtractedContent.page_number == page_number,
    )
    content = session.exec(stmt).first()

    if content:
        content.text = text
        content.page_number = page_number
    else:
        content = ExtractedContent(
            upload_id=upload_id, text=text, page_number=page_number)
        session.add(content)

    session.commit()
    session.refresh(content)
    return content


# ------------------------------
# Fetch Job with Relations
# ------------------------------
def fetch_job_with_details(job_id: int) -> Optional[Job]:
    stmt = select(Job).where(Job.id == job_id)
    job = session.exec(stmt).first()
    return job


# ------------------------------
# Fetch Users
# ------------------------------
def fetch_user(user_id: int) -> Optional[Users]:
    stmt = select(Users).where(Users.id == user_id)
    user = session.exec(stmt).first()
    return user


def get_actionable_lines_for_job(job_id: int) -> List[ActionableLine]:
    stmt = select(ActionableLine).where(ActionableLine.job_id == job_id)
    lines = session.exec(stmt).all()
    return list(lines)


# ------------------------------
# Get a single Actionable Line with all linked data
# ------------------------------
def get_actionable_line_details(line_id: int) -> Optional[ActionableLine]:
    stmt = select(ActionableLine).where(ActionableLine.id == line_id)
    line = session.exec(stmt).first()

    if line:
        _ = line.job
        _ = line.upload
        _ = line.content
        if line.job:
            _ = line.job.user

    return line


def extract_data(upload_id: int | None) -> tuple[list[int], list[dict]]:
    if not upload_id:
        raise ValueError("Nope")
    upload_path = session.exec(
        select(Upload.file_path).where(Upload.id == upload_id)).first()
    if not upload_path:
        raise ValueError("No Path")
    ocm = OCR_Manager(upload_path)
    pages = ocm.process_doc()
    extraction_data_list = []
    actionable_data = []
    for page in pages:
        extrcontent = upsert_extracted_content(
            upload_id, " ".join(page["content"]), page["page-number"])
        print(f"{extrcontent.id} has been inserted!")
        extraction_data_list.append(extrcontent.text)
        output_llm = chain.invoke({
            "text": extrcontent.text,
            "format_instructions": parser.get_format_instructions()
        })
        actionable_data.append(json.loads(output_llm.model_dump_json()))
    return (extraction_data_list, actionable_data)

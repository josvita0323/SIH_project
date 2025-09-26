from sqlmodel import Session, select
from typing import Optional, List
from app.models import Users, Job,  ActionableLine, JobState, Upload, ExtractedContent

# ------------------------------
# Create or Update a Users
# ------------------------------


def upsert_user(session: Session, email: str, full_name: Optional[str] = None) -> Users:
    stmt = select(Users).where(Users.email == email)
    user = session.exec(stmt).first()

    if user:
        # Update existing
        user.full_name = full_name or user.full_name
    else:
        # Insert new
        user = Users(email=email, full_name=full_name)
        session.add(user)

    session.commit()
    session.refresh(user)
    return user


# ------------------------------
# Create a Job (always PENDING)
# ------------------------------
def create_job(session: Session, user_id: int) -> Job:
    job = Job(user_id=user_id, status=JobState.PENDING)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


# ------------------------------
# Complete a Job (mark as FINISHED)
# ------------------------------
def complete_job(session: Session, job_id: int) -> Job:
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
    session: Session,
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
def upsert_upload(
    session: Session,
    job_id: int,
    file_path: str,
) -> Upload:
    stmt = select(Upload).where(Upload.job_id ==
                                job_id, Upload.file_path == file_path)
    upload = session.exec(stmt).first()

    if upload:
        # Update existing
        upload.file_path = file_path
    else:
        # Insert new
        upload = Upload(job_id=job_id, file_path=file_path)
        session.add(upload)

    session.commit()
    session.refresh(upload)
    return upload


# ------------------------------
# Create or Update Extracted Content
# ------------------------------
def upsert_extracted_content(
    session: Session,
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
        # Update existing (maybe text changes?)
        content.text = text
        content.page_number = page_number
    else:
        # Insert new
        content = ExtractedContent(
            upload_id=upload_id,
            text=text,
            page_number=page_number,
        )
        session.add(content)

    session.commit()
    session.refresh(content)
    return content


# ------------------------------
# Fetch Job with Relations
# ------------------------------
def fetch_job_with_details(session: Session, job_id: int) -> Optional[Job]:
    stmt = (
        select(Job)
        .where(Job.id == job_id)
        .options()
    )
    job = session.exec(stmt).first()
    return job

# ------------------------------
# Fetch Users
# ------------------------------


def fetch_user(session: Session, user_id: int) -> Optional[Users]:
    stmt = (
        select(Users)
        .where(Users.id == user_id)
        .options()
    )
    user = session.exec(stmt).first()
    return user


def get_actionable_lines_for_job(session: Session, job_id: int) -> List[ActionableLine]:
    stmt = select(ActionableLine).where(ActionableLine.job_id == job_id)
    lines = session.exec(stmt).all()
    return list(lines)


# ------------------------------
# Get a single Actionable Line with all linked data
# ------------------------------
def get_actionable_line_details(session: Session, line_id: int) -> Optional[ActionableLine]:
    stmt = (
        select(ActionableLine)
        .where(ActionableLine.id == line_id)
    )
    line = session.exec(stmt).first()

    if line:
        _ = line.job  # Job
        _ = line.upload  # Upload
        _ = line.content  # ExtractedContent
        if line.job:
            _ = line.job.user  # User who owns the job

    return line

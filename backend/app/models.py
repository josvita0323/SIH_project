from enum import Enum
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone


class JobState(str, Enum):
    PENDING = "PENDING"
    FINISHED = "FINISHED"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str]

    jobs: List["Job"] = Relationship(back_populates="user")


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    status: JobState = Field(default=JobState.PENDING)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    user: Optional[User] = Relationship(back_populates="jobs")
    uploads: List["Upload"] = Relationship(back_populates="job")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="job")


class Upload(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: Optional[int] = Field(default=None, foreign_key="jobs.id")
    file_path: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    job: Optional[Job] = Relationship(back_populates="uploads")
    extracted_contents: List["ExtractedContent"] = Relationship(
        back_populates="upload")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="upload")


class ExtractedContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    upload_id: int = Field(foreign_key="uploads.id", nullable=False)
    text: str
    page_number: Optional[int]

    upload: Optional[Upload] = Relationship(
        back_populates="extracted_contents")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="content")


class ActionableLine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    upload_id: int = Field(foreign_key="uploads.id", nullable=False)
    job_id: Optional[int] = Field(default=None, foreign_key="jobs.id")
    content_id: Optional[int] = Field(
        default=None, foreign_key="extractedcontent.id")
    paraphrased_line: str
    departments: List[str] = Field(
        default_factory=list, sa_column_kwargs={"type_": "TEXT[]"})

    job: Optional[Job] = Relationship(back_populates="actionable_lines")
    upload: Optional[Upload] = Relationship(back_populates="actionable_lines")
    content: Optional[ExtractedContent] = Relationship(
        back_populates="actionable_lines")

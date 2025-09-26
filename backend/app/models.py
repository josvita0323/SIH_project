from enum import Enum
from typing import Optional, List
from sqlalchemy import String, Column
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import ARRAY


class JobState(str, Enum):
    PENDING = "PENDING"
    FINISHED = "FINISHED"


class Users(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True, nullable=False)
    full_name: Optional[str] = None

    jobs: List["Job"] = Relationship(back_populates="user")


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    # points to "users" table
    user_id: int = Field(foreign_key="users.id", nullable=False)
    status: JobState = Field(default=JobState.PENDING)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    user: Optional["Users"] = Relationship(back_populates="jobs")
    uploads: List["Upload"] = Relationship(back_populates="job")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="job")


class Upload(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: Optional[int] = Field(default=None, foreign_key="job.id")
    file_path: str
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    job: Optional["Job"] = Relationship(back_populates="uploads")
    extracted_contents: List["ExtractedContent"] = Relationship(
        back_populates="upload")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="upload")
    summarized_contents: List["SummarizedContent"] = Relationship(
        back_populates="upload")


class ExtractedContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    upload_id: int = Field(foreign_key="upload.id", nullable=False)
    text: str
    page_number: Optional[int] = None

    upload: Optional["Upload"] = Relationship(
        back_populates="extracted_contents")
    actionable_lines: List["ActionableLine"] = Relationship(
        back_populates="content")


class ActionableLine(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    upload_id: int = Field(foreign_key="upload.id", nullable=False)
    job_id: Optional[int] = Field(default=None, foreign_key="job.id")
    content_id: Optional[int] = Field(
        default=None, foreign_key="extractedcontent.id")
    paraphrased_line: str
    departments: List[str] = Field(
        sa_column=Column(ARRAY(String), nullable=False, server_default='{}')
    )

    job: Optional["Job"] = Relationship(back_populates="actionable_lines")
    upload: Optional["Upload"] = Relationship(
        back_populates="actionable_lines")
    content: Optional["ExtractedContent"] = Relationship(
        back_populates="actionable_lines")


class SummarizedContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str = Field(nullable=False)
    description: str = Field(nullable=False)

    upload_id: Optional[int] = Field(default=None, foreign_key="upload.id")
    department: str = Field(nullable=False)

    upload: Optional["Upload"] = Relationship(
        back_populates="summarized_contents")

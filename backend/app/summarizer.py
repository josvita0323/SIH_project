from pydantic import BaseModel, Field, SecretStr
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
import os
from dotenv import load_dotenv
from app.vector_db import *
from datetime import date
from app.models import SummarizedContent
from app.database import get_session
from app.department import get_department_by_name

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or ""
OPENAI_API_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "openai/gpt-5-nano"


class SummarizedContentSchema(BaseModel):
    title: str = Field(..., description="Title of the summarized content")
    description: str = Field(...,
                             description="Detailed description of the content")


parser = PydanticOutputParser(pydantic_object=SummarizedContentSchema)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        "You are an AI that analyzes documents for different departments. "
        "Your role is to extract and summarize only the parts of the text "
        "that are directly useful to the specified department. "
        "Do not explain what the department does, do not repeat generic context, "
        "and do not include irrelevant details."
    ),
    (
        "user",
        "Document Analysis Request:\n\n"
        "Topic: {action_line}\n"
        "Context: {extracted_content}\n"
        "Department: {department}\n"
        "Department Description: {department_desc}\n\n"
        "Instructions:\n"
        "- Identify if the provided context contains information important for this department.\n"
        "- If yes, summarize ONLY that relevant part concisely so the department "
        "can act without reading the full context.\n"
        "- Avoid redundancy and irrelevant details.\n"
        "- If nothing is relevant, return an empty valued JSON object.\n\n"
        "Return JSON strictly in this format:\n{format_instructions}"
    )
])

llm = ChatOpenAI(
    model=OPENROUTER_MODEL,
    max_retries=2,
    api_key=SecretStr(OPENROUTER_API_KEY),
    base_url=OPENAI_API_BASE,
    temperature=0,
)

chain = prompt | llm | parser


def summarize_and_store(upload_id: int, action_line: str, content: str, department_name: str, topic_name:str, vector_index, source_file:str|None = None) -> SummarizedContent:
    session = next(get_session())

    department = get_department_by_name(department_name)
    if not department:
        raise ValueError("Nope")

    result = chain.invoke({
        "action_line": action_line,
        "extracted_content": content,
        "department": department["title"],
        "department_desc": department["description"],
        "format_instructions": parser.get_format_instructions()
    })

    summary: SummarizedContentSchema = result
    print(summary.model_dump_json(indent=2))

    fetch_results = get_vector_data(vector_index, summary.description, 6)
    fetch_tags = [output["tag"] for output in fetch_results]
    print(f"Related Tags :{fetch_tags}")
    vec_data_id = upsert_vector_data(index=vector_index, topic_data=topic_name, summarized_data=summary.description, department_name=department["name"], source_file=source_file)
    print(f"{vec_data_id} stored in VDB")

    obj = SummarizedContent(
        title=summary.title,
        description=summary.description,
        upload_id=upload_id,
        department=department["name"],
        tags= ",".join(fetch_tags)
    )
    session.add(obj)
    session.commit()
    session.refresh(obj)

    return obj


# print(result.model_dump_json(indent=2))

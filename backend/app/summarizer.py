from pydantic import BaseModel, Field, SecretStr
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
import os
from dotenv import load_dotenv

from app.models import SummarizedContent
from app.database import get_session
from backend.app.department import get_department_by_name

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or ""
OPENAI_API_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "deepseek/deepseek-chat-v3.1:free"


class SummarizedContentSchema(BaseModel):
    title: str = Field(..., description="Title of the summarized content")
    description: str = Field(...,
                             description="Detailed description of the content")


parser = PydanticOutputParser(pydantic_object=SummarizedContentSchema)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are an AI that reads a topic and its related context, "
               "and summarizes the information into structured content relevant "
               "to the specified department."),
    ("user",
     "Document Analysis Request:\n\n"
     "Topic: {action_line}\n"
     "Context: {extracted_content}\n"
     "Department: {department}\n"
     "Department Description: {department_desc}\n\n"
     "Your task: Summarize the context focusing on the topic provided, "
     "highlighting actionable information and insights that are directly "
     "relevant to the department specified.\n\n"
     "Return JSON strictly following this format:\n{format_instructions}")
])

llm = ChatOpenAI(
    model=OPENROUTER_MODEL,
    max_retries=2,
    api_key=SecretStr(OPENROUTER_API_KEY),
    base_url=OPENAI_API_BASE,
    temperature=0,
)

chain = prompt | llm | parser


def summarize_and_store(upload_id: int, action_line: str, content: str, department_name: str) -> SummarizedContent:
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

    obj = SummarizedContent(
        title=summary.title,
        description=summary.description,
        upload_id=upload_id,
        department=department["name"],
    )
    session.add(obj)
    session.commit()
    session.refresh(obj)

    return obj


# print(result.model_dump_json(indent=2))

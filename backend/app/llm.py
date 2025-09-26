from typing import List
from pydantic import BaseModel, Field, SecretStr
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or ""
OPENAI_API_BASE = "https://openrouter.ai/api/v1"
OPENROUTER_MODEL = "openai/gpt-5-nano"

# ----------------------
# Pydantic schemas
# ----------------------


class AnalysisResultSchema(BaseModel):
    Department_Name: str = Field(..., description="Most relevant department")
    Topic_Name: str = Field(..., description="Concise topic name")


class AnalysisResultsList(BaseModel):
    analysis_results: List[AnalysisResultSchema]


# ----------------------
# Parser
# ----------------------
parser = PydanticOutputParser(pydantic_object=AnalysisResultsList)

# ----------------------
# Prompt Template
# ----------------------
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant that always responds in valid JSON format."),
    ("user",
     """Analyze the text data provided below to identify key topics, the most relevant department for each topic, and a summary.

*Context & Rules:*
The data is a meeting transcript. The relevant departments are strictly limited to: "Rolling Stock Operations", "Procurement", "HR & Safety", and "Executive Management".

*Required Output Format:*
{format_instructions}

*Text Data to Analyze:*
{text}
""")
])

# ----------------------
# LLM setup
# ----------------------
llm = ChatOpenAI(
    model=OPENROUTER_MODEL,
    max_retries=2,
    api_key=SecretStr(OPENROUTER_API_KEY),
    base_url=OPENAI_API_BASE,
    temperature=0.4
)

# ----------------------
# Combine prompt + LLM + parser
# ----------------------
chain = prompt | llm | parser

# ----------------------
# Example usage
# ----------------------
if __name__ == "__main__":
    meeting_transcript = """
    Alice mentioned that several trains had delays due to maintenance issues. 
    Bob requested procurement of spare parts for urgent replacements. 
    HR noted an increase in minor workplace accidents this month. 
    The executives discussed the upcoming budget for next quarter.
    """

    result = chain.invoke({
        "text": meeting_transcript,
        "format_instructions": parser.get_format_instructions()
    })

    # Print parsed JSON output
    print(result.model_dump_json(indent=2))

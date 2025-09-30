from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import os
from datetime import date

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
VECTOR_API_KEY = os.getenv("PINECONE_API_KEY")
model = SentenceTransformer('all-MiniLM-L6-v2')
pc = Pinecone(api_key=VECTOR_API_KEY)


def create_index(index_name: str) -> None:
    if not pc.has_index(index_name):
        pc.create_index(
            name=index_name,
            dimension=384,
            metric='cosine',
            spec={
                "serverless": {
                    "cloud": "aws",
                    "region": "us-east-1"
                }
            }
        )
        print("Created Vector DB")
    else:
        print("DB already exists!")


def connect_db(index_name: str):
    vector_index = pc.Index(index_name)
    print("Connected to VECTOR INDEX")
    return vector_index


def upsert_vector_data(index, topic_data: str, summarized_data: str, department_name: str, doc_name: str | None = None) -> str:

    embedded_vector_data = model.encode(topic_data).tolist()
    index.upsert(
        vectors=[{
            "id": f"{date.today()}-{topic_data}-{department_name}",
            "values": embedded_vector_data,
            "metadata": {
                "topic-name": topic_data,
                "chunk-text": summarized_data,
                "source": doc_name,
                "date": date.today().isoformat()
            }
        }
        ])
    print("Successfully inserted vector data!")
    return id


def delete_vector_data(index, list_of_ids: list[str]):

    index.delete(ids=list_of_ids)
    print("Verifying deletion...")
    fetch_response = index.fetch(ids=list_of_ids)
    if not fetch_response.get('vectors'):
        print(
            f"Verification successful: Vector '{list_of_ids[0]}' no longer exists.")
    else:
        print("Verification failed. Vector still exists.")


def get_vector_data(index, query: str, k: int) -> list[dict]:
    response = []
    query_vector = model.encode(query).tolist()
    result = index.query(
        vector=query_vector,
        top_k=k,
        include_metadata=True
    )
    for match in result["matches"]:
        if match["score"] > 0.65:
            response.append({
                "score": match["score"],
                "tag": match["metadata"]["topic-name"],
                "chunk-text": match["metadata"].get("chunktext", ""),
                "date": match["metadata"]["date"],
                "source": match["metadata"]["source"]
            })
    return response

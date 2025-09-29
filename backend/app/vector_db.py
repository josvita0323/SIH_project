from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import os

VECTOR_API_KEY = os.getenv("API_VECTOR_DB")
model = SentenceTransformer('all-MiniLM-L6-v2')
pc = Pinecone(api_key=VECTOR_API_KEY)

def create_index(index_name:str) -> None:
    if not pc.has_index(index_name):
        pc.create_index(
        name=index_name,
        dimension=384, 
        metric='cosine',
        spec={
            "serverless": {
                "cloud": "aws",
                "region": "ap-south-1"
                }
            }
        )
        print("Created Vector DB")
    else:
        print("DB already exists!")
    
def connect_db(index_name:str):
    vector_index = pc.Index(index_name)
    print("Connected to VECTOR INDEX")
    return  vector_index

def upsert_vector_data(index, topic_data:str, id:str, doc_name:str|None):
    if not pc.has_index(index):
        raise Exception("Index does not exist!")
    embedded_vector_data = model.encode(topic_data).tolist()
    index.upsert(
        vectors=[{
            "id": id,
            "values": embedded_vector_data,
            "metadata": {
                "chunk_text": topic_data,
                "source": doc_name if doc_name is None else ""
            }
        }
    ])
    print("Successfully inserted vector data!")

def delete_vector_data(index, list_of_ids:list[str]):
    if not pc.has_index(index):
        raise Exception("Index does not exist!")
    index.delete(ids=list_of_ids)
    print("Verifying deletion...")
    fetch_response = index.fetch(ids=list_of_ids)
    if not fetch_response.get('vectors'):
        print(f"Verification successful: Vector '{list_of_ids[0]}' no longer exists.")
    else:
        print("Verification failed. Vector still exists.")
    
def get_vector_data(index, query:str) -> list[dict]:
    response = []
    query_vector = model.encode(query).tolist()
    result = index.query(
        vector=query_vector,
        top_k=5,
        include_metadata=True
    )
    for match in result["matches"]:
        if match["score"] > 0.65:
            response.append({
                "score": match["score"],
                "tag": match["metadata"]["chunk_text"]
            })
    return response
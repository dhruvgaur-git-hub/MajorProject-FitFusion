import json
from pathlib import Path
from chromadb import PersistentClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.tools import tool
from app.config import EMBEDDING_MODEL

emb_model = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL)

CHROMA_DB_DIR = str(Path(__file__).parent.parent / "rag" / "chroma-db")
DB_COL_NAME = "fitfusion_fitness_knowledge"

try:
    chroma_client = PersistentClient(CHROMA_DB_DIR)
    knowledge_col = chroma_client.get_collection(DB_COL_NAME)
except Exception as e:
    knowledge_col = None
    print(f"WARNING: Fitness knowledge base not found yet ({e}). Ask Varsha to run build_knowledge_base.py first.")


@tool
def retrieve_fitness_knowledge(question: str) -> str:
    """
    Retrieve relevant fitness, nutrition, and supplement knowledge from
    FitFusion's reference material to answer a general fitness question
    (e.g. protein needs, creatine, workout splits, hydration, recovery).
    Use this for any general fitness/nutrition/training question that is
    NOT about a specific product in the store. Returns JSON with relevant
    knowledge sections.
    """
    if knowledge_col is None:
        return json.dumps({"error": "Knowledge base not built yet."})
    try:
        query_embedding = emb_model.embed_query(question)
        results = knowledge_col.query(query_embedding, n_results=3)
        return json.dumps(results)
    except Exception as e:
        return json.dumps({"error": str(e)})
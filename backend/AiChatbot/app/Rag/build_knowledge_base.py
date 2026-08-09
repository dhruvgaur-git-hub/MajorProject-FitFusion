import re
from pathlib import Path
from dotenv import load_dotenv
from chromadb import PersistentClient
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

print("-------------- FitFusion Knowledge Builder --------------")

emb_model = GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")

KNOWLEDGE_MD_PATH = Path(__file__).parent / "fitness_knowledge.md"


def load_sections(path: Path):
    text = path.read_text(encoding="utf-8")
    parts = re.split(r"(?=^## Section:)", text, flags=re.MULTILINE)
    sections = []
    for part in parts:
        part = part.strip()
        if not part.startswith("## Section:"):
            continue
        title = part.splitlines()[0].replace("## Section:", "").strip()
        sections.append({"title": title, "content": part})
    return sections


sections = load_sections(KNOWLEDGE_MD_PATH)
print(f"Loaded {len(sections)} sections from {KNOWLEDGE_MD_PATH.name}")

ids = [f"section-{i}" for i in range(len(sections))]
contents = [s["content"] for s in sections]
metadatas = [{"title": s["title"]} for s in sections]

embeddings = emb_model.embed_documents(contents)
print(f"Embeddings generated for {len(sections)} sections")

try:
    CHROMA_DB_DIR = str(Path(__file__).parent / "chroma-db")
    chroma_client = PersistentClient(CHROMA_DB_DIR)
    DB_COL_NAME = "fitfusion_fitness_knowledge"
    chroma_db_col = chroma_client.get_or_create_collection(DB_COL_NAME)
    print("Chroma DB collection ready:", DB_COL_NAME)
    chroma_db_col.add(ids, embeddings, metadatas, documents=contents)
    print("Sections saved to ChromaDB:", len(sections))
except Exception as e:
    print("ERROR:", e)
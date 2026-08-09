from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("api key not found")


LLM_MODEL = "google_genai:gemini-3.5-flash"
EMBEDDING_MODEL = "models/gemini-embedding-001"
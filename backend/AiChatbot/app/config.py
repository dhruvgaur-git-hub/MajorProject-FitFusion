from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("Google API key not found")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("Groq API key not found")

LLM_MODEL = "groq:openai/gpt-oss-20b"
EMBEDDING_MODEL = "models/gemini-embedding-001"
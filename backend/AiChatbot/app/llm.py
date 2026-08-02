from fastapi import HTTPException
from google import genai
from app.config import GOOGLE_API_KEY
from google.genai.errors import ClientError

client = genai.Client(api_key=GOOGLE_API_KEY)


def generate_response(message: str, model: str) -> str:
    try:
        print("Model:", model)
        print("API Key Loaded:", GOOGLE_API_KEY is not None)
        response = client.models.generate_content(
            model=model,
            contents=message,
        )
        return response.text
    except ClientError as e:
        raise HTTPException(status_code=502, detail=str(e))
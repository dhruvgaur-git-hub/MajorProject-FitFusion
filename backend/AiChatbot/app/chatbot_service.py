from app.llm import generate_response
from app.prompts import FITFUSION_SYSTEM_PROMPT

def chat(message: str, model: str) -> str:
    prompt= f"""{FITFUSION_SYSTEM_PROMPT} 
        User Question: {str}
    """


    response = generate_response(message=prompt, model=model)

    return response
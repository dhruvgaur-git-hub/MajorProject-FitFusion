from app.llm import generate_response
from app.prompts import FITFUSION_SYSTEM_PROMPT


def build_prompt(message:str, history:str):
    prompt= f"FITFUSION SYSTEM PROMPT: {FITFUSION_SYSTEM_PROMPT}\n\n" 
    prompt+=f"chat history: "
    for chat in history:
        prompt+=f"{chat.role} : {chat.history}" 
    prompt+=f"User Question: {message}\n"
    return prompt
def chat(message: str, history:str, model: str) -> str:
    prompt= build_prompt(message, history)


    response = generate_response(message=prompt, model=model)

    return response
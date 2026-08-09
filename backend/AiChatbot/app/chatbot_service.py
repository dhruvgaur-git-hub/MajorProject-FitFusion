from app.llm import generate_response
from app.prompts import FITFUSION_SYSTEM_PROMPT
from app.schema import ChatMessage
from typing import List

def build_prompt(message:str, history:List[ChatMessage]):
    prompt= f"FITFUSION SYSTEM PROMPT: {FITFUSION_SYSTEM_PROMPT}\n\n" 
    prompt+=f"chat history: "
    for chat in history:
        prompt+=f"{chat.role} : {chat.content}" 
    prompt+=f"User Question: {message}\n"
    return prompt
def chat(message: str, history:List[ChatMessage], model: str) -> str:
    prompt= build_prompt(message, history)


    response = generate_response(message=prompt, model=model)

    return response
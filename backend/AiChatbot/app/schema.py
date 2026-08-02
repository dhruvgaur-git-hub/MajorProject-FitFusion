from pydantic import BaseModel
from typing import List
class ChatMessage(BaseModel):
    user: str
    role: str
class Request(BaseModel):
    message : str
    history: List[ChatMessage]=[] 
    temperature :float =0.7
    model :str = "gemini-3.6-flash"

class Response(BaseModel):
    response:str

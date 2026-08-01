from pydantic import BaseModel
class Request(BaseModel):
    message : str 
    temperature :float =0.7
    model :str = "gemini-3.6-flash"

class Response(BaseModel):
    response:str

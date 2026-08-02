from fastapi import APIRouter
from app.schema import Request, Response
from app.chatbot_service import chat

router= APIRouter()
@router.post("/chat", response_model=Response)
def postChat(req: Request):
    resp=chat(message=req.message, history=req.history, model= req.model)
    print(req.model_dump()) 

    return Response(response=resp)
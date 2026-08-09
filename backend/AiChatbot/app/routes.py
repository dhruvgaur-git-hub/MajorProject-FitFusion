from fastapi import APIRouter
from app.schema import Request, Response
from app.agent import agent
from langchain.messages import HumanMessage, AIMessage

router = APIRouter()


@router.post("/chat", response_model=Response)
def postChat(req: Request):
    try:
        messages = []
        for h in req.history:
            if h.role == "user":
                messages.append(HumanMessage(h.content))
            else:
                messages.append(AIMessage(h.content))
        messages.append(HumanMessage(req.message))

        result = agent.invoke({"messages": messages})
        ai_msg = result["messages"][-1]
        return Response(status="success", response=ai_msg.content)
    except Exception as e:
        print(f"Agent error: {e}")
        return Response(
            status="failed",
            response="Sorry, I'm having trouble answering that right now. Please try again."
        )
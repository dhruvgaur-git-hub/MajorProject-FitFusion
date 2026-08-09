from app.agent import agent
from langchain.messages import HumanMessage

print("FitFusion AI Trainer — local test console")
print("Type 'exit' to quit.\n")

history = []

while True:
    question = input("You: ")
    if question.strip().lower() == "exit":
        break

    history.append(HumanMessage(question))
    result = agent.invoke({"messages": history})
    ai_msg = result["messages"][-1]
    
    if isinstance(ai_msg.content, list):
        text_parts = [block.get("text", "") for block in ai_msg.content if isinstance(block, dict) and block.get("type") == "text"]
        print("Trainer:", " ".join(text_parts))
    else:
        print("Trainer:", ai_msg.content)
    
    history.append(ai_msg)
    print("=" * 90)
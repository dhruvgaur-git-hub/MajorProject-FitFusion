from app.llm import generate_response


def chat(message: str, model: str) -> str:
    response = generate_response(message, model)

    return response
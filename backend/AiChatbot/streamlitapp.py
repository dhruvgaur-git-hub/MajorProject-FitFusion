import streamlit as st
import requests

st.markdown("""
<style>

/* Entire app */
html, body, [class*="css"] {
    font-family: "Segoe UI", sans-serif;
    font-size: 18px;
}

/* Chat messages */
.stChatMessage p {
    font-size: 20px !important;
    line-height: 1.7;
}

/* Chat input */
.stChatInput input {
    font-size: 18px !important;
}

/* Sidebar */
section[data-testid="stSidebar"] {
    font-size: 17px;
}

/* Buttons */
.stButton button {
    font-size: 18px;
}

/* Title */
h1 {
    font-size: 48px !important;
}

/* Caption */
[data-testid="stCaptionContainer"] {
    font-size: 18px;
}

</style>
""", unsafe_allow_html=True)

st.set_page_config(
    page_title="FitFusion AI Assistant",
    page_icon="🗿",
    layout="wide"
)

st.title("🗿 FitFusion AI Assistant")
st.caption(
    "Your AI fitness coach, shopping assistant, and product expert."
)
# Session State Initialization
if "messages" not in st.session_state:
    st.session_state.messages = []
if "model" not in st.session_state:
    st.session_state.model = "gemini-3.6-flash"
if "temperature" not in st.session_state:
    st.session_state.temperature = 0.7

if not st.session_state.messages:
    st.info(
        """
👋 Welcome to **FitFusion AI Assistant**

I can help you with:

- 🏋️ Workout guidance
- 🥗 Nutrition advice
- 💊 Supplement information
- 🛍️ Product explanations
- ⚖️ Product comparisons
- 📦 Order related questions (coming soon)

Start by asking a question below.
"""
    )
with st.sidebar:
    st.header("⚙️ Settings")
    st.write("Model: Gemini 3.6 Flash")
    st.session_state.temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=0.7,
        step=0.1
    )
    st.divider()

    st.subheader("Project")

    st.write("Frontend : Streamlit")
    st.write("Backend : FastAPI")
    st.write("LLM : Gemini")
    if st.button("🗑️ Clear Chat"):
        st.session_state.messages = []
        st.rerun()
    with st.expander("About"):
        st.write(
        """
        FitFusion AI Assistant uses Google's Gemini model
        to answer fitness and product related questions.

        Current Version: v1.0
        """
            )

# Dummy Chat Function
# (Will later call FastAPI)

def get_response(user_message: str, history:list) -> str:
    payload = {
    "message": user_message,
    "history": history,
    "temperature": st.session_state.temperature,
    "model": st.session_state.model
    }
    try:
        response= requests.post("http://127.0.0.1:8000/chat",json=payload, timeout=60)
        response.raise_for_status()
        return response.json()["response"]

    except requests.exceptions.ConnectionError:
        return "Could not connect to the FastAPI backend."
    except requests.exceptions.Timeout:
        return "Request timed out."
    except Exception as e:
        return f"{str(e)}"



#display previous messages
for message in st.session_state.messages:

    with st.chat_message(message["role"]):
        st.markdown(message["content"])



# User Input

if user_message := st.chat_input("Ask about fitness, nutrition, supplements or products"):
    history = st.session_state.messages.copy()
    # Display user message
    with st.chat_message("user",avatar="💪"):
        st.markdown(user_message)

    st.session_state.messages.append(
        {
            "role": "user",
            "content": user_message
        }
    )

    # Assistant response
    with st.chat_message("assistant",avatar="🗿"):
        

        with st.spinner("FitFusion AI is thinking..."):
            response = get_response(user_message, history)

        st.markdown(response)

    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": response
        }
    )
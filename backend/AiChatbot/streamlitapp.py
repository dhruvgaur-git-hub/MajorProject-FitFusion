import streamlit as st

# ------------------------------
# Page Configuration
# ------------------------------
st.set_page_config(
    page_title="FitFusion AI Chatbot",
    page_icon="💪",
    layout="wide"
)

st.title("💪 FitFusion AI Chatbot")

# ------------------------------
# Session State Initialization
# ------------------------------
if "messages" not in st.session_state:
    st.session_state.messages = []

if "model" not in st.session_state:
    st.session_state.model = "gemini-2.5-flash"

if "temperature" not in st.session_state:
    st.session_state.temperature = 0.7


# ------------------------------
# Sidebar
# ------------------------------
with st.sidebar:

    st.header("⚙️ Settings")

    st.session_state.model = st.selectbox(
        "Model",
        [
            "gemini-2.5-flash",
            "gemini-2.5-pro"
        ]
    )

    st.session_state.temperature = st.slider(
        "Temperature",
        min_value=0.0,
        max_value=1.0,
        value=0.7,
        step=0.1
    )

    st.divider()

    st.success("🟢 Frontend Running")

    if st.button("🗑️ Clear Chat"):
        st.session_state.messages = []
        st.rerun()


# ------------------------------
# Dummy Chat Function
# (Will later call FastAPI)
# ------------------------------
def get_response(user_message: str) -> str:
    return f"Echo: {user_message}"


# ------------------------------
# Display Previous Messages
# ------------------------------
for message in st.session_state.messages:

    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# ------------------------------
# User Input
# ------------------------------
if user_message := st.chat_input("Ask anything about fitness..."):

    # Display user message
    with st.chat_message("user"):
        st.markdown(user_message)

    st.session_state.messages.append(
        {
            "role": "user",
            "content": user_message
        }
    )

    # Assistant response
    with st.chat_message("assistant"):

        with st.spinner("Thinking..."):
            response = get_response(user_message)

        st.markdown(response)

    st.session_state.messages.append(
        {
            "role": "assistant",
            "content": response
        }
    )
import { useState } from "react";
import Navbar from "../../components/Navbar";
import axiosClient from "../../api/AxiosClient";

function AIAssistant() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input
        };

        const history = [...messages];

        setMessages(prev => [...prev, userMessage]);

        setLoading(true);

        try {

            const payload = {
                message: input,
                history: history,
                temperature: 0.7,
                model: "gemini-3.6-flash"
            };

            const response = await axiosClient.post("/api/ai/chat", payload);

            const assistantMessage = {
                role: "assistant",
                content: response.data.response
            };

            setMessages(prev => [...prev, assistantMessage]);

        }
        catch (error) {

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: "Unable to contact AI service."
                }
            ]);
            console.log(error)

        }

        setInput("");
        setLoading(false);

    };

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <h2>💪 FitFusion AI Assistant</h2>

                <p className="text-muted">
                    Ask about fitness, nutrition, supplements or products.
                </p>

                <div
                    className="border rounded p-3 mb-3"
                    style={{
                        height: "500px",
                        overflowY: "auto"
                    }}
                >

                    {
                        messages.map((msg, index) => (

                            <div
                                key={index}
                                className={`d-flex mb-3 ${
                                    msg.role === "user"
                                        ? "justify-content-end"
                                        : "justify-content-start"
                                }`}
                            >

                                <div
                                    className={`card ${
                                        msg.role === "user"
                                            ? "bg-primary text-white"
                                            : "bg-light"
                                    }`}
                                    style={{ maxWidth: "70%" }}
                                >

                                    <div className="card-body">

                                        <strong>
                                            {msg.role === "user"
                                                ? "You"
                                                : "FitFusion AI"}
                                        </strong>

                                        <hr />

                                        <p className="mb-0">
                                            {msg.content}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))
                    }

                    {
                        loading &&
                        <p>
                            <i>Thinking...</i>
                        </p>
                    }

                </div>

                <div className="input-group">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ask something..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                sendMessage();
                        }}
                    />

                    <button
                        className="btn btn-primary"
                        onClick={sendMessage}
                    >
                        Send
                    </button>

                </div>

            </div>
        </>
    );
}

export default AIAssistant;
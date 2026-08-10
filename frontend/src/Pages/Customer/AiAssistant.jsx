
import { useState, useRef, useEffect } from "react";

import Navbar from "../../Components/Navbar";
import axiosClient from "../../api/axiosClient";

function AIAssistant() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {

        if (!input.trim() || loading) return;

        const userMessage = {
            role: "user",
            content: input
        };

        const history = [...messages];

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {

            const payload = {
                message: input,
                history: history,
                temperature: 0.7,
                model: "gemini-2.5-flash"
            };

            const response = await axiosClient.post("/api/ai/chat", payload);

            const assistantMessage = {
                role: "assistant",
                content: response.data.response
            };

            setMessages(prev => [...prev, assistantMessage]);

        }
        catch (error) {

            console.log(error);

            const errorMessage =
                error.response?.data?.detail ||
                "Unable to contact AI service.";

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: errorMessage
                }
            ]);

        }

        setLoading(false);

    };

    return (
        <>
            <Navbar />

            <div className="ai-assistant-page">
                <div className="container py-4" style={{ maxWidth: "820px" }}>

                    <div className="d-flex align-items-center gap-3 mb-1">
                        <div className="ai-avatar-badge">🤖</div>
                        <div>
                            <h4 className="mb-0 fw-bold">EFusyn AI</h4>
                            <p className="text-muted mb-0 small">
                                Ask about fitness, nutrition, supplements or products.
                            </p>
                        </div>
                    </div>

                    <div className="chat-window shadow-sm mt-4">

                        <div className="chat-messages">

                            {messages.length === 0 && !loading && (
                                <div className="chat-empty-state">
                                    <p className="text-muted mb-0">
                                        Ask me anything about workouts, nutrition, or FitFusion products to get started.
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`d-flex mb-3 ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
                                >
                                    <div className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="d-flex mb-3 justify-content-start">
                                    <div className="chat-bubble chat-bubble-ai typing-indicator">
                                        <span></span><span></span><span></span>
                                    </div>
                                </div>
                            )}

                            <div ref={chatEndRef}></div>

                        </div>

                        <div className="chat-input-bar">
                            <input
                                type="text"
                                className="form-control chat-input"
                                placeholder="Ask something..."
                                value={input}
                                disabled={loading}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        sendMessage();
                                }}
                            />

                            <button
                                className="chat-send-btn"
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                aria-label="Send message"
                            >
                                {loading ? (
                                    <span className="chat-send-loading"></span>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "rotate(180deg)" }}>
                                        <path d="M4 12L20 4L13 12L20 20L4 12Z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                    </div>

                </div>
            </div>

            <style>{`
                .ai-assistant-page {
                    min-height: calc(100vh - 70px);
                    background: #f4f6f8;
                }
                .ai-avatar-badge {
                    width: 42px;
                    height: 42px;
                    border-radius: 11px;
                    background: #ffede5;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                }
                .chat-window {
                    background: #fff;
                    border-radius: 16px;
                    border: 1px solid #e9ecef;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .chat-messages {
                    height: 480px;
                    overflow-y: auto;
                    padding: 20px;
                }
                .chat-empty-state {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 8px;
                    padding: 0 40px;
                }
                .chat-bubble {
                    max-width: 68%;
                    padding: 10px 16px;
                    border-radius: 16px;
                    line-height: 1.5;
                    font-size: 0.95rem;
                    white-space: pre-wrap;
                }
                .chat-bubble-user {
                    background: #ff6b35;
                    color: #fff;
                    border-bottom-right-radius: 4px;
                }
                .chat-bubble-ai {
                    background: #f1f3f5;
                    color: #212529;
                    border-bottom-left-radius: 4px;
                }
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 14px 16px;
                }
                .typing-indicator span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #adb5bd;
                    animation: typing-bounce 1.2s infinite ease-in-out;
                }
                .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
                @keyframes typing-bounce {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
                    30% { transform: translateY(-4px); opacity: 1; }
                }
                .chat-input-bar {
                    display: flex;
                    gap: 10px;
                    padding: 14px;
                    border-top: 1px solid #e9ecef;
                    background: #fff;
                }
                .chat-input {
                    border-radius: 999px;
                    padding: 10px 18px;
                }
                .chat-input:focus {
                    box-shadow: 0 0 0 0.2rem rgba(255, 107, 53, 0.15);
                    border-color: #ff6b35;
                }
                .chat-send-btn {
                    width: 44px;
                    height: 44px;
                    flex-shrink: 0;
                    border: none;
                    border-radius: 13px;
                    background: #ff6b35;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s ease, transform 0.1s ease;
                }
                .chat-send-btn:hover:not(:disabled) {
                    background: #e8552b;
                }
                .chat-send-btn:active:not(:disabled) {
                    transform: scale(0.94);
                }
                .chat-send-btn:disabled {
                    background: #ffb99a;
                    color: #fff;
                }
                .chat-send-loading {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}

export default AIAssistant;

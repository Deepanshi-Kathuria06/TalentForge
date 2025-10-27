import React, { useState } from "react";
import "../assets/styles/chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm ResumeBot! I can help you write resume content." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
   const response = await fetch("http://localhost:5000/api/openrouter/generate", {

  method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are a professional resume writing assistant. Create concise, impactful resume bullet points. Focus on action verbs, quantifiable results, and professional language. Keep responses under 2 sentences."
          },
          {
            role: "user",
            content: `Create a professional resume bullet point for: ${input}`
          }
        ]
      }),
    });

    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP Error:", response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    const botReply = {
      sender: "bot",
      text: data.output?.[0]?.content || "✨ Here's your professional resume content!"
    };

    setMessages((prev) => [...prev, botReply]);
  } catch (err) {
    console.error("API error:", err);
    
    let errorMessage = "Service temporarily unavailable. Please try again later.";
    
    if (err.message.includes("HTTP error! status: 401")) {
      errorMessage = "API key issue. Please check OpenRouter configuration.";
    } else if (err.message.includes("Failed to fetch")) {
      errorMessage = "Network error. Please check if backend server is running.";
    }
    
    setMessages((prev) => [
      ...prev,
      { 
        sender: "bot", 
        text: errorMessage 
      },
    ]);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ResumeBot</span>
            <button onClick={handleToggle}>✖</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">⏳ Thinking...</div>}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type a skill or experience for your resume..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}

      <button className="chatbot-toggle" onClick={handleToggle}>
        💬
      </button>
    </div>
  );
};

export default Chatbot;
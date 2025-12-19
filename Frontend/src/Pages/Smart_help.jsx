import { useState, useEffect, useRef } from "react";
import "../Style/SmartHelp.css";

const Smart_help = () => {
  const [conversations, setConversations] = useState([
    { id: 1, title: "New Chat", messages: [] },
  ]);
  const [activeId, setActiveId] = useState(1);
  const [query, setQuery] = useState("");

  const chatEndRef = useRef(null);

  // ===============================
  // ACTIVE CONVERSATION (SAFE)
  // ===============================
  const activeConversation =
    conversations.find((c) => c.id === activeId) || conversations[0];

  // ===============================
  // CREATE NEW CHAT
  // ===============================
  const MAX_CHATS = 20;

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setConversations((prev) => {
      const updated = [newChat, ...prev];
      return updated.slice(0, MAX_CHATS); // 🔑 LIMIT
    });

    setActiveId(newChat.id);
    setQuery("");
  };

  // ===============================
  // REMOVE CHAT
  // ===============================
  const removeChat = (id) => {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (id === activeId && updated.length > 0) {
        setActiveId(updated[0].id);
      }
      return updated;
    });
  };

  // ===============================
  // SEND MESSAGE
  // ===============================
  const sendMessage = async () => {
    if (!query.trim()) return;

    const messageText = query;

    setQuery("");

    // Optimistic UI update
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeId
          ? {
              ...conv,
              messages: [...conv.messages, { role: "user", text: messageText }],
            }
          : conv
      )
    );

    // Save to backend
    const form = new FormData();
    form.append("session_id", activeId);
    form.append("text", messageText);
    form.append("role", "user");

    await fetch("http://127.0.0.1:8000/chat/message/", {
      method: "POST",
      body: form,
      credentials: "include",
    });
  };


  // ===============================
  // ENTER vs SHIFT+ENTER
  // ===============================
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ===============================
  // AUTO SCROLL
  
  // ===============================

  useEffect(() => {
    fetch("http://127.0.0.1:8000/chat/list/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.chats && data.chats.length > 0) {
          setConversations(
            data.chats.map((c) => ({
              ...c,
              messages: [],
            }))
          );
          setActiveId(data.chats[0].id);
        }
      });
  }, []);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation.messages]);

  useEffect(() => {
    if (!activeId) return;

    fetch(`http://127.0.0.1:8000/chat/${activeId}/messages/`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId
              ? { ...conv, messages: data.messages }
              : conv
          )
        );
      });
  }, [activeId]);


  return (
    <div className="ai-layout">
      {/* ================= SIDEBAR ================= */}
      <aside className="ai-sidebar">
        <button className="new-chat-btn" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="chat-history">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`chat-item ${conv.id === activeId ? "active" : ""}`}
              onClick={() => setActiveId(conv.id)}
            >
              <span className="chat-title">{conv.title}</span>
              <span
                className="chat-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChat(conv.id);
                }}
              >
                ✕
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="ai-main">
        <h1 className="smart-help-title">Smart Help</h1>
        <p className="smart-help-subtitle">
          Ask SmartZen AI anything about health, reports, or lifestyle
        </p>

        {/* ================= CHAT WINDOW ================= */}
        <div
          className={`chat-window ${
            activeConversation.messages.length === 0 ? "empty" : ""
          }`}
        >
          {activeConversation.messages.length === 0 ? (
            <div className="empty-chat">
              Start a conversation by typing below 👇
            </div>
          ) : (
            activeConversation.messages.map((msg, index) => (
              <div key={index} className={`chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* ================= INPUT ================= */}
        <div className="smart-help-search">
          <textarea
            className="chat-textarea"
            placeholder="Ask SmartZen AI…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={handleKeyDown}
          />
          <button onClick={sendMessage}>Ask</button>
        </div>

        <p className="input-hint">
          Press <b>Enter</b> to send • <b>Shift + Enter</b> for new line
        </p>
      </main>
    </div>
  );
};

export default Smart_help;

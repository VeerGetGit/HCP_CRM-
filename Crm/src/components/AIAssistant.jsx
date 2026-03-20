import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fillForm,
  addMessage,
  setLoading,
  setError,
} from "../features/interactions/interactionSlice";

const API = import.meta.env.VITE_API_URL;

function ChatWindow() {
  const { messages, loading } = useSelector((state) => state.interaction);

  return (
    <div style={styles.chatWindow}>
      {messages.length === 0 && (
        <p style={styles.placeholder}>
          Log an interaction (e.g. "Met Dr. Smith at 4pm, discussed Product X,
          positive sentiment") or ask questions like "tell me about Dr. Smith"
          or "change the time to 3pm".
        </p>
      )}
      {messages.map((c, i) => (
        <div
          key={i}
          style={{
            ...styles.bubble,
            ...(c.role === "user" ? styles.userBubble : styles.aiBubble),
          }}
        >
          <span style={styles.bubbleRole}>
            {c.role === "user" ? "You" : "AI"}:
          </span>
          <span style={styles.bubbleText}>{c.text}</span>
        </div>
      ))}
      {loading && (
        <div style={styles.loadingRow}>
          <span style={styles.dot} />
          <span style={styles.dot} />
          <span style={styles.dot} />
        </div>
      )}
    </div>
  );
}

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  // ✅ Read current form from Redux to send as context
  const form = useSelector((state) => state.interaction.form);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    dispatch(addMessage({ role: "user", text: userText }));
    dispatch(setLoading(true));

    try {
      // ✅ Attach current form context so AI knows which HCP is loaded
      const context = {
        current_hcp:              form.hcp || "",
        current_time:             form.time || "",
        current_date:             form.date || "",
        current_sentiment:        form.sentiment || "",
        current_interaction_type: form.interactionType || "",
        current_summary:          form.topics || form.summary || "",
      };

      // Only include context if HCP is set
      const queryWithContext = form.hcp
        ? `[CONTEXT] ${JSON.stringify(context)} [/CONTEXT]\n${userText}`
        : userText;

      const res = await axios.post(`${API}/chat`, {
        query: queryWithContext,
      });

      const data = res.data?.data || {};
      const type = data.type;

      if (type === "fill") {
        dispatch(fillForm(data));
        dispatch(addMessage({ role: "ai", text: buildFillMessage(data) }));

      } else if (type === "edit") {
        // ✅ Edit — show message, also update form field if possible
        dispatch(addMessage({
          role: "ai",
          text: data.message || "✅ Interaction updated.",
        }));

        // Refresh the form field that was edited from the message
        if (data.field && data.new_value) {
          dispatch(fillForm({ [data.field]: data.new_value }));
        }

      } else if (type === "search") {
        dispatch(addMessage({
          role: "ai",
          text: data.message || "No information found.",
        }));

      } else {
        dispatch(fillForm(data));
        dispatch(addMessage({
          role: "ai",
          text: data.message || buildFillMessage(data),
        }));
      }

    } catch {
      dispatch(setError("Failed to fetch AI response"));
      dispatch(addMessage({
        role: "ai",
        text: "❌ Error occurred. Please try again.",
      }));
    }

    dispatch(setLoading(false));
  };

  const buildFillMessage = (data) => {
    const parts = [];
    if (data.hcp_name)  parts.push(`👤 HCP: ${data.hcp_name}`);
    if (data.summary)   parts.push(`📋 Summary: ${data.summary}`);
    if (data.sentiment) parts.push(`💬 Sentiment: ${data.sentiment}`);
    if (data.outcomes)  parts.push(`✅ Outcomes: ${data.outcomes}`);
    if (data.follow_up) parts.push(`📌 Follow-up: ${data.follow_up}`);
    if (data.time)      parts.push(`🕐 Time: ${data.time}`);
    if (parts.length === 0) return "Form updated with interaction details.";
    return parts.join("\n") + "\n\n✅ Form filled automatically!";
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>🤖</div>
        <div>
          <div style={styles.headerTitle}>AI Assistant</div>
          <div style={styles.headerSub}>Log Interaction via chat</div>
        </div>
      </div>

      <ChatWindow />

      <div style={styles.inputRow}>
        <input
          placeholder='Try: "change time to 3pm" or "tell me about Dr Smith"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.logBtn}>
          <span style={styles.logIcon}>▲</span> Log
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff", borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    fontFamily: "'Inter', sans-serif", display: "flex",
    flexDirection: "column", height: "100%", minHeight: "500px",
    overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "16px 20px", borderBottom: "1px solid #f0f0f0",
  },
  headerIcon: { fontSize: "22px", lineHeight: 1 },
  headerTitle: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  headerSub: { fontSize: "11.5px", color: "#9ca3af", marginTop: "1px" },
  chatWindow: {
    flex: 1, overflowY: "auto", padding: "16px 20px",
    display: "flex", flexDirection: "column", gap: "10px", minHeight: "300px",
  },
  placeholder: {
    fontSize: "13px", color: "#9ca3af", lineHeight: "1.6", margin: 0,
    padding: "10px", background: "#f9fafb", borderRadius: "8px",
    border: "1px solid #f0f0f0",
  },
  bubble: {
    padding: "8px 12px", borderRadius: "8px", fontSize: "13px",
    lineHeight: "1.6", display: "flex", flexDirection: "column",
    gap: "4px", maxWidth: "92%", whiteSpace: "pre-wrap",
  },
  userBubble: {
    background: "#eff6ff", border: "1px solid #bfdbfe", alignSelf: "flex-end",
  },
  aiBubble: {
    background: "#f0fdf4", border: "1px solid #bbf7d0", alignSelf: "flex-start",
  },
  bubbleRole: {
    fontSize: "11px", fontWeight: "600", color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.04em",
  },
  bubbleText: { color: "#111827" },
  loadingRow: {
    display: "flex", gap: "5px", padding: "8px 12px", alignSelf: "flex-start",
  },
  dot: {
    width: "7px", height: "7px", borderRadius: "50%",
    background: "#9ca3af", display: "inline-block",
  },
  inputRow: {
    display: "flex", gap: "8px", padding: "14px 20px",
    borderTop: "1px solid #f0f0f0", alignItems: "center",
  },
  input: {
    flex: 1, padding: "9px 12px", border: "1px solid #e5e7eb",
    borderRadius: "7px", fontSize: "13px", fontFamily: "'Inter', sans-serif",
    color: "#111827", outline: "none", background: "#fff",
  },
  logBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "9px 16px", background: "#1f2937", color: "#fff",
    border: "none", borderRadius: "7px", fontSize: "13px",
    fontFamily: "'Inter', sans-serif", fontWeight: "600",
    cursor: "pointer", whiteSpace: "nowrap",
  },
  logIcon: { fontSize: "10px" },
};
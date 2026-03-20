import { useDispatch, useSelector } from "react-redux";
import { patchForm, clearForm } from "../features/interactions/interactionSlice";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function InteractionForm() {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.interaction.form);
  const suggestedFollowups = useSelector(
    (state) => state.interaction.suggestedFollowups
  );

  // ✅ Only patches the single field that changed
  const handleChange = (e) => {
    dispatch(patchForm({ name: e.target.name, value: e.target.value }));
  };

  // ✅ Clicking a suggestion appends ONLY to followup field
  const handleSuggestionClick = (suggestion) => {
    const current = form.followup || "";
    const updated = current
      ? `${current}\n• ${suggestion}`
      : `• ${suggestion}`;
    dispatch(patchForm({ name: "followup", value: updated }));
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API}/interactions`, {
        hcp_name:         form.hcp,
        interaction_type: form.interactionType || "Meeting",
        summary:          form.topics || form.summary,
        sentiment:        form.sentiment,
        follow_up:        form.followup,
        date:             form.date,
        time:             form.time,
        attendees:        form.attendees,
        outcomes:         form.outcomes,
      });
      alert("✅ Interaction saved successfully!");
      dispatch(clearForm());
    } catch (err) {
      alert("❌ Failed to save. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Log HCP Interaction</h2>

      {/* Interaction Details */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Interaction Details</div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>HCP Name</label>
            <input
              name="hcp"
              value={form.hcp || ""}
              placeholder="Search or select HCP..."
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Interaction Type</label>
            <div style={styles.selectWrapper}>
              <select
                name="interactionType"
                value={form.interactionType || "Meeting"}
                onChange={handleChange}
                style={styles.select}
              >
                <option>Meeting</option>
                <option>Call</option>
                <option>Email</option>
                <option>Conference</option>
              </select>
              <span style={styles.selectArrow}>▾</span>
            </div>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={form.date || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Time</label>
            <input
              type="time"
              name="time"
              value={form.time || ""}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Attendees</label>
          <input
            name="attendees"
            value={form.attendees || ""}
            placeholder="Enter names or search..."
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Topics Discussed</label>
          <textarea
            name="topics"
            value={form.topics || ""}
            placeholder="Enter key discussion points..."
            onChange={handleChange}
            style={{ ...styles.textarea, minHeight: "90px" }}
          />
        </div>

        <button style={styles.voiceBtn}>
          <span style={styles.voiceIcon}>✦</span>
          Summarize from Voice Note (Requires Consent)
        </button>
      </div>

      {/* Materials */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Materials Shared / Samples Distributed</div>
        <div style={styles.materialsBox}>
          <div style={styles.materialsRow}>
            <span style={styles.materialsTitle}>Materials Shared</span>
            <button style={styles.addBtn}>🔍 Search/Add</button>
          </div>
          <p style={styles.emptyText}>No materials added.</p>
        </div>
        <div style={{ ...styles.materialsBox, marginTop: "10px" }}>
          <div style={styles.materialsRow}>
            <span style={styles.materialsTitle}>Samples Distributed</span>
            <button style={styles.addBtn}>⊕ Add Sample</button>
          </div>
          <p style={styles.emptyText}>No samples added.</p>
        </div>
      </div>

      {/* Sentiment */}
      <div style={styles.section}>
        <div style={styles.sectionLabel}>Observed/Inferred HCP Sentiment</div>
        <div style={styles.sentimentRow}>
          {["Positive", "Neutral", "Negative"].map((s) => (
            <label key={s} style={styles.radioLabel}>
              <input
                type="radio"
                name="sentiment"
                value={s}
                checked={form.sentiment === s}
                onChange={handleChange}
                style={styles.radio}
              />
              <span style={{
                ...styles.radioText,
                color: s === "Positive" ? "#16a34a" : s === "Negative" ? "#dc2626" : "#d97706",
              }}>
                {s === "Positive" ? "😊" : s === "Neutral" ? "😐" : "😞"} {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Outcomes & Follow-up */}
      <div style={styles.section}>
        <div style={styles.fieldFull}>
          <label style={styles.label}>
            Outcomes
            <span style={styles.aiTag}>✦ AI Generated</span>
          </label>
          <textarea
            name="outcomes"
            value={form.outcomes || ""}
            placeholder="AI will fill this after you log an interaction..."
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>
            Follow-up Actions
            <span style={styles.aiTag}>✦ Click suggestions below to add</span>
          </label>
          <textarea
            name="followup"
            value={form.followup || ""}
            placeholder="Click AI suggestions below or type manually..."
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>
      </div>

      {/* ✅ Clickable AI suggestions */}
      <div style={styles.aiSuggestions}>
        <p style={styles.aiSuggestTitle}>
          🤖 AI Suggested Follow-ups
          <span style={styles.aiSuggestHint}> — click to add to Follow-up Actions</span>
        </p>

        {suggestedFollowups && suggestedFollowups.length > 0 ? (
          <div style={styles.chipRow}>
            {suggestedFollowups.map((s, i) => (
              <button
                key={i}
                style={styles.chip}
                onClick={() => handleSuggestionClick(s)}
                title="Click to add to Follow-up Actions"
              >
                + {s}
              </button>
            ))}
          </div>
        ) : (
          <p style={styles.aiItemDisabled}>
            💬 Describe an interaction in the AI Assistant to get smart suggestions...
          </p>
        )}
      </div>

      <button style={styles.saveBtn} onClick={handleSave}>
        Save Interaction
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff", borderRadius: "12px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
    padding: "28px 32px", fontFamily: "'Inter', sans-serif",
  },
  title: { fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 22px 0" },
  section: { marginBottom: "22px", paddingBottom: "22px", borderBottom: "1px solid #f0f0f0" },
  sectionLabel: {
    fontSize: "11.5px", fontWeight: "600", color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px",
  },
  row: { display: "flex", gap: "16px", marginBottom: "14px" },
  field: { flex: 1, display: "flex", flexDirection: "column", gap: "5px" },
  fieldFull: { display: "flex", flexDirection: "column", gap: "5px", marginBottom: "14px" },
  label: { fontSize: "12.5px", fontWeight: "500", color: "#374151", display: "flex", alignItems: "center", gap: "6px" },
  aiTag: { fontSize: "11px", color: "#6366f1", fontWeight: "400" },
  input: {
    padding: "8px 11px", border: "1px solid #e5e7eb", borderRadius: "7px",
    fontSize: "13px", color: "#111827", outline: "none",
    fontFamily: "'Inter', sans-serif", background: "#fff",
    width: "100%", boxSizing: "border-box",
  },
  textarea: {
    padding: "8px 11px", border: "1px solid #e5e7eb", borderRadius: "7px",
    fontSize: "13px", color: "#111827", outline: "none",
    fontFamily: "'Inter', sans-serif", resize: "vertical", minHeight: "70px",
    width: "100%", boxSizing: "border-box", lineHeight: "1.5",
  },
  selectWrapper: { position: "relative" },
  select: {
    padding: "8px 32px 8px 11px", border: "1px solid #e5e7eb", borderRadius: "7px",
    fontSize: "13px", color: "#111827", fontFamily: "'Inter', sans-serif",
    background: "#fff", width: "100%", appearance: "none", outline: "none", cursor: "pointer",
  },
  selectArrow: {
    position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
    pointerEvents: "none", color: "#6b7280", fontSize: "13px",
  },
  voiceBtn: {
    display: "flex", alignItems: "center", gap: "7px", padding: "7px 14px",
    border: "1px solid #e5e7eb", borderRadius: "7px", background: "#f9fafb",
    fontSize: "12.5px", fontFamily: "'Inter', sans-serif", color: "#374151",
    cursor: "pointer", fontWeight: "500",
  },
  voiceIcon: { color: "#6366f1", fontSize: "13px" },
  materialsBox: { border: "1px solid #e5e7eb", borderRadius: "8px", padding: "11px 14px" },
  materialsRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  materialsTitle: { fontSize: "12.5px", fontWeight: "500", color: "#374151" },
  addBtn: {
    padding: "5px 11px", border: "1px solid #e5e7eb", borderRadius: "6px",
    background: "#fff", fontSize: "12px", fontFamily: "'Inter', sans-serif",
    color: "#374151", cursor: "pointer", fontWeight: "500",
  },
  emptyText: { fontSize: "12px", color: "#9ca3af", fontStyle: "italic", margin: 0 },
  sentimentRow: { display: "flex", gap: "24px", flexWrap: "wrap" },
  radioLabel: { display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" },
  radio: { accentColor: "#6366f1", width: "15px", height: "15px" },
  radioText: { fontSize: "13px", fontWeight: "500" },
  aiSuggestions: {
    background: "#f0f9ff", border: "1px solid #bae6fd",
    borderRadius: "8px", padding: "14px 16px", marginBottom: "20px",
  },
  aiSuggestTitle: { fontSize: "12px", fontWeight: "600", color: "#0369a1", margin: "0 0 10px 0" },
  aiSuggestHint: { fontWeight: "400", color: "#7dd3fc" },
  chipRow: { display: "flex", flexDirection: "column", gap: "6px" },
  chip: {
    textAlign: "left", padding: "7px 12px", background: "#fff",
    border: "1px solid #bae6fd", borderRadius: "7px", fontSize: "12.5px",
    color: "#0369a1", cursor: "pointer", fontFamily: "'Inter', sans-serif",
    fontWeight: "500", transition: "background 0.15s",
  },
  aiItemDisabled: { fontSize: "12.5px", color: "#94a3b8", fontStyle: "italic", margin: 0 },
  saveBtn: {
    width: "100%", padding: "11px", background: "#4f46e5", color: "#fff",
    border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
    fontFamily: "'Inter', sans-serif", cursor: "pointer", letterSpacing: "0.01em",
  },
};
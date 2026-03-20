import InteractionForm from "../components/InteractionForm";
import AIAssistant from "../components/AIAssistant";

export default function Dashboard() {
  return (
    <>
      {/* Google Inter font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={styles.page}>
        <div style={styles.container}>
          {/* Left - Form */}
          <div style={styles.left}>
            <InteractionForm />
          </div>

          {/* Right - AI Assistant */}
          <div style={styles.right}>
            <AIAssistant />
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
  },
  container: {
    display: "flex",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    alignItems: "flex-start",
  },
  left: {
    flex: "0 0 62%",
  },
  right: {
    flex: "0 0 36%",
    position: "sticky",
    top: "24px",
  },
};

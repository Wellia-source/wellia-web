const BACKEND_URL = "https://wellia-backend.onrender.com";

function App() {
  const [email, setEmail] = React.useState("");
  const [plan, setPlan] = React.useState(null);
  const [status, setStatus] = React.useState("");

  const subscribe = async () => {
    setStatus("Opening checkout...");
    try {
      if (!email || !email.includes("@")) {
        setStatus("Error: Please enter a valid email.");
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      // Read as text first so we can show *anything* that comes back
      const text = await res.text();
      let data = {};
      try { data = JSON.parse(text); } catch {}

      // Show the backend response (this will reveal the Stripe error)
      if (!res.ok) {
        setStatus(`HTTP ${res.status}: ${data.error || text || "Unknown error"}`);
        return;
      }

      if (!data.url) {
        setStatus(`HTTP ${res.status}: No url. Response: ${text}`);
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      setStatus("Error: " + e.message);
    }
  };

  const getPlan = async () => {
    setStatus("Getting your AI plan...");
    try {
      const res = await fetch(`${BACKEND_URL}/api/ai-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals: "stress + weight loss" })
      });
      const data = await res.json();
      setPlan(data);
      setStatus("");
    } catch (e) {
      setStatus("Error: " + e.message);
    }
  };

  return React.createElement(
    "div",
    { style: { fontFamily: "Arial", padding: 30, maxWidth: 520, margin: "0 auto" } },
    React.createElement("h1", null, "Wellia"),
    React.createElement("p", null, "Your AI-powered wellness companion"),
    React.createElement("label", null, "Email"),
    React.createElement("input", {
      value: email,
      onChange: (e) => setEmail(e.target.value),
      placeholder: "you@email.com",
      style: { width: "100%", padding: 10, fontSize: 16, marginTop: 6 }
    }),
    React.createElement(
      "div",
      { style: { marginTop: 14, display: "flex", gap: 10 } },
      React.createElement("button", { onClick: subscribe, style: { padding: "10px 14px", fontSize: 16 } }, "Go Premium"),
      React.createElement("button", { onClick: getPlan, style: { padding: "10px 14px", fontSize: 16 } }, "Get AI Plan")
    ),
    status ? React.createElement("p", { style: { marginTop: 12, whiteSpace: "pre-wrap" } }, status) : null,
    plan
      ? React.createElement(
          "pre",
          { style: { marginTop: 14, background: "#f3f3f3", padding: 12, overflowX: "auto" } },
          JSON.stringify(plan, null, 2)
        )
      : null
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));


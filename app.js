const subscribe = async () => {
  setStatus("Opening checkout...");
  try {
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email.");
    }

    const res = await fetch(`${BACKEND_URL}/api/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch {}

    // 🔎 show exactly what came back
    setStatus(`HTTP ${res.status}: ${text}`);

    // if a url exists, go there
    if (data && data.url) {
      window.location.href = data.url;
    }
  } catch (e) {
    setStatus("Error: " + e.message);
  }
};


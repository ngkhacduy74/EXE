import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test") // Calls the backend
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>React & Node.js Connection Test</h1>
      <p>{message || "Waiting for backend response..."}</p>
    </div>
  );
}

export default App;

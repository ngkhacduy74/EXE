import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from "./Admin/AdminPage";

const App = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <Router>
      <div>
        <h1>React & Node.js Connection Test</h1>
        <p>{message || "Waiting for backend response..."}</p>
        <Routes>
          <Route path="/" element={<h2>Welcome! Use /admin to go to the Admin Page.</h2>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import TripPlanner from "./components/TripPlanner";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme";
  }, [theme]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <h1>🚛 Truck Route Planner</h1>
        {/* <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          style={{
            padding: "0.25rem 0.5rem", // 🔽 smaller padding
            fontSize: "0.8rem",
            marginTop: "2.7rem",
            height: "2rem", // 🔽 smaller height
            border: "1px solid gray",
            borderRadius: "8px",
            cursor: "pointer",
            background: theme === "dark" ? "#333" : "#f0f0f0",
            color: theme === "dark" ? "#fff" : "#000",
            
          }}
        >
          {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button> */}
      </header>

      <TripPlanner />
    </div>
  );
}

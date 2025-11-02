// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";  // ← This loads the Showmax theme
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(
    AuthProvider,
    null,
    React.createElement(App)
  )
);
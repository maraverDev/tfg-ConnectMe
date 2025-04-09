import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom"; // Importamos el Router

const root = ReactDOM.createRoot(document.getElementById("root"));

// Envuelve todo el App en BrowserRouter
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/admin/global-responsive.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

window.addEventListener("error", (e) => {
  document.body.innerHTML += `<pre style="color:red;position:fixed;top:0;left:0;z-index:9999;background:white;padding:20px">${e.message}\n${e.filename}:${e.lineno}</pre>`;
});
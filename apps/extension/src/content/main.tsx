import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Import CSS as string (adjust the import if using Vite or Webpack)
import appCss from "./views/App.css?inline"; // Vite: ?inline or ?raw
import App from "./views/App.tsx";

console.log("[CRXJS] Hello world from content script!");

/* -------------------------------------------------------------------------------------------------------- */
/*                                                Old Method                                                */
/* -------------------------------------------------------------------------------------------------------- */
// import "./views/App.css"; // Vite: ?inline or ?raw
// const container = document.createElement("div");
// container.id = "crxjs-app";
// document.body.appendChild(container);
// createRoot(container).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );

/* -------------------------------------------------------------------------------------------------------- */
/*                                                New Method                                                */
/* -------------------------------------------------------------------------------------------------------- */
const container = document.createElement("div");
container.id = "bookmark-app";
const shadowRoot = container.attachShadow({ mode: "open" });
document.body.appendChild(container);

// Inject CSS as <style> tag
const styleTag = document.createElement("style");
styleTag.textContent = appCss;
shadowRoot.appendChild(styleTag);

const appRoot = document.createElement("div");
shadowRoot.appendChild(appRoot);

createRoot(appRoot).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

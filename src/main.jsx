import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Survey from "./Survey.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Survey />
  </StrictMode>
);

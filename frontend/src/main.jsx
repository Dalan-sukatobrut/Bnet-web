// StrictMode removed to fix UNSAFE_componentWillMount warning
// (no class components in codebase, likely from deps like react-router-hash-link)
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);

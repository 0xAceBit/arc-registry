import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const isWalletExtensionError = (value: unknown) => {
  const text = value instanceof Error ? `${value.message}\n${value.stack ?? ""}` : String(value ?? "");
  return (
    text.includes("chrome-extension://fiikommddbeccaoicoejoniammnalkfa") ||
    text.includes("Invalid property descriptor") ||
    text.includes("Cannot redefine property: ethereum") ||
    text.includes("Cannot set property ethereum")
  );
};

window.addEventListener(
  "error",
  (event) => {
    if (isWalletExtensionError(event.error) || isWalletExtensionError(event.message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

window.addEventListener(
  "unhandledrejection",
  (event) => {
    if (isWalletExtensionError(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },
  true,
);

createRoot(document.getElementById("root")!).render(<App />);

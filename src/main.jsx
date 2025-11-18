import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";

async function bootstrap() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import("./mocks/browser");
      // start and wait for the service worker registration
      await worker.start({ onUnhandledRequest: "bypass" });
      console.log("MSW worker started");
    } catch (err) {
      console.error("Failed to start MSW", err);
    }
  }

  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <CartProvider>
          <App />
        </CartProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();

import { createRoot } from "react-dom/client";
import "./styles/index.css";
import "./styles/loginregister.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = createRoot(document.getElementById("root"));

const client = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

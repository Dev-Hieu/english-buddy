import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { applyTheme, getThemeId } from "@/components/ui/theme";
import "./styles.css";

applyTheme(getThemeId()); // áp dụng màu đã chọn trước khi render

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

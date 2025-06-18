import { ListenToFigma } from "@common/messages";
import React from "react";
import ReactDOM from "react-dom/client";

async function bootstrap() {
  const App = (await import("./app")).default;
  
  const rootElement = document.getElementById("root") as HTMLElement;
  const root = ReactDOM.createRoot(rootElement);
  
  onmessage = (e: MessageEvent) => ListenToFigma(e);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();

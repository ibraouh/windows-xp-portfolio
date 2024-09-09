import "./index.css";
import WindowsXP from "./components/WindowsXP.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function App() {
  return (
    <div className="App">
      <WindowsXP />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;

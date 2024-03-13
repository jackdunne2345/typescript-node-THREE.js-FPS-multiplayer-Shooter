import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import Game from "./game/Game.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

Game.GameState();

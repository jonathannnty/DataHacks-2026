import { Route, Routes } from "react-router-dom";
import { GameScreen } from "./features/game/GameScreen";
import { ActionCenter } from "./features/action-center/ActionCenter";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<GameScreen />} />
      <Route path="/action" element={<ActionCenter />} />
      <Route path="*" element={<GameScreen />} />
    </Routes>
  );
}

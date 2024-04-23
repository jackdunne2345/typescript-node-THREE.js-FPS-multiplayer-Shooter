import Styles from "../styles/Pause_style.module.scss";
import game from "../game/Game";
import { useEffect, useState } from "react";
import { Settings } from "./Settings";

type prop = {
  setPause: React.Dispatch<React.SetStateAction<boolean>>;
  setHome: React.Dispatch<React.SetStateAction<string>>;
};
export const Pause = (p: prop) => {
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const handleReturnBack = () => {
    setShowSettings(false);
  };
  useEffect(() => {
    setTimeout(() => {
      console.log;
      setShowButton(true);
    }, 1000);
  }, [showButton]);

  return (
    <div className={Styles.pauseDiv}>
      {showSettings ? (
        <Settings Return={handleReturnBack}></Settings>
      ) : (
        showButton && (
          <div>
            {" "}
            <button
              onClick={() => {
                game.ToggleControlls();
              }}
            >
              Resume
            </button>
            <button
              onClick={() => {
                setShowButton(false);
                setShowSettings(true);
              }}
            >
              Settings
            </button>{" "}
            <button
              onClick={() => {
                game.LeaveLobby();
                game.Start();
                p.setPause(false);
                p.setHome("home");
              }}
            >
              Leave game
            </button>
          </div>
        )
      )}
    </div>
  );
};

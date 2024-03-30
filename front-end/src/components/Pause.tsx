import Styles from "../styles/Pause_style.module.scss";
import game from "../game/Game";
import { useEffect, useState } from "react";

export const Pause = () => {
  const [showButton, setShowButton] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      console.log;
      setShowButton(true);
    }, 1000);
  }, [showButton]);

  return (
    <div className={Styles.pauseDiv}>
      {showButton && (
        <div>
          {" "}
          <button
            onClick={() => {
              game.ToggleControlls();
            }}
          >
            Resume
          </button>
          <button>Settings</button> <button>Leave game</button>
        </div>
      )}
    </div>
  );
};

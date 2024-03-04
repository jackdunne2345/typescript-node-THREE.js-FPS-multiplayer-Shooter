import "bootstrap/dist/css/bootstrap.css";
import Styles from "../Styles.module.scss";
import game from "../game/Game.ts";

import { useEffect, useState, useSyncExternalStore } from "react";
interface Props {
  back: (string: string) => void;
}

const Host: React.FC<Props> = ({ back }) => {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const lobby = useSyncExternalStore(
    game.LOBBY_STORE.subscribe,
    game.LOBBY_STORE.getSnapShot
  );
  useEffect(() => {
    console.log("i fire once");
    const createLobby = async () => {
      let lobbyId = await game.CreateLobby();
      setLobbyId(lobbyId);
    };
    if (!lobbyId) {
      createLobby();
    }
  }, []);

  return (
    <div className={Styles.Host}>
      <button
        onClick={() => {
          game.LeaveLobby();
          game.LOBBY_STORE.emptyLobby();
          back("home");
        }}
      >
        Back
      </button>
      Join Code: {lobbyId}
      <p>Players</p>
      <ul className="list-group">
        {lobby.map((player, index) => (
          <li key={index} className="list-group-item">
            {player.name}
          </li>
        ))}
      </ul>
      <button>Start Game</button>
    </div>
  );
};
export default Host;

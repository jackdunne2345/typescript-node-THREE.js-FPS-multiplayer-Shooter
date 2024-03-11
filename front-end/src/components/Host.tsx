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
      console.log("use effect lobby length" + lobby.length);
    }
  }, []);

  return (
    <div className={Styles.host}>
      <div className={Styles.lobbyTop}>
        <button
          onClick={() => {
            game.LeaveLobby();
            game.LOBBY_STORE.emptyLobby();
            back("home");
          }}
        >
          Back
        </button>
        <p> Join Code: {lobbyId}</p>
      </div>
      <div className={Styles.lobbyMid}>
        <p>Players</p>
        <div>
          <ul className="list-group">
            {lobby.map((player, index) => {
              if (index % 2 == 0)
                return (
                  <li key={player.name} className="list-group-item">
                    {player.name}
                  </li>
                );
            })}{" "}
            {lobby.length < 5 &&
              new Array(5 - lobby.length)
                .fill(null)
                .map((index) => (
                  <li key={index} className="list-group-item"></li>
                ))}
          </ul>
          <ul className="list-group">
            {lobby.map((player, index) => {
              if (index % 2 > 0)
                return (
                  <li key={player.name} className="list-group-item">
                    {player.name}
                  </li>
                );
            })}{" "}
            {lobby.length < 10 &&
              new Array(5 - Math.floor(lobby.length / 2))
                .fill(null)
                .map((index) => (
                  <li key={index + 11} className="list-group-item"></li>
                ))}
          </ul>
        </div>
      </div>
      <div className={Styles.lobbyBtm}>
        <button>Start Game</button>
      </div>
    </div>
  );
};
export default Host;

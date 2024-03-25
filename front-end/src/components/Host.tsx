import "bootstrap/dist/css/bootstrap.css";
import Styles from "../styles/Host_style.module.scss";
import game, { PlayerInterface } from "../game/Game.ts";

import { useEffect } from "react";
interface Props {
  back: (string: string) => void;
  hide: () => void;
  lobbyId: string | null;
  lobby: PlayerInterface[];
}

const Host: React.FC<Props> = ({ back, hide, lobbyId, lobby }) => {
  useEffect(() => {}, []);

  return (
    <div className={Styles.host}>
      <div className={Styles.lobbyTop}>
        <button
          onClick={() => {
            game.LeaveLobby();
            game.LOBBY.LOBBY_STORE.EmptyLobby();
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
              new Array(5 - Math.ceil(lobby.length / 2))
                .fill("")
                .map((_, index) => (
                  <li key={`empty-${index}ye`} className="list-group-item"></li>
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
                .map((_, index) => (
                  <li key={`empty-${index}`} className="list-group-item"></li>
                ))}
          </ul>
        </div>
      </div>
      <div className={Styles.lobbyBtm}>
        <button
          onClick={() => {
            game.Start();
            hide();
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};
export default Host;

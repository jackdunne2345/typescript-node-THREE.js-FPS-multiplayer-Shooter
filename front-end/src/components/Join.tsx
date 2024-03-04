import "bootstrap/dist/css/bootstrap.css";
import Styles from "../Styles.module.scss";
import game from "../game/Game.ts";
import { useEffect, useState, useSyncExternalStore } from "react";
interface Props {
  back: (string: string) => void;
  Id: string;
}

const Join: React.FC<Props> = ({ back, Id }) => {
  const [lobbyId, setLobbyId] = useState<string | null>(Id);
  const [error, setError] = useState<string | null>(null);
  const lobby = useSyncExternalStore(
    game.LOBBY_STORE.subscribe,
    game.LOBBY_STORE.getSnapShot
  );

  useEffect(() => {
    setLobbyId(Id);
    console.log("react useeffect join comp lobby id=" + lobbyId);
    console.log("i fire once");
    const joinLobby = async () => {
      await game.JoinLobby(lobbyId!);
    };
    if (Id) {
      joinLobby();
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
        {" "}
        {lobby.map((player) => (
          <li className="list-group-item">{player.name}</li>
        ))}
      </ul>
      <button>Start Game</button>
    </div>
  );
};
export default Join;

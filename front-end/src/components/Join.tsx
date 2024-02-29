import "bootstrap/dist/css/bootstrap.css";
import Styles from "../Styles.module.scss";
import game from "../game/Game.ts";
import { useEffect, useState } from "react";
interface Props {
  back: (string: string) => void;
  lobby: string;
}

const Join: React.FC<Props> = ({ back, lobby }) => {
  const [lobbyId, setLobbyId] = useState<string | null>(lobby);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLobbyId(lobby);
    console.log("react useeffect join comp lobby id=" + lobbyId);
    console.log("i fire once");
    const joinLobby = async () => {
      await game.JoinLobby(lobbyId!);
    };
    if (lobby) {
      joinLobby();
    }
  }, []);

  return (
    <div className={Styles.Host}>
      <button
        onClick={() => {
          game.LeaveLobby();
          back("home");
        }}
      >
        Back
      </button>
      Join Code: {lobbyId}
      <p>Players</p>
      <ul className="list-group">
        {" "}
        {game.LOBBY.map((player) => (
          <li className="list-group-item">{player.name}</li>
        ))}
      </ul>
      <button>Start Game</button>
    </div>
  );
};
export default Join;

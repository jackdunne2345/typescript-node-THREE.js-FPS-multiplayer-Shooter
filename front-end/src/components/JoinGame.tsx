import Peer from "peerjs";
import { ChangeEvent, useState } from "react";
import FadeIn from "react-fade-in";

export default function JoinGame() {
  const [inputValue, setInputValue] = useState("");
  const [showLobby, setShowLobby] = useState(false);

  const [players, setPlayers] = useState<PlayerMap[]>();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  function conn() {
    const peer = new Peer();
    peer.on("open", () => {
      console.log("your id is " + peer.id);
      const conn = peer.connect(inputValue);
      conn.on("open", () => {
        let map: PlayerMap[] = [{ playerName: "player3", playerId: peer.id }];

        conn.send(JSON.stringify(map));
      });
      conn.on("data", (data) => {
        console.log("the data came in" + data);
        let parsedPlayers = JSON.parse(data as string);

        if (Array.isArray(parsedPlayers)) {
          // Assuming parsedPlayers is an array of PlayerMap objects
          setPlayers(parsedPlayers);
        } else {
          console.error("Parsed data is not in the expected format.");
        }
      });
    });

    console.log("connecting to : " + inputValue);
  }

  return (
    <>
      {showLobby ? (
        <div>
          <ul className="list-group">
            {players?.map((player) => (
              //EVERYTHING NEEDS A UNIQUE KEY
              <li key={player.playerId} className="list-group-item">
                {player.playerName}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <FadeIn>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1%",
            }}
          >
            <input
              onChange={handleInputChange}
              style={{ textAlign: "center" }}
              placeholder="Enter game code"
              type="text"
              className="form-control"
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
            <FadeIn>
              <button className="btn btn-success" onClick={conn}>
                Join
              </button>
            </FadeIn>
          </div>
        </FadeIn>
      )}
    </>
  );
}

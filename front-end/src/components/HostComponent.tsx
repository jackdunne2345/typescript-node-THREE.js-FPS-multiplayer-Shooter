import FadeIn from "react-fade-in";
import { useEffect, useState } from "react";
import { Peer } from "peerjs";
import styles from "../Styles.module.css";
import { PlayerMap } from "./type_interface";
export default function HostComponent() {
  const initialMap: PlayerMap[] = [{ playerName: "you", playerId: "id" }];
  const [players, setPlayers] = useState(initialMap);

  const [thePeer, setThePeer] = useState<Peer | null>(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", async (id) => {
      console.log("My peer ID is: " + id);

      const updatedArray = [...initialMap];
      updatedArray[0] = {
        ...updatedArray[0],
        playerId: await peer.id,
      };
      setPlayers(updatedArray);
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        console.log("the data came in" + data);
        let parsedPlayers = JSON.parse(data as string);

        if (Array.isArray(parsedPlayers)) {
          // Assuming parsedPlayers is an array of PlayerMap objects
          setPlayers([...players, ...parsedPlayers]);
        } else {
          console.error("Parsed data is not in the expected format.");
        }
        conn.send(JSON.stringify(players));
      });
    });

    setThePeer(peer);
    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <>
      <FadeIn>
        <div className={styles.headElement}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              border: "2px",
              borderColor: "red",
            }}
          >
            <p>Players {players.length + "/" + "4"}</p>
            {players.length === 0 && <p>No one here :(</p>}
            <ul className="list-group">
              {players.map((player) => (
                //EVERYTHING NEEDS A UNIQUE KEY
                <li key={player.playerId} className="list-group-item">
                  {player.playerName}
                </li>
              ))}
            </ul>

            <p>Game code: {thePeer?.id}</p>
          </div>
          <div className={styles.midleElement}>
            <button className={`btn btn-secondary `}>Start game</button>
          </div>
        </div>
      </FadeIn>
    </>
  );
}

import FadeIn from "react-fade-in";
import { useEffect, useState } from "react";
import { Peer } from "peerjs";
import styles from "../Styles.module.css";
export default function HostComponent() {
  let items: string[] = ["test1", "test1", "test1", "test1"];

  const [yourId, setYourID] = useState("");

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setYourID(id);
    });

    peer.on("connection", (conn) => {
      conn.on("data", (data) => {
        // Will print 'hi!'
        console.log(data);
      });
      conn.on("open", () => {
        conn.send("hello!");
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return (
    <FadeIn>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          border: "2px",
          borderColor: "red",
        }}
      >
        <h1>Players</h1>
        {items.length === 0 && <p>No one here :(</p>}
        <ul className="list-group">
          {items.map((item) => (
            //EVERYTHING NEEDS A UNIQUE KEY
            <li key={item} className="list-group-item">
              {item}
            </li>
          ))}
        </ul>

        <p>Game code: {yourId}</p>
        <button className={`btn btn-secondary ${styles.button}`}>
          Start game
        </button>
      </div>
    </FadeIn>
  );
}

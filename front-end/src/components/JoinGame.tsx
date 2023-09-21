import Peer from "peerjs";
import { ChangeEvent, useState } from "react";
import FadeIn from "react-fade-in";

export default function JoinGame() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  function conn() {
    const peer = new Peer();
    peer.on("open", () => {
      const conn = peer.connect(inputValue);
      conn.on("open", () => {
        conn.send("hello!");
      });
    });
    console.log("your id is " + peer.id);
    console.log("connecting to :" + inputValue);
  }

  return (
    <>
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
    </>
  );
}

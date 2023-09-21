import FadeIn from "react-fade-in";
import JoinGame from "./JoinGame";
import { useState } from "react";
import HostComponent from "./HostComponent";
import styles from "../Styles.module.css";
export default function JoinHost() {
  const [showHostCompnent, setShowHostComponent] = useState(false);

  const [showJoinTextEntry, setShowJoinTextEntry] = useState(false);

  const handleHostButtonClick = () => {
    setShowHostComponent(true);
    setShowJoinTextEntry(false);
  };

  const handleJoinButtonClick = () => {
    setShowJoinTextEntry(true);
    setShowHostComponent(false);
  };

  return (
    <FadeIn>
      <div className={styles.divContainerStyle}>
        <div className={styles.headElement}>
          {showHostCompnent ? (
            <HostComponent />
          ) : (
            <button
              className={`btn btn-secondary ${styles.button}`}
              style={{ width: "200px" }}
              onClick={handleHostButtonClick}
            >
              Host
            </button>
          )}
        </div>
        <div className={styles.midleElement}>
          {showJoinTextEntry ? (
            <JoinGame />
          ) : (
            <button
              className={`btn btn-secondary ${styles.button}`}
              onClick={handleJoinButtonClick}
            >
              Join
            </button>
          )}
        </div>
        <div className={styles.midleElement}>
          <button className={`btn btn-secondary ${styles.button}`}>
            Settings
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

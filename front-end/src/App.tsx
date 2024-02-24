import FadeIn from "react-fade-in";
import styles from "./Styles.module.scss";
import Host from "./components/Host";
import { useState } from "react";
interface Props {}
const App: React.FC<Props> = () => {
  const [isHosting, setHost] = useState(false);
  const handleHostClick = () => {
    setHost(!isHosting);
  };
  return (
    <>
      <div className={styles.title}>InstaGib</div>
      <div className={styles.container}>
        {isHosting ? (
          <FadeIn>
            {" "}
            <Host back={handleHostClick}></Host>
          </FadeIn>
        ) : (
          <div className={styles.buttons}>
            <button
              className={styles.pulse}
              id={styles.host}
              onClick={handleHostClick}
            >
              Host
            </button>
            <button className={styles.pulse} id={styles.join}>
              Join
            </button>
            <button className={styles.pulse} id={styles.setting}>
              Settings
            </button>
          </div>
        )}
      </div>
    </>
  );
};
export default App;

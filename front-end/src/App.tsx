import FadeIn from "react-fade-in";
import Styles from "./Styles.module.scss";
import Host from "./components/Host";
import { useState } from "react";
import Join from "./components/Join";
interface Props {}
const App: React.FC<Props> = () => {
  const [currentState, setCurrentState] = useState<string>("home");
  const [search, setSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleChangeState = (state: string) => {
    setCurrentState(state);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <>
      <div className={Styles.title}>InstaGib</div>
      <div className={Styles.container}>
        {currentState === "home" && (
          <div className={Styles.buttons}>
            <button
              className={Styles.pulse}
              id={Styles.hostButton}
              onClick={() => handleChangeState("host")}
            >
              Host
            </button>
            {search ? (
              <FadeIn>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Enter something..."
                ></input>
                <button onClick={() => handleChangeState("join")}>enter</button>
              </FadeIn>
            ) : (
              <button
                className={Styles.pulse}
                id={Styles.joinButton}
                onClick={() => setSearch(!search)}
              >
                Join
              </button>
            )}

            <button className={Styles.pulse} id={Styles.settingButton}>
              Settings
            </button>
          </div>
        )}
        {currentState === "host" && <Host back={handleChangeState} />}
        {currentState === "join" && (
          <Join back={handleChangeState} lobby={inputValue} />
        )}
        {/*  */}
      </div>
    </>
  );
};
export default App;

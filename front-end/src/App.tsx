import FadeIn from "react-fade-in";
import Styles from "./Styles.module.scss";
import Host from "./components/Host";
import { useEffect, useState } from "react";

interface Props {}
const App: React.FC<Props> = () => {
  const [currentState, setCurrentState] = useState<string>("home");
  const [search, setSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hide, sethide] = useState<boolean>(true);
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "0") {
      console.log("ughhhh");
      sethide(true);
    }
  };
  const handleChangeState = (state: string) => {
    setCurrentState(state);
  };
  const handleHideState = () => {
    sethide(!hide);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {hide && (
        <>
          <div className={Styles.title}>
            <p>InstaGib</p>
          </div>
          <div className={Styles.container}>
            {currentState === "home" && (
              <div className={Styles.home}>
                <button
                  className={Styles.pulse}
                  id={Styles.hostButton}
                  onClick={() => handleChangeState("host")}
                >
                  Host
                </button>
                {search ? (
                  <FadeIn>
                    <div
                      className={`${Styles.searchContainer} ${Styles.pulse}`}
                    >
                      <input
                        onChange={handleInputChange}
                        type="text"
                        className={Styles.searchInput}
                        id="countrySearch"
                        placeholder="Enter lobby code..."
                      />
                      <button
                        className={Styles.searchButton}
                        onClick={() => {
                          handleChangeState("join");
                        }}
                      >
                        <span className={Styles.buttonContent}>Search</span>
                      </button>
                    </div>
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
            {currentState === "host" && (
              <Host
                back={handleChangeState}
                leader={true}
                Id={null}
                hide={handleHideState}
              />
            )}
            {currentState === "join" && (
              <Host
                back={handleChangeState}
                leader={false}
                Id={inputValue}
                hide={handleHideState}
              />
            )}
            {/*  */}
          </div>
        </>
      )}
    </>
  );
};
export default App;

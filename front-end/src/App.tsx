import FadeIn from "react-fade-in";
import Styles from "./styles/Styles.module.scss";
import Host from "./components/Host";
import { useEffect, useState, useSyncExternalStore } from "react";
import game from "./game/Game";
import { join } from "path";
import { Pause } from "./components/Pause";

interface Props {}
const App: React.FC<Props> = () => {
  const createLobby = async () => {
    let lobbyId = await game.CreateLobby();
    setLobbyId(lobbyId);
  };
  const joinLobby = async (id: string) => {
    await game.JoinLobby(id!);
    setLobbyId(id);
  };
  const [currentState, setCurrentState] = useState<string>("home");

  const [showPause, setShowPause] = useState<boolean>(false);
  const [search, setSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hideMenu, setHideMenu] = useState<boolean>(true);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [inGame, setinGame] = useState<boolean>(false);
  const lobby = useSyncExternalStore(
    game.LOBBY.LOBBY_STORE.Subscribe,
    game.LOBBY.LOBBY_STORE.GetSnapShot
  );
  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Escape") {
      console.log("esc key pressed");
      handlePauseState();
    }
  };
  const handlePauseState = () => {
    setShowPause(!showPause);
  };
  const handleChangeState = (state: string) => {
    setCurrentState(state);
  };
  const handleHideState = () => {
    setHideMenu(!hideMenu);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={Styles.container}>
      {!hideMenu &&
        (showPause ? <Pause back={handlePauseState}></Pause> : <></>)}
      {hideMenu && (
        <>
          <div className={Styles.title}>
            <p>InstaGib</p>
          </div>
          <div className={Styles.containerBox}>
            {currentState === "home" && (
              <div className={Styles.home}>
                <button
                  className={Styles.pulse}
                  id={Styles.hostButton}
                  onClick={() => {
                    createLobby();
                    handleChangeState("gameLobby");
                  }}
                >
                  Host
                </button>
                {search ? (
                  <div className={`${Styles.searchContainer} ${Styles.pulse}`}>
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
                        joinLobby(inputValue);
                        handleChangeState("gameLobby");
                      }}
                    >
                      <span className={Styles.buttonContent}>Search</span>
                    </button>
                  </div>
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
            {currentState === "gameLobby" && (
              <Host
                back={handleChangeState}
                hide={handleHideState}
                lobbyId={lobbyId}
                lobby={lobby}
              />
            )}

            {/*  */}
          </div>
        </>
      )}
    </div>
  );
};
export default App;

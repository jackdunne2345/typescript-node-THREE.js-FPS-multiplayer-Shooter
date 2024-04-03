import Styles from "./styles/Styles.module.scss";
import Lobby from "./components/Lobby";
import { useState, useSyncExternalStore } from "react";
import game from "./game/Game";
import { gState } from "./game/State";
import { Pause } from "./components/Pause";
import { Settings } from "./components/Settings";

const App = () => {
  const createLobby = async () => {
    let lobbyId = await game.CreateLobby();
    setLobbyId(lobbyId);
  };
  const joinLobby = async (id: string) => {
    await game.JoinLobby(id!);
    setLobbyId(id);
  };
  const [currentState, setCurrentState] = useState<string>("home");

  const [search, setSearch] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [hideMenu, setHideMenu] = useState<boolean>(false);
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const pause = useSyncExternalStore(
    gState.PAUSE_STORE.Subscribe,
    gState.PAUSE_STORE.GetSnapShot
  );
  const lobby = useSyncExternalStore(
    gState.LOBBY_STORE.Subscribe,
    gState.LOBBY_STORE.GetSnapShot
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className={Styles.container}>
      {hideMenu && pause && (
        <Pause setPause={setHideMenu} setHome={setCurrentState}></Pause>
      )}
      {!hideMenu && (
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
                    setCurrentState("gameLobby");
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
                        setCurrentState("gameLobby");
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

                <button
                  onClick={() => setCurrentState("setting")}
                  className={Styles.pulse}
                  id={Styles.settingButton}
                >
                  Settings
                </button>
              </div>
            )}
            {currentState === "gameLobby" && (
              <Lobby
                back={(p: string) => {
                  setCurrentState(p);
                }}
                hide={() => {
                  setHideMenu(!hideMenu);
                }}
                lobbyId={lobbyId}
                lobby={lobby}
              />
            )}
            {currentState === "setting" && (
              <Settings
                Return={() => {
                  setCurrentState("home");
                }}
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

import Lobby from "./components/Lobby";
import { useState, useSyncExternalStore } from "react";
import game from "./game/Game";
import { gState } from "./game/State";
import { Pause } from "./components/Pause";
import { Settings } from "./components/Settings";
import { Login } from "./components/Login";
import { ServerError } from "./game/Types";
import { Alert } from "./components/Alerts";

const App = () => {
  const createLobby = async () => {
    try {
      await game.CreateLobby().then((e) => {
        console.log(`app component lobby id: ${e}`);
        if (typeof e === "string") {
          setLobbyId(e);
          setCurrentState("gameLobby");
        } else if (e.error) {
          setErrors([...errors, e]);
          console.log(`this is the errores : ${errors[0]}`);
        }
      });
    } catch (e: any) {
      setLobbyId(null);
      console.log("oh no we have an error: " + e);

      console.log(`1 this is the errores : ${e.message}}`);
    }
  };
  const joinLobby = async (id: string) => {
    try {
      await game.JoinLobby(id!).then(() => {
        setLobbyId(id!);
        setCurrentState("gameLobby");
      });
    } catch (e: any) {
      setLobbyId(null);
      console.log("oh no we have an error: " + e);
      const error: ServerError = { error: e.message };
      setErrors([...errors, error]);
    }
  };
  const [currentState, setCurrentState] = useState<string>("login");
  const [errors, setErrors] = useState<ServerError[]>([]);
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
    <>
      {errors.length > 0 ? (
        <Alert Alerts={errors} setAlerts={setErrors}></Alert>
      ) : (
        <></>
      )}
      {hideMenu && pause && (
        <Pause setPause={setHideMenu} setHome={setCurrentState}></Pause>
      )}
      {!hideMenu && (
        <>
          <div className="title">
            <p>InstaGib</p>
          </div>
          <div className="containerBox">
            {currentState === "login" && <Login back={setCurrentState}></Login>}
            {currentState === "home" && (
              <div className="home">
                <button
                  id="hostButton"
                  onClick={() => {
                    createLobby();
                  }}
                >
                  Host
                </button>
                {search ? (
                  <div className="searchContainer">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="searchInput"
                      id="countrySearch"
                      placeholder="Enter lobby code..."
                    />
                    <button
                      className="searchButton"
                      onClick={() => {
                        joinLobby(inputValue);
                      }}
                    >
                      <span className="buttonContent">Search</span>
                    </button>
                  </div>
                ) : (
                  <button id="joinButton" onClick={() => setSearch(!search)}>
                    Join
                  </button>
                )}

                <button
                  onClick={() => setCurrentState("setting")}
                  id="settingButton"
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
    </>
  );
};
export default App;

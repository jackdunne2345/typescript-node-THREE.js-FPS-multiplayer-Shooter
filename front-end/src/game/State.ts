import { PlayerProp, LobbyStore, PauseStore } from "./Types";

class GameState {
  private PAUSE_LISTENERS: (() => void)[];
  public PAUSE_STORE: PauseStore;
  private _PAUSE: boolean;
  public get PAUSE(): boolean {
    return this._PAUSE;
  }
  public set PAUSE(value: boolean) {
    this._PAUSE = value;
  }

  private _LOBBY_ID: string;
  public get LOBBY_ID(): string {
    return this._LOBBY_ID;
  }
  public set LOBBY_ID(value: string) {
    this._LOBBY_ID = value;
  }
  private _ROOM: PlayerProp[];
  public get ROOM(): PlayerProp[] {
    return this._ROOM;
  }

  private LOBBY_LISTENERS: (() => void)[];
  public LOBBY_STORE: LobbyStore;
  constructor() {
    //************/
    this.PAUSE_LISTENERS = [];
    this._PAUSE = true;
    this.PAUSE_STORE = {
      PAUSE: this._PAUSE,
      GetSnapShot: () => this._PAUSE,
      Subscribe: (listener: () => void): (() => void) => {
        this.PAUSE_LISTENERS = [...this.PAUSE_LISTENERS, listener];
        return (): void => {
          this.PAUSE_LISTENERS = this.PAUSE_LISTENERS.filter(
            (l) => l !== listener
          );
        };
      },
      SetPause: (t: boolean) => {
        this._PAUSE = t;
        emitChangePause.call(this);
      },
    };
    function emitChangePause(this: GameState) {
      for (let listener of this.PAUSE_LISTENERS) {
        listener();
      }
    }
    //*********** */
    this._LOBBY_ID = "";
    this._ROOM = [];
    this.LOBBY_LISTENERS = [];
    this.LOBBY_STORE = {
      AddToLobby: (player: PlayerProp) => {
        const newLob: PlayerProp[] = [...this.ROOM, player];
        this._ROOM = newLob;
        emitChange.call(this);
      },
      RemoveFromLobby: (id: number) => {
        const newLob: PlayerProp[] = this.ROOM.filter((element) => {
          if (element.id === id) {
            return false;
          }
          return true;
        });

        this._ROOM = newLob;
        emitChange.call(this);
        return id;
      },
      EmptyLobby: () => {
        const newLob: PlayerProp[] = [];
        this._ROOM = newLob;
        emitChange.call(this);
      },
      Subscribe: (listener: () => void): (() => void) => {
        this.LOBBY_LISTENERS = [...this.LOBBY_LISTENERS, listener];
        return (): void => {
          this.LOBBY_LISTENERS = this.LOBBY_LISTENERS.filter(
            (l) => l !== listener
          );
        };
      },
      GetSnapShot: () => this.ROOM,
      ROOM: this.ROOM,
    };
    function emitChange(this: GameState) {
      for (let listener of this.LOBBY_LISTENERS) {
        listener();
      }
    }
  }
}

export const gState = new GameState();

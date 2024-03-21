import { PlayerInterface } from "./Game";

interface LobbyStoreInterface {
  addToLobby(player: PlayerInterface): void;
  removeFromLobby(id: number): number;
  emptyLobby(): void;
  subscribe(listener: () => void): () => void;
  getSnapShot(): PlayerInterface[];
  ROOM: PlayerInterface[];
}

export default class Lobby {
  public ID: string | null;
  public ROOM: PlayerInterface[];
  private LOBBY_LISTENERS: (() => void)[];
  public LOBBY_STORE: LobbyStoreInterface;

  public PLAYER: PlayerInterface;

  constructor(player: PlayerInterface) {
    this.PLAYER = player;
    this.ID = null;
    this.ROOM = [];
    this.LOBBY_LISTENERS = [];
    this.LOBBY_STORE = {
      addToLobby: (player: PlayerInterface) => {
        const newLob: PlayerInterface[] = [...this.ROOM, player];
        this.ROOM = newLob;
        emitChange.call(this);
      },
      removeFromLobby: (id: number) => {
        const newLob: PlayerInterface[] = this.ROOM.filter((element) => {
          if (element.id === id) {
            player = element;

            return false;
          }
          return true;
        });

        this.ROOM = newLob;
        emitChange.call(this);
        return id;
      },
      emptyLobby: () => {
        const newLob: PlayerInterface[] = [];
        this.ROOM = newLob;
        emitChange.call(this);
      },
      subscribe: (listener: () => void): (() => void) => {
        this.LOBBY_LISTENERS = [...this.LOBBY_LISTENERS, listener];
        return (): void => {
          this.LOBBY_LISTENERS = this.LOBBY_LISTENERS.filter(
            (l) => l !== listener
          );
        };
      },
      getSnapShot: () => this.ROOM,
      ROOM: this.ROOM,
    };
    function emitChange(this: Lobby) {
      for (let listener of this.LOBBY_LISTENERS) {
        listener();
      }
    }
  }
}

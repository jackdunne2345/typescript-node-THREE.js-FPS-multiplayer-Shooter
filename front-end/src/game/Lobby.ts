import { PlayerInterface } from "./Game";

interface LobbyStoreInterface {
  AddToLobby(player: PlayerInterface): void;
  RemoveFromLobby(id: number): number;
  EmptyLobby(): void;
  Subscribe(listener: () => void): () => void;
  GetSnapShot(): PlayerInterface[];
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
      AddToLobby: (player: PlayerInterface) => {
        const newLob: PlayerInterface[] = [...this.ROOM, player];
        this.ROOM = newLob;
        emitChange.call(this);
      },
      RemoveFromLobby: (id: number) => {
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
      EmptyLobby: () => {
        const newLob: PlayerInterface[] = [];
        this.ROOM = newLob;
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
    function emitChange(this: Lobby) {
      for (let listener of this.LOBBY_LISTENERS) {
        listener();
      }
    }
  }
}

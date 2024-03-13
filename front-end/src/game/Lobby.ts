import axios from "axios";
import { PlayerInterface } from "./Game";
import { Socket, io } from "socket.io-client";

interface LobbyStoreInterface {
  addToLobby(player: PlayerInterface): void;
  removeFromLobby(id: number): void;
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
  private SERVER_URL = "http://localhost:3000";
  private SOCKET: Socket;
  private PLAYER: PlayerInterface;
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
        const newLob: PlayerInterface[] = this.ROOM.filter(
          (player) => player.id !== id
        );
        this.ROOM = newLob;
        emitChange.call(this);
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

    this.SOCKET = io("http://localhost:3000");
    this.SOCKET.on("player-joined", (data) => {
      console.log("player joined=" + data.name + data.id);
      const player: PlayerInterface = { name: data.name, id: data.id };

      this.LOBBY_STORE.addToLobby(player);
      console.log(this.ROOM);
    });
    this.SOCKET.on("player-left", (data) => {
      this.LOBBY_STORE.removeFromLobby(data.playerId);

      console.log(this.ROOM);
    });
    this.SOCKET.on("my-id", (data) => {
      this.PLAYER.id = data.id;
    });
  }

  async CreateLobby() {
    try {
      const response = await axios.post(`${this.SERVER_URL}/create-lobby`);
      const data: string = JSON.stringify(response.data);
      console.log("CreateLobby() data returned in http response=" + data);
      this.ID = response.data.id;
      await this.JoinLobby(this.ID!);
    } catch (error: any) {
      console.error("Error creating lobby:", error.message);
    }

    return this.ID;
  }
  async JoinLobby(lobbyId: string) {
    this.ID = lobbyId;
    const Join = async (lobbyId: string) => {
      try {
        const joinData = {
          lobbyId: lobbyId,
          playerName: this.PLAYER.name,
        };
        this.SOCKET.emit("join-lobby", joinData);

        console.log(this.ROOM);
      } catch (error: any) {
        console.error("Error joining the lobby:", error.message);
      }
    };

    try {
      await axios
        .get(`${this.SERVER_URL}/lobbies/${lobbyId}`)
        .then((response) => {
          const string = JSON.stringify(response.data.players);

          console.log(string);
          const players = response.data.players;

          const playersArray: PlayerInterface[] = players;

          playersArray.forEach((element: PlayerInterface) => {
            this.LOBBY_STORE.addToLobby(element);
          });
        });
      await Join(lobbyId);
    } catch (error: any) {
      console.error("Error getting lobby information:", error.message);
      throw error;
    }
    console.log("your id is " + this.PLAYER.id);
  }
  LeaveLobby() {
    this.SOCKET.emit("leave-lobby", {
      lobbyId: this.ID,
      playerId: this.PLAYER.id,
    });
    this.ROOM = [];
    //need to reset the state of the game when this is done
  }
}

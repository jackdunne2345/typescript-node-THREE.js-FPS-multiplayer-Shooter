import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";
import { Socket, io } from "socket.io-client";
import axios from "axios";
import { PropAtributes, Stack, Prop } from "./PropStack";

interface PlayerInterface {
  name: string;
  id: number;
}

interface LobbyStore {
  addToLobby(player: PlayerInterface): void;
  removeFromLobby(id: number): void;
  emptyLobby(): void;
  subscribe(listener: () => void): () => void;
  getSnapShot(): PlayerInterface[];
  LOBBY: PlayerInterface[];
}

class Game {
  private GAMEWORLD: WORLD.World;
  public PLAYER: CHARACTERS.Player;
  private LOBBY: PlayerInterface[];
  public LOBBY_LISTENERS: (() => void)[];
  public LOBBY_STORE: LobbyStore;
  private PLAYER2: CHARACTERS.EnemyPlayer;
  private CONTROLS: CHARACTERS.PlayerController;
  private PROPSTACK: Stack<PropAtributes>;
  private PLANE: PropAtributes;
  private CUBE: PropAtributes;
  private SOCKET: Socket;
  private SERVER_URL = "http://localhost:3000";
  public LOBBY_ID: string | null;

  constructor() {
    this.LOBBY_ID = null;
    this.LOBBY = [];
    this.LOBBY_LISTENERS = [];
    this.LOBBY_STORE = {
      addToLobby: (player: PlayerInterface) => {
        const newLob: PlayerInterface[] = [...this.LOBBY, player];
        this.LOBBY = newLob;
        emitChange.call(this);
      },
      removeFromLobby: (id: number) => {
        const newLob: PlayerInterface[] = this.LOBBY.filter(
          (player) => player.id !== id
        );
        this.LOBBY = newLob;
        emitChange.call(this);
      },
      emptyLobby: () => {
        const newLob: PlayerInterface[] = [];
        this.LOBBY = newLob;
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
      getSnapShot: () => this.LOBBY,
      LOBBY: this.LOBBY,
    };
    function emitChange(this: Game) {
      for (let listener of this.LOBBY_LISTENERS) {
        listener();
      }
    }
    this.SOCKET = io("http://localhost:3000");
    this.SOCKET.on("player-joined", (data) => {
      console.log("player joined=" + data.name + data.id);
      const player: PlayerInterface = { name: data.name, id: data.id };

      this.LOBBY_STORE.addToLobby(player);
      console.log(this.LOBBY);
    });
    this.SOCKET.on("player-left", (data) => {
      this.LOBBY_STORE.removeFromLobby(data.playerId);

      console.log(this.LOBBY);
    });
    this.SOCKET.on("my-id", (data) => {
      this.PLAYER.id = data.id;
      console.log("you have joined the server your id is = " + data.id);
    });
    this.GAMEWORLD = new WORLD.World();
    this.PLAYER = new CHARACTERS.Player();
    this.PLAYER.position.set(-5, 3, -5);
    this.PLAYER.fixedRotation = true;
    this.PLAYER2 = new CHARACTERS.EnemyPlayer(
      1,
      Math.random().toString(36).substr(2, 9)
    );
    this.GAMEWORLD.world.addBody(this.PLAYER);
    this.GAMEWORLD.scene.add(this.PLAYER2);
    this.PLAYER2.position.set(1, 0, -5);
    this.CONTROLS = new CHARACTERS.PlayerController(
      this.PLAYER,
      this.GAMEWORLD.camera
    );
    // this.CONTROLS.StartControls();
    this.PROPSTACK = new Stack<PropAtributes>();
    this.PLANE = {
      id: 1,
      type: "PLANE",
      geometry: {
        width: 100,
        height: 100,
        debth: 0.1,
      },
      color: 0x0000ff,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      rotation: {
        x: -Math.PI / 2,
        y: 0,
        z: 0,
      },
      mass: 0,
      dynamic: true,
    };
    this.CUBE = {
      id: 2,
      type: "BOX",
      geometry: {
        width: 50,
        height: 50,
        debth: 1,
      },
      color: 0x00ff00,
      position: {
        x: 0,
        y: 25,
        z: 0,
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      mass: 0,
      dynamic: true,
    };
    this.PROPSTACK.push(this.PLANE);
    this.PROPSTACK.push(this.CUBE);
    this.InitProps(this.PROPSTACK);
  }

  async CreateLobby() {
    try {
      // Send a POST request to the server to create a lobby
      const response = await axios.post(`${this.SERVER_URL}/create-lobby`);
      const data: string = JSON.stringify(response.data);

      console.log("CreateLobby() data returned in http response=" + data);
      this.LOBBY_ID = response.data.id;
      await this.JoinLobby(this.LOBBY_ID!);
    } catch (error: any) {
      console.error("Error creating lobby:", error.message);
    }

    return this.LOBBY_ID;
  }
  async JoinLobby(lobbyId: string) {
    this.LOBBY_ID = lobbyId;
    const Join = async (lobbyId: string) => {
      try {
        const joinData = {
          lobbyId: lobbyId,
          playerName: this.PLAYER.name,
        };
        this.SOCKET.emit("join-lobby", joinData);
        console.log(this.PLAYER.name);
        console.log(this.LOBBY);

        console.log("emmit");
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

          console.log("this is the lobby player json in get =");
          playersArray.forEach((element: PlayerInterface) => {
            this.LOBBY_STORE.addToLobby(element);
          });
        });
      await Join(lobbyId);
    } catch (error: any) {
      console.error("Error getting lobby information:", error.message);
      throw error;
    }
  }
  LeaveLobby() {
    this.SOCKET.emit("leave-lobby", {
      lobbyId: this.LOBBY_ID,
      playerId: this.PLAYER.id,
    });
    this.LOBBY = [];
    //need to reset the state of the game when this is done
  }
  //plan for a level editor
  InitProps(s: Stack<PropAtributes>) {
    while (!s.isEmpty()) {
      let p: PropAtributes = s.pop()!;
      let prop = new Prop(p);
      this.GAMEWORLD.addProp(prop);
    }
  }
  Animate() {
    const animate = () => {
      window.requestAnimationFrame(animate);
      this.CONTROLS.keyboardControls();
      // DisplayPlayerPosition();
      // CANNON_DEBUGGER.update();
      this.GAMEWORLD.render();
    };
    animate();
  }
}
const game = new Game();
export default game;

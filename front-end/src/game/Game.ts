import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";
import Lobby from "./Lobby";
import { PropAtributes, Stack, Prop } from "./PropStack";
import { Socket, io } from "socket.io-client";
import axios from "axios";

export interface PlayerInterface {
  name: string;
  id: number | null;
}

const testPlayer: PlayerInterface = {
  name: "test",
  id: null,
};

class Game {
  public STARTGAME: boolean;
  private GAMEWORLD: WORLD.World;
  public PLAYER: CHARACTERS.Player;
  public LOBBY: Lobby;
  private SOCKET: Socket;
  private CONTROLS: CHARACTERS.PlayerController;
  private PROPSTACK: Stack<PropAtributes>;
  private PLANE: PropAtributes;
  private CUBE: PropAtributes;
  private SERVER_URL = "http://localhost:3000";
  constructor() {
    this.STARTGAME = false;
    this.GAMEWORLD = new WORLD.World();
    this.PLAYER = new CHARACTERS.Player();
    this.LOBBY = new Lobby(this.PLAYER.interface);
    this.PLAYER.position.set(-5, 3, -5);
    this.PLAYER.fixedRotation = true;
    this.GAMEWORLD.world.addBody(this.PLAYER);

    this.PROPSTACK = new Stack<PropAtributes>();
    this.PLANE = {
      id: 1,
      type: "PLANE",
      geometry: {
        width: 100,
        height: 100,
        debth: 0.1,
      },
      color: 0x200589,
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
      color: 0x7d12ff,
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
    this.SOCKET = io("http://localhost:3000");
    this.SOCKET.on("player-joined", (data) => {
      console.log("player joined=" + data.name + data.id);
      const player: PlayerInterface = { name: data.name, id: data.id };

      this.LOBBY.LOBBY_STORE.addToLobby(player);
    });
    this.SOCKET.on("player-left", (data) => {
      console.log("player left+ " + data.playerId);
      let id = this.LOBBY.LOBBY_STORE.removeFromLobby(data.playerId);
      this.GAMEWORLD.RemovePlayer(id);
    });
    this.SOCKET.on("my-id", (data) => {
      console.log("cahnged id" + data.id);
      this.PLAYER.interface.id = data.id;
    });
    this.CONTROLS = new CHARACTERS.PlayerController(
      this.PLAYER,
      this.GAMEWORLD.camera
    );
  }

  //plan for a level editor
  InitProps(s: Stack<PropAtributes>) {
    while (!s.isEmpty()) {
      let p: PropAtributes = s.pop()!;
      let prop = new Prop(p);
      this.GAMEWORLD.addProp(prop);
    }
  }
  Start() {
    const initPlayers = () => {
      this.LOBBY.ROOM.forEach((element) => {
        if (element.id !== this.PLAYER.interface.id) {
          const enemyPlayer = new CHARACTERS.EnemyPlayer(element, this.SOCKET);
          enemyPlayer.body.position.set(-5, 3, -5);
          this.GAMEWORLD.ENEMIES.push(enemyPlayer);
        }
      });
    };
    initPlayers();
    this.GAMEWORLD.SwitchAnimation();

    this.CONTROLS.StartControls();
  }
  GameState() {
    this.GAMEWORLD.Render();
    this.CONTROLS.keyboardControls(this.SOCKET);
    requestAnimationFrame(() => this.GameState());
  }

  async CreateLobby() {
    try {
      const response = await axios.post(`${this.SERVER_URL}/create-lobby`);
      const data: string = JSON.stringify(response.data);
      console.log("CreateLobby() data returned in http response=" + data);
      this.LOBBY.ID = response.data.id;
      await this.JoinLobby(this.LOBBY.ID!);
    } catch (error: any) {
      console.error("Error creating lobby:", error.message);
    }

    return this.LOBBY.ID;
  }
  async JoinLobby(lobbyId: string) {
    this.LOBBY.ID = lobbyId;
    const Join = async (lobbyId: string) => {
      try {
        const joinData = {
          lobbyId: lobbyId,
          playerName: this.LOBBY.PLAYER.name,
        };
        this.SOCKET.emit("join-lobby", joinData);

        console.log(this.LOBBY.ROOM);
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
            this.LOBBY.LOBBY_STORE.addToLobby(element);
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
      lobbyId: this.LOBBY.ID,
      playerId: this.PLAYER.interface.id,
    });
    this.LOBBY.ROOM = [];
    //need to reset the state of the game when this is done
  }
}
const game = new Game();
export default game;

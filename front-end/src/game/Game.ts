import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";
import { gState } from "./State";
import { PropAtributes, Stack, Prop } from "./PropStack";
import { Socket, io } from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import { LobbyResponse, PlayerProp, ServerError } from "./Types";

class Game {
  private GAMEWORLD: WORLD.World;
  private PLAYER: CHARACTERS.Player;
  private SOCKET: Socket;
  private CONTROLS: CHARACTERS.PlayerController;
  private PROPSTACK: Stack<PropAtributes>;
  private PLANE: PropAtributes;
  private CUBE: PropAtributes;
  private SERVER_URL = "http://localhost:3000";
  constructor() {
    this.GAMEWORLD = new WORLD.World();
    this.PLAYER = new CHARACTERS.Player();
    this.PLAYER.position.set(-5, 3, -5);
    this.GAMEWORLD.P_WORLD.addBody(this.PLAYER);
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
      const player: PlayerProp = { name: data.name, gameId: data.id };
      gState.LOBBY_STORE.AddToLobby(player);
      gState.ROOM.forEach((element: PlayerProp) => {
        if (element.gameId !== this.PLAYER.INTERFACE.gameId) {
          const enemyPlayer = new CHARACTERS.EnemyPlayer(element, this.SOCKET);
          enemyPlayer.BODY.position.set(-5, 3, -5);
          this.GAMEWORLD.ENEMIES.push(enemyPlayer);
          this.GAMEWORLD.SCENE.add(enemyPlayer.MESH);
          this.GAMEWORLD.P_WORLD.addBody(enemyPlayer.BODY);
        }
      });
    });
    this.SOCKET.on("error", (data) => {
      console.log(data.error);
    });
    this.SOCKET.on("player-left", (data) => {
      console.log("player left+ " + data.playerId);
      let id = gState.LOBBY_STORE.RemoveFromLobby(data.playerId);
      this.GAMEWORLD.RemovePlayer(id);
    });
    this.SOCKET.on("my-id", (data) => {
      console.log("cahnged id" + data.id);
      this.PLAYER.INTERFACE.gameId = data.id;
    });
    this.CONTROLS = new CHARACTERS.PlayerController(
      this.PLAYER,
      this.GAMEWORLD.CAMERA
    );
  }

  //plan for a level editor
  InitProps(s: Stack<PropAtributes>) {
    while (!s.isEmpty()) {
      let p: PropAtributes = s.pop()!;
      let prop = new Prop(p);
      this.GAMEWORLD.AddProp(prop);
    }
  }
  Start() {
    this.GAMEWORLD.SwitchAnimation();
    this.CONTROLS.TogleControls();
  }
  GameState() {
    this.GAMEWORLD.Render();
    this.CONTROLS.keyboardControls(this.SOCKET);
    requestAnimationFrame(() => this.GameState());
  }
  public ToggleControlls() {
    this.CONTROLS.TogleControls();
  }

  async CreateLobby(): Promise<string | { error: string }> {
    const requestData = {
      name: this.PLAYER.INTERFACE.name,
    };
    try {
      let retunrnString: string | { error: string } | null = null;
      await axios
        .post(`${this.SERVER_URL}/create-lobby`, requestData)
        .then((response: AxiosResponse<{ error: string }, string>) => {
          console.log(this.PLAYER.INTERFACE.name + " is creating a lobby");
          if (response.data.error) {
            console.log(response.data.error);
            return response.data;
          } else if (typeof response.data === "string") {
            const jsonString: string = JSON.stringify(response.data);
            const data = jsonString.slice(1, jsonString.length - 1);
            console.log(
              "CreateLobby() lobbyId data returned in http response=" + data
            );
            gState.LOBBY_ID = data;
            this.SOCKET.emit("join-lobby", {
              lobbyId: data,
              playerName: this.PLAYER.INTERFACE.name,
            });
            this.PLAYER.INTERFACE.gameId = 0;
            gState.LOBBY_ID = data;
            retunrnString = data;
          }
        })
        .catch((error) => {
          retunrnString = { error: error.message };
        });
      return retunrnString!;
    } catch (error: any) {
      console.error("Error creating lobby:", error.message);
      return { error: error.message };
    }
  }
  async JoinLobby(lobbyId: string) {
    const Join = async (lobbyId: string) => {
      try {
        const joinData = {
          lobbyId: lobbyId,
          playerName: this.PLAYER.INTERFACE.name,
        };
        this.SOCKET.emit("join-lobby", joinData);
        gState.LOBBY_ID = lobbyId;
      } catch (error: any) {
        console.error("Error joining the lobby:", error.message);
      }
    };

    try {
      await axios
        .get(`${this.SERVER_URL}/lobbies/${lobbyId}`)
        .then((response) => {
          const string = JSON.stringify(response.data.players);

          console.log("this is the respone of the join " + string);
          const players = response.data.players;

          const playersArray: PlayerProp[] = players;

          playersArray.forEach((element: PlayerProp) => {
            gState.LOBBY_STORE.AddToLobby(element);
            console.log(element.name + "THIS IS THE PLAYER IN THE LOBY");
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
      lobbyId: gState.LOBBY_ID,
      playerId: this.PLAYER.INTERFACE.gameId,
    });
    gState.LOBBY_STORE.EmptyLobby();
    console.log(`you left lobby ${gState.LOBBY_ID}`);
    //need to reset the state of the game when this is done
  }
}

const game = new Game();

export default game;

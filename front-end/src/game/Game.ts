import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";
import Lobby from "./Lobby";
import { PropAtributes, Stack, Prop } from "./PropStack";

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

  private CONTROLS: CHARACTERS.PlayerController;
  private PROPSTACK: Stack<PropAtributes>;
  private PLANE: PropAtributes;
  private CUBE: PropAtributes;

  constructor() {
    this.STARTGAME = false;
    this.GAMEWORLD = new WORLD.World();
    this.PLAYER = new CHARACTERS.Player();
    this.LOBBY = new Lobby(this.PLAYER.interface);
    this.PLAYER.position.set(-5, 3, -5);
    this.PLAYER.fixedRotation = true;

    this.GAMEWORLD.world.addBody(this.PLAYER);

    this.CONTROLS = new CHARACTERS.PlayerController(
      this.PLAYER,
      this.GAMEWORLD.camera
    );

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
  }

  //plan for a level editor
  InitProps(s: Stack<PropAtributes>) {
    while (!s.isEmpty()) {
      let p: PropAtributes = s.pop()!;
      let prop = new Prop(p);
      this.GAMEWORLD.addProp(prop);
    }
  }
  StartOrStop() {
    const initPlayers = () => {
      this.LOBBY.ROOM.forEach((element) => {
        if (element.id != this.PLAYER.id) {
          const enemyPlayer = new CHARACTERS.EnemyPlayer(element);
          enemyPlayer.position.set(-5, 3, -5);
          this.GAMEWORLD.scene.add(enemyPlayer);
        }
      });
    };
    this.GAMEWORLD.SwitchAnimation();
    this.CONTROLS.StartControls();

    initPlayers();
  }
  GameState() {
    this.GAMEWORLD.Render();
    this.CONTROLS.keyboardControls();
    requestAnimationFrame(() => this.GameState());
  }
}
const game = new Game();
export default game;

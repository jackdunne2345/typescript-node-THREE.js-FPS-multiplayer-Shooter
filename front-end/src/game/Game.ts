import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";

import { PropAtributes, Stack, Prop } from "./PropStack";

class Game {
  private GAMEWORLD: WORLD.World;
  private PLAYER: CHARACTERS.Player;
  private PLAYER2: CHARACTERS.EnemyPlayer;
  private CONTROLS: CHARACTERS.PlayerController;
  private PROPSTACK: Stack<PropAtributes>;
  private PLANE: PropAtributes;
  private CUBE: PropAtributes;
  constructor() {
    this.GAMEWORLD = new WORLD.World();
    this.PLAYER = new CHARACTERS.Player();
    this.PLAYER.position.set(-5, 3, -5);
    this.PLAYER.fixedRotation = true;
    this.PLAYER2 = new CHARACTERS.EnemyPlayer(1, "john");
    this.GAMEWORLD.world.addBody(this.PLAYER);
    this.GAMEWORLD.scene.add(this.PLAYER2);
    this.PLAYER2.position.set(1, 0, -5);
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

import * as WORLD from "./World";
import * as CHARACTERS from "./Characters";
import CannonDebugger from "cannon-es-debugger";
import { Stack, Prop } from "./PropStack";
//add a world and a camera
export const GAME_WORLD = new WORLD.World();
//add a player
export const PLAYER = new CHARACTERS.Player();
const PLAYER2 = new CHARACTERS.Player();
PLAYER2.position.set(1, 10, -5);
PLAYER.position.set(-5, 3, -5);
PLAYER.fixedRotation = true;
//add controls
const controls = new CHARACTERS.PlayerController(PLAYER, GAME_WORLD.camera);
GAME_WORLD.world.addBody(PLAYER);
GAME_WORLD.world.addBody(PLAYER2);
const CANNON_DEBUGGER = CannonDebugger(GAME_WORLD.scene, GAME_WORLD.world, {
    color: 0xff0000,
});
//make props
//-------
const PROP_STACK = new Stack();
const PLANE = {
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
const CUBE = {
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
PROP_STACK.push(PLANE);
PROP_STACK.push(CUBE);
const DisplayPlayerPosition = () => {
    document.getElementById("x").innerText = "x : ".concat(PLAYER.position.x.toFixed(2));
    document.getElementById("y").innerText = "y : ".concat(PLAYER.position.y.toFixed(2));
    document.getElementById("z").innerText = "z : ".concat(PLAYER.position.z.toFixed(2));
    document.getElementById("health").innerText = "FPS : ".concat();
};
// initilise props in the scene
const Init = (s) => {
    while (!s.isEmpty()) {
        let p = s.pop();
        const prop = new Prop(p);
        GAME_WORLD.addProp(prop);
    }
};
Init(PROP_STACK);
const Animate = () => {
    window.requestAnimationFrame(Animate);
    controls.keyboardControls();
    DisplayPlayerPosition();
    CANNON_DEBUGGER.update();
    GAME_WORLD.render();
};
Animate();

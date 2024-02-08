import * as GWORLD from "./GraphicsWorld";
import * as PLAYERS from "./Player";
import * as PWorld from "./PhysicsWorld";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Stack } from "./PropStack";
import * as THREE from "three";
import { ShapeType, threeToCannon } from "three-to-cannon";
//add a world and a camera
const GAME_WORLD = new GWORLD.GWorld();
//add a player
const PLAYER = new PLAYERS.Player();
GAME_WORLD.addToScene(PLAYER);
//add controls
const controls = new PLAYERS.PlayerController(PLAYER, GAME_WORLD.camera);
//add physics
const PHYSICS_WORLD = new PWorld.PWorld();
const CANNON_DEBUGGER = CannonDebugger(GAME_WORLD.scene, PHYSICS_WORLD.world, {
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
    dynamic: false,
};
const CUBE = {
    id: 1,
    type: "BOX",
    geometry: {
        width: 1,
        height: 1,
        debth: 1,
    },
    color: 0x00ff00,
    position: {
        x: 0,
        y: 10,
        z: 0,
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0,
    },
    mass: 5,
    dynamic: true,
};
PROP_STACK.push(PLANE);
PROP_STACK.push(CUBE);
//initilise props in the scene
const Init = (s) => {
    var _a, _b, _c, _d, _e, _f;
    while (!s.isEmpty()) {
        let gProp;
        let material = new THREE.MeshBasicMaterial();
        let geometry;
        let prop = s.pop();
        let body;
        if (prop.type === "PLANE") {
            geometry = new THREE.PlaneGeometry(prop.geometry.width, prop.geometry.height);
        }
        else if ((prop.type = "BOX")) {
            geometry = new THREE.BoxGeometry(prop.geometry.width, prop.geometry.height, prop.geometry.debth);
        }
        if (prop.color) {
            material = new THREE.MeshBasicMaterial({ color: prop.color });
        }
        gProp = new THREE.Mesh(geometry, material);
        gProp.quaternion.setFromEuler(new THREE.Euler(prop.rotation.x, prop.rotation.y, prop.rotation.z));
        gProp.position.set((_a = prop.position) === null || _a === void 0 ? void 0 : _a.x, (_b = prop.position) === null || _b === void 0 ? void 0 : _b.y, (_c = prop.position) === null || _c === void 0 ? void 0 : _c.z);
        let result = threeToCannon(gProp, { type: ShapeType.BOX });
        const { shape } = result;
        prop.dynamic
            ? (body = new CANNON.Body({ mass: prop.mass, type: CANNON.Body.DYNAMIC }))
            : (body = new CANNON.Body({ mass: prop.mass, type: CANNON.Body.STATIC }));
        body.addShape(shape);
        body.position.set((_d = prop.position) === null || _d === void 0 ? void 0 : _d.x, (_e = prop.position) === null || _e === void 0 ? void 0 : _e.y, (_f = prop.position) === null || _f === void 0 ? void 0 : _f.z);
        body.quaternion.setFromEuler(prop.rotation.x, prop.rotation.y, prop.rotation.z);
        PHYSICS_WORLD.world.addBody(body);
        GAME_WORLD.scene.add(gProp);
    }
};
const displayPlayerPosition = () => {
    document.getElementById("x").innerText = "x : ".concat(PLAYER.position.x.toFixed(2));
    document.getElementById("y").innerText = "y : ".concat(PLAYER.position.y.toFixed(2));
    document.getElementById("z").innerText = "z : ".concat(PLAYER.position.z.toFixed(2));
    document.getElementById("health").innerText =
        "health : " + PLAYER.health.toString();
};
const Animate = () => {
    Init(PROP_STACK);
    window.requestAnimationFrame(Animate);
    controls.keyboardControls();
    displayPlayerPosition();
    PHYSICS_WORLD.world.fixedStep();
    CANNON_DEBUGGER.update();
    GAME_WORLD.render();
};
Animate();

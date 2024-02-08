import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
export class Player extends THREE.Object3D {
    constructor() {
        super();
        this.moveSpeed = 0.25;
        this.health = 100;
    }
}
export class PlayerController {
    constructor(player, camera) {
        this.keys = {};
        this.player = player;
        this.moveSpeed = this.player.moveSpeed;
        this.camera = camera;
        this.cameraControls = new PointerLockControls(this.camera, document.body);
        document.addEventListener("click", () => {
            this.cameraControls.lock();
            document.addEventListener("keydown", (event) => {
                this.keys[event.key] = true;
            });
            document.addEventListener("keyup", (event) => {
                this.keys[event.key] = false;
            });
        });
    }
    keyboardControls() {
        this.player.position.x = this.camera.position.x;
        this.player.position.y = this.camera.position.y;
        this.player.position.z = this.camera.position.z;
        if (this.keys["w"] || this.keys["W"]) {
            this.cameraControls.moveForward(this.moveSpeed);
        }
        if (this.keys["s"] || this.keys["S"]) {
            this.cameraControls.moveForward(-this.moveSpeed);
        }
        if (this.keys["a"] || this.keys["A"]) {
            this.cameraControls.moveRight(-this.moveSpeed);
        }
        if (this.keys["d"] || this.keys["D"]) {
            this.cameraControls.moveRight(this.moveSpeed);
        }
    }
}

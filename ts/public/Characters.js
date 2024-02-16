import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as CANNON from "cannon-es";
const material = new CANNON.Material({ friction: 0 });
export class Player extends CANNON.Body {
    constructor() {
        super({
            type: CANNON.Body.DYNAMIC,
            shape: new CANNON.Cylinder(1, 1, 4, 5),
            mass: 10,
            material: material,
        });
        this.moveSpeed = 15;
        this.health = 100;
        this.angularDamping = 1;
    }
}
export class PlayerController {
    constructor(player, camera) {
        this.keys = {};
        this.player = player;
        this.camera = camera;
        this.cameraControls = new PointerLockControls(this.camera, document.body);
        this.moveSpeed = this.player.moveSpeed;
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
        this.camera.position.x = this.player.position.x;
        this.camera.position.y = this.player.position.y + 1.5;
        this.camera.position.z = this.player.position.z;
        const velocity = new CANNON.Vec3(0, 0, 0);
        const quaternion = this.cameraControls.getObject().quaternion;
        const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
        if (this.keys["w"] || this.keys["W"]) {
            velocity.x = forwardVector.x * this.moveSpeed;
            velocity.z = forwardVector.z * this.moveSpeed;
        }
        if (this.keys["s"] || this.keys["S"]) {
            velocity.x = -forwardVector.x * this.moveSpeed;
            velocity.z = -forwardVector.z * this.moveSpeed;
        }
        if (this.keys["a"] || this.keys["A"]) {
            const rightVector = forwardVector
                .clone()
                .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
            velocity.x = velocity.x + rightVector.x * this.moveSpeed;
            velocity.z = velocity.z + rightVector.z * this.moveSpeed;
        }
        if (this.keys["d"] || this.keys["D"]) {
            const leftVector = forwardVector
                .clone()
                .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
            velocity.z = velocity.z + leftVector.z * this.moveSpeed;
            velocity.x = velocity.x + leftVector.x * this.moveSpeed;
        }
        if (this.keys[" "]) {
            if (Math.abs(this.player.velocity.y) < 0.001) {
                // Apply an upward impulse to simulate jumping
                this.player.velocity.y += this.moveSpeed;
            }
        }
        if (this.player.velocity.y < 0) {
            this.player.velocity.x = velocity.x;
            this.player.velocity.z = velocity.z;
        }
        else {
            this.player.velocity.x = velocity.x;
            this.player.velocity.z = velocity.z;
        }
    }
}

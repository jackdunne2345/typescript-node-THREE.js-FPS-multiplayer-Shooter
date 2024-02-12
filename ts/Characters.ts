import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import * as CANNON from "cannon-es";
export class Player extends CANNON.Body {
  public moveSpeed: number;
  private health: number;

  constructor() {
    super({
      type: CANNON.Body.KINEMATIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
    });
    this.moveSpeed = 10;
    this.health = 100;
  }
}

export class PlayerController {
  private player: Player;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: PointerLockControls;

  private keys: { [key: string]: boolean } = {};
  private allKeysFalse = Object.values(this.keys).every(
    (value) => value === false
  );
  constructor(player: Player, camera: THREE.PerspectiveCamera) {
    this.player = player;
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
    this.player.addEventListener("collide", (event: { body: any }) => {
      const stop = new CANNON.Vec3(0, 0, 0);
      var otherBody = event.body;
      this.player.velocity.copy(stop);
      console.log("Kinematic body collided with:", otherBody);
    });
  }

  keyboardControls() {
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 2;
    this.camera.position.z = this.player.position.z;

    const velocity = new CANNON.Vec3(0, 0, 0);
    const quaternion = this.cameraControls.getObject().quaternion;

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(
      quaternion
    );

    if (this.keys["w"] || this.keys["W"]) {
      velocity.x = forwardVector.x * this.player.moveSpeed;
      velocity.z = forwardVector.z * this.player.moveSpeed;
    }
    if (this.keys["s"] || this.keys["S"]) {
      velocity.x = -forwardVector.x * this.player.moveSpeed;
      velocity.z = -forwardVector.z * this.player.moveSpeed;
    }
    if (this.keys["a"] || this.keys["A"]) {
      const rightVector = forwardVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      velocity.x = velocity.x + rightVector.x * this.player.moveSpeed;
      velocity.z = velocity.z + rightVector.z * this.player.moveSpeed;
    }
    if (this.keys["d"] || this.keys["D"]) {
      const leftVector = forwardVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
      velocity.z = velocity.z + leftVector.z * this.player.moveSpeed;
      velocity.x = velocity.x + leftVector.x * this.player.moveSpeed;
    }
    this.player.velocity.copy(velocity);
  }
}

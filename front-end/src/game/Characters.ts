import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as CANNON from "cannon-es";

const material = new CANNON.Material({ friction: 0 });
export class Player extends CANNON.Body {
  public moveSpeed: number;
  public ID: number | null;
  private health: number;
  public name: string;

  constructor() {
    super({
      type: CANNON.Body.DYNAMIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
      mass: 10,
      material: material,
    });
    this.ID = null;
    this.moveSpeed = 15;
    this.health = 100;
    this.name = Math.random().toString(36).substr(2, 9);
    this.angularDamping = 1;
  }
}
export class EnemyPlayer extends THREE.Object3D {
  private playerId: number;
  private playerName: string;
  private loader = new GLTFLoader();
  constructor(id: number, name: string) {
    super();
    this.playerId = id;
    this.playerName = name;
    this.loader.load("/src/game/assets/models/player.glb", (gltf) => {
      gltf.scene.scale.set(2.3, 2.3, 2.3);
      this.add(gltf.scene);
    });
  }
}

export class PlayerController {
  private player: Player;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: PointerLockControls;
  private moveSpeed: number;
  private keys: { [key: string]: boolean } = {};

  constructor(player: Player, camera: THREE.PerspectiveCamera) {
    this.player = player;
    this.camera = camera;
    this.cameraControls = new PointerLockControls(this.camera, document.body);
    this.moveSpeed = this.player.moveSpeed;
  }
  StartControls() {
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
    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(
      quaternion
    );

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
        this.player.velocity.y += this.moveSpeed;
      }
    }

    if (this.player.velocity.y < 0) {
      this.player.velocity.x = velocity.x;
      this.player.velocity.z = velocity.z;
    } else {
      this.player.velocity.x = velocity.x;
      this.player.velocity.z = velocity.z;
    }
  }
}

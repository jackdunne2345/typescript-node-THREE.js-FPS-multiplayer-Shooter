import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as CANNON from "cannon-es";
import { PlayerInterface } from "./Game";
import SpriteText from "three-spritetext";
import { Socket } from "socket.io-client";

const material = new CANNON.Material({ friction: 0, restitution: 0 });

export class Player extends CANNON.Body {
  public moveSpeed: number;
  public interface: PlayerInterface;
  private health: number;

  constructor() {
    super({
      type: CANNON.Body.DYNAMIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
      mass: 10,
      material: material,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
    });
    this.interface = {
      name: Math.random().toString(36).substr(2, 9),
      id: null,
    };
    this.moveSpeed = 15;
    this.health = 100;

    this.angularDamping = 1;
  }
}
export class EnemyPlayer {
  public interface: PlayerInterface;
  public mesh: THREE.Object3D;
  public body: CANNON.Body;
  private loader = new GLTFLoader();
  constructor(player: PlayerInterface, socket: Socket) {
    this.mesh = new THREE.Object3D();
    this.body = new CANNON.Body({
      type: CANNON.Body.DYNAMIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
      mass: 10,
      material: material,
      angularDamping: 1,
      collisionFilterGroup: 3,
      collisionFilterMask: 1,
    });
    this.interface = player;
    socket.on(this.interface.name, (data) => {
      console.log("recived player velocity");
      this.body.velocity.x = data.x;
      this.body.velocity.y = data.y;
      this.body.velocity.z = data.z;
    });
    const nameSprite = new SpriteText(this.interface.name);
    nameSprite.scale.set(1.5, 1, 1);
    nameSprite.position.y = 5;
    this.mesh.add(nameSprite);
    this.loader.load("/src/game/assets/models/player.glb", (gltf) => {
      gltf.scene.scale.set(2.3, 2.3, 2.3);
      this.mesh.add(gltf.scene);
    });
  }
  syncPosition() {
    (this.mesh.position.x = this.body.position.x),
      (this.mesh.position.y = this.body.position.y - 2),
      (this.mesh.position.z = this.body.position.z);
  }
}

export class PlayerController {
  private lastVelocity: CANNON.Vec3;
  private player: Player;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: PointerLockControls;
  private moveSpeed: number;

  private keys: { [key: string]: boolean } = {};
  public active: boolean;
  constructor(player: Player, camera: THREE.PerspectiveCamera) {
    this.lastVelocity = new CANNON.Vec3(0, 0, 0);

    this.player = player;
    this.camera = camera;
    this.cameraControls = new PointerLockControls(this.camera, document.body);
    this.moveSpeed = this.player.moveSpeed;
    this.active = false;
  }
  StartControls() {
    this.active = this.active!;
    // this.cameraControls.addEventListener("change", () => {
    //   // Log the camera's rotation or any other relevant information
    //   console.log("Camera rotation:", this.cameraControls.camera.rotation);
    // });
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
  keyboardControls(socket: Socket) {
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
        velocity.y += this.moveSpeed;
        this.player.velocity.y += velocity.y;
      }
    }
    if (
      this.lastVelocity.x !== velocity.x ||
      this.lastVelocity.z !== velocity.z
    ) {
      console.log("player velocity has changed");
      console.log("X :" + velocity.x);
      console.log("Z :" + velocity.z);
      socket.emit("movment", {
        player: this.player.interface.name,
        x: velocity.x,
        y: velocity.y,
        z: velocity.z,
      });
      this.lastVelocity.x = velocity.x;
      this.lastVelocity.y = velocity.y;
      this.lastVelocity.z = velocity.z;
    }
    this.player.velocity.x = velocity.x;
    this.player.velocity.z = velocity.z;
  }
}

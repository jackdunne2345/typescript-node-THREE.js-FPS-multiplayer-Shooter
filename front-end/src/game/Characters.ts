import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as CANNON from "cannon-es";
import { PlayerInterface } from "./Game";
import SpriteText from "three-spritetext";
import { Socket } from "socket.io-client";

const material = new CANNON.Material({ friction: 0, restitution: 0 });

export class Player extends CANNON.Body {
  public MOVE_SPEED: number;
  public INTERFACE: PlayerInterface;
  private HEALTH: number;

  constructor() {
    super({
      type: CANNON.Body.DYNAMIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
      mass: 1,
      material: material,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
      angularDamping: 1,
      fixedRotation: true,
    });
    this.INTERFACE = {
      name: Math.random().toString(36).substr(2, 9),
      id: null,
    };
    this.MOVE_SPEED = 15;
    this.HEALTH = 100;
  }
}
export class EnemyPlayer {
  private DATA_X: number;
  private DATA_Z: number;
  public INTERFACE: PlayerInterface;
  public MESH: THREE.Object3D;
  public BODY: CANNON.Body;
  private LOADER = new GLTFLoader();
  constructor(player: PlayerInterface, socket: Socket) {
    this.DATA_X = 0;
    this.DATA_Z = 0;
    this.MESH = new THREE.Object3D();
    this.BODY = new CANNON.Body({
      type: CANNON.Body.DYNAMIC,
      shape: new CANNON.Cylinder(1, 1, 4, 5),
      mass: 10,
      material: material,
      angularDamping: 1,
      collisionFilterGroup: 2,
      collisionFilterMask: 1,
      fixedRotation: true,
      allowSleep: true,
    });

    this.INTERFACE = player;
    socket.on(this.INTERFACE.name, (data) => {
      this.BODY.velocity.x = data.x;
      this.BODY.velocity.z = data.z;
      this.DATA_X = data.x;
      this.DATA_Z = data.z;

      data.y && this.jump();
    });

    const nameSprite = new SpriteText(this.INTERFACE.name);
    nameSprite.scale.set(1.5, 1, 1);
    nameSprite.position.y = 5;
    this.MESH.add(nameSprite);
    this.LOADER.load("/src/game/assets/models/player.glb", (gltf) => {
      gltf.scene.scale.set(2.3, 2.3, 2.3);
      this.MESH.add(gltf.scene);
    });
  }
  syncPosition() {
    (this.MESH.position.x = this.BODY.position.x),
      (this.MESH.position.y = this.BODY.position.y - 2),
      (this.MESH.position.z = this.BODY.position.z);
  }
  jump() {
    this.BODY.velocity.y += 15;
  }
  ApplyVelocity() {
    this.BODY.velocity.x = this.DATA_X;
    this.BODY.velocity.z = this.DATA_Z;
  }
}

export class PlayerController {
  private lastVelocity: CANNON.Vec3;
  private player: Player;
  private camera: THREE.PerspectiveCamera;
  private cameraControls: PointerLockControls;
  private MOVE_SPEED: number;

  private keys: { [key: string]: boolean } = {};
  public active: boolean;
  constructor(player: Player, camera: THREE.PerspectiveCamera) {
    this.lastVelocity = new CANNON.Vec3(0, 0, 0);

    this.player = player;
    this.camera = camera;
    this.cameraControls = new PointerLockControls(this.camera, document.body);
    this.MOVE_SPEED = this.player.MOVE_SPEED;
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
    let isJumping: boolean = false;
    this.camera.position.x = this.player.position.x;
    this.camera.position.y = this.player.position.y + 1.5;
    this.camera.position.z = this.player.position.z;

    const velocity = new CANNON.Vec3(0, 0, 0);

    const quaternion = this.cameraControls.getObject().quaternion;

    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(
      quaternion
    );

    if (this.keys["w"] || this.keys["W"]) {
      velocity.x = forwardVector.x * this.MOVE_SPEED;
      velocity.z = forwardVector.z * this.MOVE_SPEED;
    }
    if (this.keys["s"] || this.keys["S"]) {
      velocity.x = -forwardVector.x * this.MOVE_SPEED;
      velocity.z = -forwardVector.z * this.MOVE_SPEED;
    }
    if (this.keys["a"] || this.keys["A"]) {
      const rightVector = forwardVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      velocity.x = velocity.x + rightVector.x * this.MOVE_SPEED;
      velocity.z = velocity.z + rightVector.z * this.MOVE_SPEED;
    }
    if (this.keys["d"] || this.keys["D"]) {
      const leftVector = forwardVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
      velocity.z = velocity.z + leftVector.z * this.MOVE_SPEED;
      velocity.x = velocity.x + leftVector.x * this.MOVE_SPEED;
    }
    if (this.keys[" "]) {
      if (Math.abs(this.player.velocity.y) < 0.001) {
        velocity.y += this.MOVE_SPEED;
        this.player.velocity.y += velocity.y;
        isJumping = true;
      }
    }

    this.player.velocity.x = velocity.x;
    this.player.velocity.z = velocity.z;
    if (
      this.lastVelocity.x !== this.player.velocity.x ||
      this.lastVelocity.z !== this.player.velocity.z ||
      isJumping
    ) {
      // console.log("player velocity has changed");
      // console.log("X :" + velocity.x);
      // console.log("Z :" + velocity.z);
      socket.emit("movment", {
        player: this.player.INTERFACE.name,
        x: velocity.x,
        y: isJumping,
        z: velocity.z,
      });
      this.lastVelocity.x = velocity.x;
      this.lastVelocity.y = velocity.y;
      this.lastVelocity.z = velocity.z;
    }
  }
}

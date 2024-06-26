import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import * as CANNON from "cannon-es";
import { PlayerProp } from "./Types";
import SpriteText from "three-spritetext";
import { Socket } from "socket.io-client";
import { gState } from "./State";

const material = new CANNON.Material({ friction: 0, restitution: 0 });

export class Player extends CANNON.Body {
  public MOVE_SPEED: number;
  public INTERFACE: PlayerProp;
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
  public INTERFACE: PlayerProp;
  public MESH: THREE.Object3D;
  public BODY: CANNON.Body;
  private LOADER = new GLTFLoader();
  constructor(player: PlayerProp, socket: Socket) {
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
  public cameraControls: PointerLockControls;
  private MOVE_SPEED: number;
  private keys: { [key: string]: boolean } = {};
  public active: boolean;

  constructor(player: Player, camera: THREE.PerspectiveCamera) {
    this.lastVelocity = new CANNON.Vec3(0, 0, 0);
    this.player = player;
    this.camera = camera;
    this.cameraControls = new PointerLockControls(this.camera, document.body);
    this.cameraControls.addEventListener("unlock", () => {
      gState.PAUSE_STORE.SetPause(!gState.PAUSE);
    });
    const control = this.cameraControls;
    const updateSensitivity = () => {
      control.pointerSpeed = gState.SETTINGS.setting.sensitivty;
    };
    gState.SETTINGS_LISTENERS.push(updateSensitivity);
    this.MOVE_SPEED = this.player.MOVE_SPEED;
    this.active = false;
  }
  TogleControls() {
    this.cameraControls.lock();
    document.addEventListener("keydown", (event) => {
      if (!gState.PAUSE) this.keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keys[event.key] = false;
    });
    gState.PAUSE_STORE.SetPause(!gState.PAUSE);
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

    if (
      this.keys[gState.SETTINGS.control.forward] ||
      this.keys[gState.SETTINGS.control.forward.toLocaleUpperCase()]
    ) {
      velocity.x = forwardVector.x * this.MOVE_SPEED;
      velocity.z = forwardVector.z * this.MOVE_SPEED;
    }
    if (
      this.keys[gState.SETTINGS.control.back] ||
      this.keys[gState.SETTINGS.control.back.toLocaleUpperCase()]
    ) {
      velocity.x = -forwardVector.x * this.MOVE_SPEED;
      velocity.z = -forwardVector.z * this.MOVE_SPEED;
    }
    if (
      this.keys[gState.SETTINGS.control.left] ||
      this.keys[gState.SETTINGS.control.left.toLocaleUpperCase()]
    ) {
      const rightVector = forwardVector
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
      velocity.x = velocity.x + rightVector.x * this.MOVE_SPEED;
      velocity.z = velocity.z + rightVector.z * this.MOVE_SPEED;
    }
    if (
      this.keys[gState.SETTINGS.control.right] ||
      this.keys[gState.SETTINGS.control.right.toLocaleUpperCase()]
    ) {
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

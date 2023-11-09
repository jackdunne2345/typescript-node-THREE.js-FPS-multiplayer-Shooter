import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Player } from "/player.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const moveSpeed: number = 0.25;
let isJumping: boolean = false;
let verticalVelocity: number = 0;
let player: Player = new Player();
const enemyPlayer: Player = new Player();
const ememyPlayers: Player[] = [enemyPlayer];
const gravity: number = 0.02;
let weapon: THREE.Group;

const loader = new THREE.TextureLoader();
const black_Noise_Texture = new THREE.TextureLoader().load(
  "assets/textures/scenebackground.jpg"
);
black_Noise_Texture.wrapS = THREE.RepeatWrapping;
black_Noise_Texture.wrapT = THREE.RepeatWrapping;
black_Noise_Texture.repeat.set(1, 1); //check this
const scene = new THREE.Scene();
scene.background = black_Noise_Texture;
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
let camera_Position = camera.position;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight, false);
const controls = new PointerLockControls(camera, document.body);
document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
scene.add(camera);
cube.position.set(0, 1, -6);
const plane_Geometry = new THREE.PlaneGeometry(100, 100);
const plane_Material = new THREE.MeshBasicMaterial({
  color: 0x999999,
  map: loader.load("assets/textures/cobble.jpg"),
});
const plane = new THREE.Mesh(plane_Geometry, plane_Material);
scene.add(plane);
plane.position.set(0, -2, 0);
plane.rotateX(-1.570796);
//light so i can see the model textures
const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);
const gltf_Loader = new GLTFLoader();
function Init(): void {
  //pistol gemoetry, material and mesh
  gltf_Loader.load("/assets/models/pistol.glb", (gltf) => {
    weapon = gltf.scene;
    weapon.scale.set(0.75, 0.75, 0.75);
    camera.add(weapon);
    weapon.position.set(1, -0.25, -1.25);
  });
  scene.add(enemyPlayer);
}
const lazerShotMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

// keps track of button presses to trigger actions
let keys: { [key: string]: boolean } = {};

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

document.addEventListener("click", shoot);

//locks camera control
document.addEventListener("click", () => {
  controls.lock();
});

function keyboardControls(): void {
  player.xAxis = camera.position.x;
  player.yAxis = camera.position.y;
  player.zAxis = camera.position.z;
  document.getElementById("x")!.innerText = "x : ".concat(
    player.xAxis.toFixed(2)
  );
  document.getElementById("y")!.innerText = "y : ".concat(
    player.yAxis.toFixed(2)
  );
  document.getElementById("z")!.innerText = "z : ".concat(
    player.zAxis.toFixed(2)
  );
  document.getElementById("health")!.innerText = "health : ".concat(
    player.health
  );
  if (keys["w"] || keys["W"]) {
    controls.moveForward(moveSpeed);
  }
  if (keys["s"] || keys["S"]) {
    controls.moveForward(-moveSpeed);
  }
  if (keys["a"] || keys["A"]) {
    controls.moveRight(-moveSpeed);
  }
  if (keys["d"] || keys["D"]) {
    controls.moveRight(moveSpeed);
  }
  if (keys[" "]) {
    switch (isJumping) {
      case true:
        keys[" "] = false;
        break;
      case false:
        isJumping = true;
        verticalVelocity = 0.4;
        keys[" "] = false;
        break;
    }
  }
}

function checkColision() {}

function shoot() {
  const directionVector = new THREE.Vector3();
  camera.getWorldDirection(directionVector);
  const a = directionVector.x;
  const b = directionVector.y;
  const c = directionVector.z;
  const lazerStartPoint = new THREE.Vector3();
  weapon.getWorldPosition(lazerStartPoint);
  let x0: number = lazerStartPoint!.x;
  let y0: number = lazerStartPoint!.y;
  let z0: number = lazerStartPoint!.z;

  const numPoints = 2;
  const tRange = 100;
  const step = tRange / numPoints;

  const points = [];

  for (let t = 0; t <= tRange; t += step) {
    const x = x0 + a * t;
    const y = y0 + b * t;
    const z = z0 + c * t;
    points.push(new THREE.Vector3(x, y, z));
  }

  const lazerGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const lazerMaterial = new THREE.LineBasicMaterial({ color: 0x00b39e });
  const line: THREE.Object3D = new THREE.Line(lazerGeometry, lazerMaterial);

  scene.add(line);
}

function keepInBounds(): void {
  if (camera.position.x > 50) {
    camera.position.x = -49;
  }
  if (camera.position.z > 50) {
    camera.position.z = -49;
  }
  if (camera.position.x < -50) {
    camera.position.x = 49;
  }
  if (camera.position.z < -50) {
    camera.position.z = 49;
  }
}

function animate(): void {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  keyboardControls();
  keepInBounds();
  //playerMovment(players);
  if (isJumping) {
    verticalVelocity -= gravity;
    controls.getObject().position.y += verticalVelocity;

    // If camera reaches the ground, stop jumping
    if (controls.getObject().position.y < 0) {
      isJumping = false;
      controls.getObject().position.y = 0;

      verticalVelocity = 0;
    }
  }
}

Init();
animate();

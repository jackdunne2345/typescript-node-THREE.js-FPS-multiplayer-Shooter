import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Prop } from "./PropStack";
import { EnemyPlayer } from "./Characters";

let cameraAngle: number = 0;

export class World {
  public readonly scene: THREE.Scene;
  public readonly world: CANNON.World;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private props: Prop[];
  public ENEMIES: EnemyPlayer[];

  private readonly skyBoxTextureArray: string[] = [
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
  ];
  private currentAnimation: () => void;

  constructor() {
    this.currentAnimation = this.MenuAnimation;
    this.ENEMIES = [];
    this.scene = new THREE.Scene();
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.z = 20;
    this.props = [];
    this.camera.position.y = 2;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.scene.add(this.camera);
    const onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    this.AddSkyBox(this.skyBoxTextureArray);
    window.addEventListener("resize", onWindowResize, false);
  }
  //for creating sky boxes in level editor, need to implement proper
  AddSkyBox(Array: string[]) {
    function createMeshArray(Array: string[]): THREE.MeshBasicMaterial[] {
      const meshArray: THREE.MeshBasicMaterial[] = Array.map((path) => {
        const texture = new THREE.TextureLoader().load(path);
        return new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.BackSide,
        });
      });
      return meshArray;
    }
    const skyBoxMesh: THREE.MeshBasicMaterial[] = createMeshArray(Array);
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1200);
    const skybox = new THREE.Mesh(skyboxGeo, skyBoxMesh);
    //add it to the prop stack once that is done
    this.scene.add(skybox);
  }
  SwitchAnimation(): void {
    this.currentAnimation =
      this.currentAnimation === this.MenuAnimation
        ? this.GameAnimation
        : this.MenuAnimation;
    if ((this.currentAnimation = this.GameAnimation)) {
      console.log("begin adding players");
      this.InitGameWorld();
    }
  }
  private InitGameWorld(): void {
    this.ENEMIES.forEach((player) => {
      console.log("Player added");
      this.scene.add(player.mesh);
      this.world.addBody(player.body);
    });
  }
  RemovePlayer(id: number): void {
    this.ENEMIES.forEach((p) => {
      if (p.interface.id === id) {
        console.log("removing player " + id + " from the scene");
        this.scene.remove(p.mesh);
        this.world.removeBody(p.body);
      }
    });
  }

  Render(): void {
    this.currentAnimation();
    this.renderer.render(this.scene, this.camera);
  }
  GameAnimation(): void {
    this.world.fixedStep();
    this.ENEMIES.forEach((player) => {
      player.syncPosition();
    });
  }

  MenuAnimation(): void {
    let camX = 70 * Math.cos(cameraAngle);
    let camZ = 70 * Math.sin(cameraAngle);
    const lookat: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    this.camera.position.set(camX, 30, camZ);
    this.camera.lookAt(lookat);
    this.renderer.render(this.scene, this.camera);
    cameraAngle += 0.002;
  }

  addProp(obj: Prop) {
    this.scene.add(obj.mesh);
    this.world.addBody(obj.body);
    this.props.push(obj);
  }
}

import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Prop } from "./PropStack";
import { EnemyPlayer } from "./Characters";
import { gState } from "./State";

let cameraAngle: number = 0;

export class World {
  public readonly SCENE: THREE.Scene;
  public readonly P_WORLD: CANNON.World;
  public CAMERA: THREE.PerspectiveCamera;
  public RENDERER: THREE.WebGLRenderer;
  private PROPS: Prop[];
  public ENEMIES: EnemyPlayer[];

  private readonly skyBoxTextureArray: string[] = [
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
    "/src/game/assets/textures/Skybox.jpg",
  ];
  private CurrentAnimation: () => void;

  constructor() {
    this.CurrentAnimation = this.MenuAnimation;
    this.ENEMIES = [];
    this.SCENE = new THREE.Scene();
    this.P_WORLD = new CANNON.World({ gravity: new CANNON.Vec3(0, -20, 0) });
    this.CAMERA = new THREE.PerspectiveCamera(
      gState.SETTINGS.setting.fov,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.CAMERA.position.z = 20;
    this.PROPS = [];
    this.CAMERA.position.y = 2;
    this.RENDERER = new THREE.WebGLRenderer();
    this.RENDERER.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.RENDERER.domElement);
    this.SCENE.add(this.CAMERA);
    const onWindowResize = () => {
      this.CAMERA.aspect = window.innerWidth / window.innerHeight;
      this.CAMERA.updateProjectionMatrix();
      this.RENDERER.setSize(window.innerWidth, window.innerHeight);
    };
    const camera = this.CAMERA;
    const changeFov = () => {
      camera.fov = gState.SETTINGS.setting.fov;
      camera.updateProjectionMatrix();
    };
    gState.SETTINGS_LISTENERS.push(changeFov);
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
    this.SCENE.add(skybox);
  }
  SwitchAnimation(): void {
    this.CurrentAnimation =
      this.CurrentAnimation === this.MenuAnimation
        ? this.GameAnimation
        : this.MenuAnimation;
  }
  private AddPlayers(): void {
    this.ENEMIES.forEach((player) => {
      console.log("Player added");
      this.SCENE.add(player.MESH);
      this.P_WORLD.addBody(player.BODY);
    });
  }
  RemovePlayer(id: number): void {
    this.ENEMIES.forEach((p) => {
      if (p.INTERFACE.id === id) {
        console.log("removing player " + id + " from the SCENE/P_WORLD");
        this.SCENE.remove(p.MESH);
        this.P_WORLD.removeBody(p.BODY);
      }
    });
  }

  Render(): void {
    this.CurrentAnimation();
    this.P_WORLD.fixedStep();
    this.RENDERER.render(this.SCENE, this.CAMERA);
    this.ENEMIES.forEach((e) => {
      e.ApplyVelocity();
      e.syncPosition();
    });
  }
  GameAnimation(): void {}

  MenuAnimation(): void {
    let camX = 70 * Math.cos(cameraAngle);
    let camZ = 70 * Math.sin(cameraAngle);
    const lookat: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    this.CAMERA.position.set(camX, 30, camZ);
    this.CAMERA.lookAt(lookat);
    cameraAngle += 0.002;
  }

  AddProp(obj: Prop) {
    this.SCENE.add(obj.MESH);
    this.P_WORLD.addBody(obj.BODY);
    this.PROPS.push(obj);
  }
}

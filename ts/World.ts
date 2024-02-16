import * as THREE from "three";
import * as CANNON from "cannon-es";
import { Prop } from "./PropStack";

export class World {
  public scene: THREE.Scene;
  public world: CANNON.World;
  public camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private props: Prop[];

  constructor() {
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
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.world.fixedStep();
    this.props.forEach((prop) => {
      prop.syncPosition();
    });
  }

  addProp(obj: Prop) {
    this.scene.add(obj.mesh);
    this.world.addBody(obj.body);
    this.props.push(obj);
  }
}

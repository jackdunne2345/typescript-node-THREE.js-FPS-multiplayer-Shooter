import { Object3D, Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Player extends Object3D {
  private gltf_Loader = new GLTFLoader();
  private health: number = 100;
  constructor() {
    super();
    this.gltf_Loader.load("/assets/models/player.glb", (gltf) => {
      gltf.scene.scale.set(0.1, 0.1, 0.1);

      this.add(gltf.scene);
    });
  }
  decreaseHealth(amount: number) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }
}

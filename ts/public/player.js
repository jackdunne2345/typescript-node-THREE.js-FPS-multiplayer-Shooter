import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export class Player extends Object3D {
    constructor() {
        super();
        this.gltf_Loader = new GLTFLoader();
        this.health = 100;
        this.gltf_Loader.load("/assets/models/player.glb", (gltf) => {
            gltf.scene.scale.set(0.1, 0.1, 0.1);
            this.add(gltf.scene);
        });
    }
    decreaseHealth(amount) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }
}

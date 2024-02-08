import * as THREE from "three";
export class GWorld {
    // private cube: THREE.Mesh;
    // private plane: THREE.Mesh;
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 20;
        this.camera.position.y = 2;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // this.cube = new THREE.Mesh(geometry, material);
        // const plane_Geometry = new THREE.PlaneGeometry(100, 100);
        // const plane_Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        // this.plane = new THREE.Mesh(plane_Geometry, plane_Material);
        // this.plane.position.set(0, -2, 0);
        // this.plane.rotateX(-1.570796);
        // this.scene.add(this.plane);
        // this.scene.add(this.cube);
        this.scene.add(this.camera);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    createProp() { }
    addToScene(obj) {
        this.scene.add(obj);
    }
}

import * as THREE from "three";
import { threeToCannon } from "three-to-cannon";
import * as CANNON from "cannon-es";
export class Prop {
    constructor(atributes) {
        this.mesh = this.createMesh(atributes);
        this.body = this.createBody(atributes, this.mesh);
    }
    createMesh(atributes) {
        let material;
        let geometry;
        let mesh;
        if (atributes.type === "PLANE") {
            geometry = new THREE.PlaneGeometry(atributes.geometry.width, atributes.geometry.height);
        }
        else if ((atributes.type = "BOX")) {
            geometry = new THREE.BoxGeometry(atributes.geometry.width, atributes.geometry.height, atributes.geometry.debth);
        }
        else {
            geometry = new THREE.BoxGeometry(atributes.geometry.width, atributes.geometry.height, atributes.geometry.debth);
        }
        if (atributes.color) {
            material = new THREE.MeshBasicMaterial({ color: atributes.color });
        }
        else {
            material = new THREE.MeshBasicMaterial();
        }
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(atributes.position.x, atributes.position.y, atributes.position.z);
        let euler = new THREE.Euler(atributes.rotation.x, atributes.rotation.y, atributes.rotation.z, "XYZ");
        mesh.quaternion.setFromEuler(euler);
        return mesh;
    }
    createBody(atributes, mesh) {
        const material = new CANNON.Material({ friction: 0 });
        let body;
        body = new CANNON.Body({
            mass: atributes.mass,
            type: atributes.dynamic ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC,
            material: material,
        });
        let result = threeToCannon(mesh);
        let { shape } = result;
        body.addShape(shape);
        body.position.set(atributes.position.x, atributes.position.y, atributes.position.z);
        body.quaternion.setFromEuler(atributes.rotation.x, atributes.rotation.y, atributes.rotation.z);
        return body;
    }
    syncPosition() {
        this.mesh.position.x = this.body.position.x;
        this.mesh.position.y = this.body.position.y;
        this.mesh.position.z = this.body.position.z;
        let vec = new CANNON.Vec3();
        this.body.quaternion.toEuler(vec);
        let euler = new THREE.Euler(vec.x, vec.y, vec.z);
        this.mesh.quaternion.setFromEuler(euler);
    }
}
export class Stack {
    constructor() {
        this.props = [];
    }
    push(item) {
        this.props.push(item);
    }
    pop() {
        return this.props.pop();
    }
    peek() {
        return this.props[this.props.length - 1];
    }
    isEmpty() {
        return this.props.length === 0;
    }
    size() {
        return this.props.length;
    }
}

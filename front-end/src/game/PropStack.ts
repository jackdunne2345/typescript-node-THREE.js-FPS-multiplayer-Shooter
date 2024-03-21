import * as THREE from "three";
import { threeToCannon } from "three-to-cannon";
import * as CANNON from "cannon-es";

export type PropAtributes = {
  id: number;
  type: String;
  geometry: {
    width: number;
    height: number;
    debth: number;
  };
  color: THREE.ColorRepresentation | null;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: { x: number; y: number; z: number };
  mass: number;
  dynamic: boolean;
};

export class Prop {
  public mesh: THREE.Mesh;
  public body: CANNON.Body;

  constructor(atributes: PropAtributes) {
    this.mesh = this.createMesh(atributes);
    this.body = this.createBody(atributes, this.mesh);
  }

  private createMesh(atributes: PropAtributes) {
    let material: THREE.MeshBasicMaterial;
    let geometry: THREE.PlaneGeometry | THREE.BoxGeometry;
    let mesh: THREE.Mesh;
    if (atributes.type === "PLANE") {
      geometry = new THREE.PlaneGeometry(
        atributes.geometry.width,
        atributes.geometry.height
      );
    } else if ((atributes.type = "BOX")) {
      geometry = new THREE.BoxGeometry(
        atributes.geometry.width,
        atributes.geometry.height,
        atributes.geometry.debth
      );
    } else {
      geometry = new THREE.BoxGeometry(
        atributes.geometry.width,
        atributes.geometry.height,
        atributes.geometry.debth
      );
    }

    if (atributes.color) {
      material = new THREE.MeshBasicMaterial({ color: atributes.color });
    } else {
      material = new THREE.MeshBasicMaterial();
    }
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      atributes.position.x,
      atributes.position.y,
      atributes.position.z
    );
    let euler = new THREE.Euler(
      atributes.rotation.x,
      atributes.rotation.y,
      atributes.rotation.z,
      "XYZ"
    );
    mesh.quaternion.setFromEuler(euler);
    return mesh;
  }

  private createBody(atributes: PropAtributes, mesh: THREE.Mesh) {
    const material = new CANNON.Material({ friction: 0, restitution: 0 });
    let body: CANNON.Body;
    body = new CANNON.Body({
      mass: atributes.mass,
      type: atributes.dynamic ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC,
      material: material,
      collisionFilterGroup: 1,
      collisionFilterMask: 2 | 3,
    });

    let result = threeToCannon(mesh);
    let { shape } = result!;
    body.addShape(shape);
    body.position.set(
      atributes.position.x,
      atributes.position.y,
      atributes.position.z
    );
    body.quaternion.setFromEuler(
      atributes.rotation.x,
      atributes.rotation.y,
      atributes.rotation.z
    );
    return body;
  }

  syncPosition() {
    this.mesh.position.x = this.body.position.x;
    this.mesh.position.y = this.body.position.y;
    this.mesh.position.z = this.body.position.z;
    let vec: CANNON.Vec3 = new CANNON.Vec3();
    this.body.quaternion.toEuler(vec);
    let euler: THREE.Euler = new THREE.Euler(vec.x, vec.y, vec.z);
    this.mesh.quaternion.setFromEuler(euler);
  }
}

export class Stack<S> {
  private props: S[];

  constructor() {
    this.props = [];
  }

  push(item: S): void {
    this.props.push(item);
  }

  pop(): S | undefined {
    return this.props.pop();
  }

  peek(): S | undefined {
    return this.props[this.props.length - 1];
  }

  isEmpty(): boolean {
    return this.props.length === 0;
  }

  size(): number {
    return this.props.length;
  }
}

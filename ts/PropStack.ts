import * as THREE from "three";
import { ShapeType, threeToCannon } from "three-to-cannon";
import * as CANNON from "cannon-es";
export type Prop = {
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

export class Props extends CANNON.Body {
  private visualProp: THREE.Object3D;
  constructor(prop: Prop) {
    super({
      mass: prop.mass,
      type: prop.dynamic ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC,
    });
    let material: THREE.MeshBasicMaterial;
    let geometry: THREE.PlaneGeometry | THREE.BoxGeometry;
    if (prop.type === "PLANE") {
      geometry = new THREE.PlaneGeometry(
        prop.geometry.width,
        prop.geometry.height
      );
    } else if ((prop.type = "BOX")) {
      geometry = new THREE.BoxGeometry(
        prop.geometry.width,
        prop.geometry.height,
        prop.geometry.debth
      );
    } else {
      geometry = new THREE.BoxGeometry(
        prop.geometry.width,
        prop.geometry.height,
        prop.geometry.debth
      );
    }
    if (prop.color) {
      material = new THREE.MeshBasicMaterial({ color: prop.color });
    } else {
      material = new THREE.MeshBasicMaterial();
    }
    this.visualProp = new THREE.Mesh(geometry, material);
    const result = threeToCannon(this.visualProp, { type: ShapeType.BOX });

    const { shape, offset } = result!;
    this.addShape(shape);
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

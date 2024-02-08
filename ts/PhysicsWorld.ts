import * as CANNON from "cannon-es";

export class PWorld {
  public world: CANNON.World;
  // public planeShape: CANNON.Box;
  // public planeBody: CANNON.Body;
  // public boxShape: CANNON.Box;
  // public boxBody: CANNON.Body;

  constructor() {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
    // this.planeShape = new CANNON.Box(new CANNON.Vec3(100, 100, 0.1));
    // this.planeBody = new CANNON.Body({
    //   mass: 0,
    //   shape: this.planeShape,
    //   type: CANNON.Body.STATIC,
    // });
    // this.planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    // this.world.addBody(this.planeBody);

    // this.boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    // this.boxBody = new CANNON.Body({
    //   mass: 5,
    //   shape: this.boxShape,
    //   type: CANNON.Body.DYNAMIC,
    // });
    // this.planeBody.position.set(0, -2, 0);
    // this.world.addBody(this.boxBody);
  }
}

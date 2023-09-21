

export class Player {
    health: number;
    xAxis: number;
    yAxis: number;
    zAxis: number;
    rotation: number
    
    
   constructor(xAxis: number, yAxis: number, zAxis: number, health: number, rotation: number) {
    this.health=health;
    this.xAxis=xAxis;
    this.yAxis=yAxis;
    this.zAxis=zAxis;
    this.rotation=rotation;
   }
   
}
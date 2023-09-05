import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Player {
    health: number;
    xAxis: number;
    yAxis: number;
    zAxis: number;
    
    
   constructor(xAxis: number, yAxis: number, zAxis: number, health: number) {
    this.health=health;
    this.xAxis=xAxis;
    this.yAxis=yAxis;
    this.zAxis=zAxis;
    
   }
}
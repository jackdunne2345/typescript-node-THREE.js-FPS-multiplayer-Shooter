import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Player } from '/player.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const moveSpeed : number = 0.25;
let isJumping : boolean = false;
let verticalVelocity : number = 0;
let player : Player=new Player(0,0,0,100);
let player2 : Player=new Player(0,1,-80,100);
let player3 : Player=new Player(0,1,-30,100);
let player4 : Player=new Player(0,1,-30,100);
let player2Model : THREE.Group;
let player3Model : THREE.Group;
let player4Model : THREE.Group;
const gravity : number= 0.02;
let weapon: THREE.Group;








/*

wrapS defines how the texture is wrapped horizontally and corresponds to U in UV mapping.


wrapT defines how the texture is wrapped vertically and corresponds to V in UV mapping.


How many times the texture is repeated across the surface,    
If repeat is set greater than 1 in either direction, 
the corresponding Wrap parameter 
should also be set to THREE.RepeatWrapping or 
THREE.MirroredRepeatWrapping to achieve the desired tiling effect.


.background defines the sky assigned it my custom texture. can take a colour, texture and "SKYBOX?????"


uses the perspectiveCamera from THREE.js. there are other cameras.
attributes are field of view, aspect ratio, near and f


this object BoxGeometry will contain all the points for the 
vertices(a point where two or more line segments meet.In this case
    the 4 corner of the box)
and fill the faces of the box


LINE: 49
a mesh needs a geometry and a material


*/
const loader = new THREE.TextureLoader();
const black_Noise_Texture = new THREE.TextureLoader().load( "assets/textures/scenebackground.jpg" );
  black_Noise_Texture.wrapS = THREE.RepeatWrapping;
  black_Noise_Texture.wrapT = THREE.RepeatWrapping;
  black_Noise_Texture.repeat.set( 1, 1 );//check this
const scene = new THREE.Scene()
  scene.background = black_Noise_Texture;
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1, 1000 );
  let camera_Position=camera.position;
const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
const controls = new PointerLockControls(camera, document.body);  
  document.body.appendChild(renderer.domElement);
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0x00ff00});
const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cube.position.set(0,1,-6);
const plane_Geometry = new THREE.PlaneGeometry(100,100);
const plane_Material = new THREE.MeshBasicMaterial({color:0x999999, map: loader.load('assets/textures/cobble.jpg'),});
const plane = new THREE.Mesh(plane_Geometry,plane_Material);
  scene.add(plane);
  plane.position.set(0,-2,0); 
  plane.rotateX(-1.570796);
//light so i can see the model textures
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
const gltf_Loader = new GLTFLoader();







// keps track of button presses to trigger actions 
let keys: { [key: string]: boolean } = {};

document.addEventListener('keydown',(event) => {
  keys[event.key] = true;
});

document.addEventListener('keyup',(event) => {
  keys[event.key]= false;
  
});

document.addEventListener('click', shoot);

//locks camera control
document.addEventListener('click', () => {
  controls.lock();
});

function keyboardControls():void{
  player.xAxis=camera.position.x;
  player.yAxis=camera.position.y;
  player.zAxis=camera.position.z;
  document.getElementById('x').innerText="x : ".concat(player.xAxis.toFixed(2))
  document.getElementById('y').innerText="y : ".concat(player.yAxis.toFixed(2))
  document.getElementById('z').innerText="z : ".concat(player.zAxis.toFixed(2))
  document.getElementById('health').innerText="health : ".concat(player.health)
  if(keys['w']){
    controls.moveForward(moveSpeed);
  }
  if(keys['s']){
    controls.moveForward(-moveSpeed);
  }
  if(keys['a']){
    controls.moveRight(-moveSpeed);
  }
  if(keys['d']){
    controls.moveRight(moveSpeed);
  }
  if(keys[" "]){
    switch(isJumping){
      case true:
        keys[" "]= false;
      break;
      case false:
        isJumping = true;
        verticalVelocity = 0.4; // initial jump velocity
        keys[" "]= false;
      break;
    }
    
  }
}









function shoot(){

}



function movePlayers():void{
  player2Model?.position.set(player2.xAxis,player2.yAxis,player2.zAxis)
  player2Model?.rotation.set(-camera.rotation.x,camera.rotation.y,-camera.rotation.z);
  player3Model?.position.set(player3.xAxis,player3.yAxis,player3.zAxis)
  player3Model?.rotation.set(-camera.rotation.x,-camera.rotation.y,-camera.rotation.z);

  player4Model?.position.set(player4.xAxis,player4.yAxis,player4.zAxis)
  player4Model?.rotation.set(-camera.rotation.x,-camera.rotation.y,-camera.rotation.z);

}



function updateObjectPosition():void {
  // Get the camera's position and direction
  const cameraPosition = camera.position.clone();
  const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
  const cameraRight = camera.getWorldDirection(new THREE.Vector3()).cross(camera.up);
  const offsetX = 2
  const distanceFromCamera = 2;
  // Calculate the new position for the object based on the camera's position, direction, and offset
  const offsetVector = cameraRight.clone().multiplyScalar(offsetX);
  const newPosition = cameraPosition.clone().add(cameraDirection.clone().multiplyScalar(distanceFromCamera)).add(offsetVector);

 
  

  
  // Set the object's position
  weapon.position.copy(newPosition);
  weapon.rotation.copy(camera.rotation)
}


//create a blue LineBasicMaterial
// const line_Material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );
// const line_Geometry = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( line_Geometry, line_Material );
// scene.add( line );


function Init() :void{
//pistol gemoetry, material and mesh
gltf_Loader.load('/assets/models/pistol.glb', (gltf) => {
  weapon = gltf.scene;
  scene.add(weapon);

  
});
//player model geometry
gltf_Loader.load('/assets/models/player.glb', (gltf) => {
  player2Model = gltf.scene;
  
  player2Model.scale.set(0.1,0.1,0.1)
  
  scene.add(player2Model);


  
});
gltf_Loader.load('/assets/models/player.glb', (gltf) => {
  player3Model = gltf.scene;
  
  player3Model.scale.set(0.1,0.1,0.1)
  
  scene.add(player3Model);


  
});
gltf_Loader.load('/assets/models/player.glb', (gltf) => {
  player4Model = gltf.scene;
  
  player4Model.scale.set(0.1,0.1,0.1)
  
  scene.add(player4Model);


  
});



}


function animate() :void{
  
  
  
	requestAnimationFrame( animate );
 
  
	renderer.render( scene, camera );
  
  movePlayers();
  keyboardControls();
  keepInBounds();
  //playerMovment(players);
  if (isJumping) {
    verticalVelocity -= gravity;
    controls.getObject().position.y += verticalVelocity;

    // If camera reaches the ground, stop jumping
    if (controls.getObject().position.y < 0) {
      isJumping = false;
      controls.getObject().position.y = 0;
      verticalVelocity = 0;
    }
  }
  updateObjectPosition();
}

function keepInBounds():void{
  if(camera.position.x>50){
    camera.position.x=-49;
  }
  if(camera.position.z>50){
    camera.position.z=-49;
  }
  if(camera.position.x<-50){
    camera.position.x=49;
  }
  if(camera.position.z<-50){
    camera.position.z=49;
  }

}

Init();
animate();




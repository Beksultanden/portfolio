/* ---------------------------------------------------------
   3D-сцена с моделью косатки (orca) которая двигается за курсором и слегка покачивается.
   это для теста, после тестировки я убрал пути к этому скрипту, или же заккоментировал пути
   --------------------------------------------------------- */


   import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('orcaCanvas');
const scene  = new THREE.Scene();
//scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth/360, 0.1, 100);
camera.position.set(0,0,6);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(canvas.clientWidth, 360);

//scene.add(new THREE.DirectionalLight(0xffffff,1).position.set(5,10,7));
//scene.add(new THREE.AmbientLight(0xffffff,.5));

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);


let whale = null;
const loader = new GLTFLoader();
loader.load('./assets/modelsss1212/scene.gltf', (gltf) => {
  whale = gltf.scene;
  whale.scale.set(1, 1, 1);  // увеличить 0.013 → 1
  whale.position.set(0, 0, 0); // центр
  scene.add(whale);
  console.log('Косатка загружена ');
});


const mouse = new THREE.Vector2(0,0);
window.addEventListener('mousemove', e=>{
  const r = canvas.getBoundingClientRect();
  mouse.x = ((e.clientX-r.left)/r.width )*2-1;
  mouse.y = -((e.clientY-r.top )/r.height)*2+1;
});



const width = canvas.clientWidth;
const height = canvas.clientHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();

renderer.setSize(width, height);

function animate(){
  requestAnimationFrame(animate);
  if(whale){
    whale.position.set(mouse.x*2.5, mouse.y*1.5, 0);
    whale.rotation.set(mouse.y*0.3, -mouse.x*0.6,
                       Math.sin(performance.now()*0.002)*0.15);
  }
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize', ()=>{
  renderer.setSize(canvas.clientWidth,360);
  camera.aspect = canvas.clientWidth/360;
  camera.updateProjectionMatrix();
});


import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
//scene.background = new THREE.Color('#f2f2f2');


const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 3); // немного ближе и выше
const viewer = document.getElementById('viewer');
const width = viewer.clientWidth;
const height = viewer.clientHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // ✅ добавили alpha
renderer.setSize(width, height);
camera.aspect = width / height;
camera.updateProjectionMatrix();
document.getElementById('viewer').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  const width = viewer.clientWidth;
  const height = viewer.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


// OrbitControls — управление мышкой
let isInsideAirspace = false;
const container = document.querySelector('.airspace-container');
container.addEventListener('mouseenter', () => isInsideAirspace = true);
container.addEventListener('mouseleave', () => isInsideAirspace = false);



const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

container.addEventListener('mousemove', (event) => {
  if (!isInsideAirspace) return;

  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  targetX = (x / rect.width) * 2 - 1;
  targetY = -(y / rect.height) * 2 + 1;

  lastMoveTime = Date.now();
});


// Свет
const light = new THREE.DirectionalLight(0xffffff, 5);
light.position.set(1, 1, 1);
scene.add(light);

// Загрузка модели
const loader = new GLTFLoader();
let mixer;
const clock = new THREE.Clock();

let airplane;
let propeller;

loader.load('assets/models/scene.gltf', function (gltf) {
  gltf.scene.scale.set(8, 8, 8);

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const center = box.getCenter(new THREE.Vector3());
  gltf.scene.position.sub(center);

  airplane = gltf.scene;

const textureLoader = new THREE.TextureLoader();

// Загрузка текстуры в ручную так как автоматически не появился 
const diffuseMap = textureLoader.load('assets/models/textures/material_0_diffuse.png');
const normalMap = textureLoader.load('assets/models/textures/material_0_normal.png');
const aoMap     = textureLoader.load('assets/models/textures/material_0_occlusion.png');
const specMap   = textureLoader.load('assets/models/textures/material_0_specularGlossiness.png');

// Замена материала
gltf.scene.traverse((node) => {
  if (node.isMesh) {
    node.material = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      normalMap: normalMap,
      aoMap: aoMap,
      metalness: 0.2,
      roughness: 0.4
    });

    //  Указал 2-й UV set для AO
    node.geometry.attributes.uv2 = node.geometry.attributes.uv;
  }
});

  scene.add(airplane);

  // Искал винт по имени, для того чтобы оставит только винт, и убрать остальные анимации
  gltf.scene.traverse((node) => {
    if (node.name === 'Propellor_Joint.9_9') {
      propeller = node;
    } else if (node.isMesh) {
      node.matrixAutoUpdate = false; // Отключение обновление трансформации
    }
  });

  // Запустил только idle анимацию
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(gltf.scene);
    const idleClip = gltf.animations.find(clip => clip.name === 'idle');
    if (idleClip) {
      mixer.clipAction(idleClip).play();
    }
  }
});


let targetX = 0;
let targetY = 0;
let mouseX = 0;
let mouseY = 0;

let lastMoveTime = Date.now();
let returnDelay = 10; // 20 секунд

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Анимация
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  const now = Date.now();

  // автозакрут после бездействия
  if (now - lastMoveTime > returnDelay) {
    targetX += (0 - targetX) * 0.02;
    targetY += (0 - targetY) * 0.02;
  }

  if (airplane) {
    // Расчёт желаемой позиции
    let nextX = targetX * 2;
    let nextY = targetY * 1.5;

    // Ограничивание X и Y чтобы самолет не улетал
    nextX = Math.max(-2.5, Math.min(2.5, nextX)); // рамки по ширине
    nextY = Math.max(-1.5, Math.min(1.5, nextY)); // рамки по высоте

    // Плавное движение к цели 
    airplane.position.x += (nextX - airplane.position.x) * 0.05;
    airplane.position.y += (nextY - airplane.position.y) * 0.05;

    airplane.rotation.z = -targetX * 0.5;
    airplane.rotation.x = targetY * 0.3;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();





/* ----------------------------------------------------------
   Кратко о скрипте заметка для себя 
   1. Создаём сцену Three.js, камеру и мягкий свет.
   2. Подключаем OrbitControls  можно крутить масштабировать мышью.
   3. GLTFLoader загружает 3-D модель Земли (scene.gltf).
       Модель автоматически центрируется в кадре.
       Если в файле есть анимации, они сразу запускаются.
   4. В цикле animate() каждый кадр:
       обновляем анимации,
       чуть-чуть вращаем Землю,
       рендерим сцену.
   В конце получился, медленно вращающуюся Земля,
   которой можно управлять мышью и тачпадом.
---------------------------------------------------------- */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const canvas = document.getElementById('earthCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / 360, 0.1, 100);
camera.position.set(0, 0, 5);



// здесь то мы размер остов под орг модель
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
camera.aspect = canvas.clientWidth / canvas.clientHeight;
camera.updateProjectionMatrix();
/* */
/*
window.addEventListener('resize', () => {
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
});
 */

// Свет
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.zoomSpeed = 0.5;
controls.rotateSpeed = 0.4;
//  target  после загрузки


// Загрузка модели Земли
const loader = new GLTFLoader();
let earth;

let mixer;
const clock = new THREE.Clock();

loader.load('assets/earth_models/scene.gltf', (gltf) => {
  earth = gltf.scene;
  earth.scale.set(1.5, 1.5, 1.5);
  scene.add(earth);

  // Центрируем модель
  const box = new THREE.Box3().setFromObject(earth);
  const center = box.getCenter(new THREE.Vector3());
  earth.position.sub(center); // центрируем модель
  camera.lookAt(center);              // камера точно направлена
  controls.target.copy(center);      // центр вращения совпадает
  controls.update();


  // Настраиваем OrbitControls
  controls.target.copy(center); // фокус на центр модели
  controls.update();

  // Анимации
  if (gltf.animations.length) {
    mixer = new THREE.AnimationMixer(earth);
    gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    console.log('Animations started:', gltf.animations.map(a => a.name));
  }
});


// Анимация
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  if (earth) earth.rotation.y += 0.003;
  renderer.render(scene, camera);
}

animate();

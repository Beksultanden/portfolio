




document.addEventListener('DOMContentLoaded', () => {

  // 1. прячем ссылку, если текста и так мало
  document.querySelectorAll('.service').forEach(card => {
      const para = card.querySelector('.description');
      const link = card.querySelector('.read-more');

      if (para.scrollHeight <= para.clientHeight + 2) { // +2 — маленький «запас»
          link.style.display = 'none';
      }

      // 2. вешаем обработчик клика
      link?.addEventListener('click', e => {
          e.preventDefault();

          para.classList.toggle('expanded');

          // меняем подпись и иконку
          if (para.classList.contains('expanded')) {
              link.innerHTML = 'Read Less <i class="ri-arrow-down-line"></i>';
          } else {
              link.innerHTML = 'Read More <i class="ri-arrow-right-up-line"></i>';
              // Скроллим так, чтобы заголовок карточки снова был хорошо виден
              card.scrollIntoView({behavior: 'smooth', block: 'start'});
          }
      });
  });

});




document.addEventListener('DOMContentLoaded', () => {

  const aboutBox  = document.querySelector('.about-text');
  const aboutLink = document.querySelector('.about-toggle');

  // если текст короткий, ссылку прячем
  if (aboutBox.scrollHeight <= aboutBox.clientHeight + 2) {
      aboutLink.style.display = 'none';
  }

  aboutLink.addEventListener('click', e => {
      e.preventDefault();
      aboutBox.classList.toggle('expanded');

      if (aboutBox.classList.contains('expanded')) {
          aboutLink.innerHTML = 'Read Less <i class="ri-arrow-down-line"></i>';
      } else {
          aboutLink.innerHTML = 'Read More <i class="ri-arrow-right-up-line"></i>';
          // плавно возвращаемся к началу секции
          aboutBox.parentElement.scrollIntoView({
              behavior: 'smooth', block: 'start'
          });
      }
  });

});


/*
document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('cubeCanvas');
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / 300, 0.1, 100);
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(canvas.clientWidth, 300);
  renderer.setPixelRatio(window.devicePixelRatio);

  // создаём разноцветные стороны
  const materials = ['#ff3e3e','#ffea00','#009bff','#00ff91','#ff8400','#ffffff']
    .map(c => new THREE.MeshBasicMaterial({color:c}));

  const geometry  = new THREE.BoxGeometry(1.5,1.5,1.5);
  const cube      = new THREE.Mesh(geometry, materials);
  scene.add(cube);

  // анимация
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.015;
    renderer.render(scene, camera);
  }
  animate();

  // адаптация на resize
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, 300);
    camera.aspect = canvas.clientWidth / 300;
    camera.updateProjectionMatrix();
  });
});

*/

/*
import * as THREE from 'three';

const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// animation

function animate( time ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}
*/


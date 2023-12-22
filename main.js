import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    // Calcular a posição do mouse relativa à cena
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Atualizar o raycaster com a posição do mouse
    raycaster.setFromCamera(mouse, camera);

    // Calcular objetos que estão intersectando o raio lançado
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {

      if (intersects[0].object === textMesh) {
        // Mova ou altere o textMesh como desejado
        textMesh.position.x += 1; // Exemplo: move o texto para a direita
    }
        // intersects[0].object é o objeto mais próximo que foi clicado
        // Aqui, você pode adicionar a lógica para manipular o objeto, por exemplo:
        console.log('Objeto clicado:', intersects[0].object);
    }
}

window.addEventListener('click', onMouseClick);

const light = new THREE.AmbientLight(0xffffff); // luz branca suave
scene.add(light);

const loader = new FontLoader();
let textMesh; // Declarar a variável aqui

const linhas = [
  "O Salão Loha deseja",
  "um Feliz Natal e",
  "um excelente ano novo"
];

loader.load('/fonts/SourceCodePro_Bold.json', function (font) {
  const alturaLinha = 1.5; // Ajuste conforme necessário
  let yOffset = 0;

  linhas.forEach(linha => {
      const textGeometry = new TextGeometry(linha, {
          font: font,
          size: 1,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelSize: 0.02,
          bevelThickness: 0.13,
      });

      const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 }); 
      const light = new THREE.DirectionalLight(0xffffff, 1);// Vermelho
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-2, yOffset, 0); // Posicionar o texto
      scene.add(textMesh);

      yOffset -= alturaLinha; // Move para baixo para a próxima linha
  });
});

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // Verificar se textMesh foi carregado
  if (textMesh) {
      textMesh.position.y += Math.sin(Date.now() * 0.001) * 0.001;
  }

  renderer.render(scene, camera);
}

animate();

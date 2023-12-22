import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff); // luz branca suave
scene.add(light);

const loader = new FontLoader();
let textMesh; // Declarar a variável aqui

loader.load('/fonts/SourceCodePro_Bold.json', function (font) {
    const textGeometry = new TextGeometry('O Salão Loha deseja um Feliz Natal e um excelente ano novo', {
        font: font,
        size: 1,
        height: 0.2
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Vermelho
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-2, 0, 0); // Posicionar o texto
    scene.add(textMesh);
});

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  // Verificar se textMesh foi carregado
  if (textMesh) {
      textMesh.position.y += Math.sin(Date.now() * 0.001) * 0.001;
  }

  renderer.render(scene, camera);
}

animate();

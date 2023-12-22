import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


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

const particulasCount = 10000; // Número de partículas
const posicoes = new Float32Array(particulasCount * 3); // x, y, z para cada partícula

for (let i = 0; i < particulasCount * 3; i++) {
    // Posições aleatórias
    posicoes[i] = (Math.random() - 0.5) * 50; // Ajuste o intervalo conforme necessário
}

const particulasGeometry = new THREE.BufferGeometry();
particulasGeometry.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));

const cores = new Float32Array(particulasCount * 3); // R, G, B para cada partícula

for (let i = 0; i < particulasCount * 3; i++) {
    // Cores aleatórias
    cores[i] = Math.random();
}

particulasGeometry.setAttribute('color', new THREE.BufferAttribute(cores, 3));

const particulasMaterial = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true
});

const sistemaParticulas = new THREE.Points(particulasGeometry, particulasMaterial);
scene.add(sistemaParticulas);

const ambientLight = new THREE.AmbientLight(0xffa07a, 0.7); // Luz ambiente em tom quente
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffd700, 0.5); // Luz direcional dourada
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);


// Models

const loaderModels = new GLTFLoader();
const modelos = ['tree.glb', 'gift.glb', 'noel-hat.glb'];
const instancias = [];

// Carregamento dos modelos
modelos.forEach((modelo) => {

    loaderModels.load(`./img/${modelo}`, (gltf) => {

        for (let i = 0; i < 10; i++) {
            const instancia = gltf.scene.clone();

            // Definindo propriedades aleatórias
            const amplitudePosicao = 10; 
            instancias.forEach((instancia) => {
              // Define posições iniciais aleatórias dentro da amplitude definida
              instancia.position.x = (Math.random() - 0.5) * amplitudePosicao;
              instancia.position.y = (Math.random() - 0.5) * amplitudePosicao;
              instancia.position.z = (Math.random() - 0.5) * amplitudePosicao;
          });
          
            instancia.position.set(Math.random(), Math.random(), Math.random());

            instancia.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            const escala = Math.random() * 0.15 + 0.1;
            instancia.scale.set(escala, escala, escala);
            
            // Armazenar informações adicionais para animação
            instancia.userData = {
                velocidade: Math.random(),
                rotacao: new THREE.Vector3(Math.random(), Math.random(), Math.random())
            };

            instancias.push(instancia);
            scene.add(instancia);
        }
    });
});

// Função de animação



camera.position.z = 5;
let tempoAnterior = 0;
function animate(tempoAtual) {

  tempoAtual *= 0.001; // converte o tempo de milissegundos para segundos
  const deltaTime = tempoAtual - tempoAnterior; // calcula o tempo passado
  tempoAnterior = tempoAtual; // atualiza o tempo anterior para o próximo quadro
  requestAnimationFrame(animate);
  controls.update();
  // Verificar se textMesh foi carregado
  if (textMesh) {
      textMesh.position.y += Math.sin(Date.now() * 0.001) * 0.001;
  }

 

  instancias.forEach((instancia) => {
    if (!instancia.userData.direcao) {
        instancia.userData.direcao = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
    }

    instancia.position.x += instancia.userData.direcao.x * deltaTime;
    instancia.position.y += instancia.userData.direcao.y * deltaTime;
    instancia.position.z += instancia.userData.direcao.z * deltaTime;
});


  sistemaParticulas.rotation.y += 0.01;
  renderer.render(scene, camera);
}

animate();

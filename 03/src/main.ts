import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class App3 {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private car: THREE.Mesh | undefined;
  private track: THREE.Mesh | undefined;
  private speed: number = 0.1; // 카 속도

  constructor() {
    // 씬, 카메라, 렌더러 설정
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5); // 초기 카메라 위치

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.createTrack();
    this.createCar();
    this.setupControls();
    this.createBackgroundObjects()

    // 애니메이션 루프 시작
    this.animate();
  }

  private createTrack() {
    const geometry = new THREE.PlaneGeometry(10, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x008800, side: THREE.DoubleSide });
    this.track = new THREE.Mesh(geometry, material);
    this.track.rotation.x = -Math.PI / 2; // 수평으로 놓기
    this.track.position.y = 0; // 트랙의 높이 설정
    this.scene.add(this.track);
  }

  private createCar() {
    const loader = new GLTFLoader(); // GLTF 로더 인스턴스 생성
    loader.load('models/scene.gltf', (gltf) => {
      this.car = gltf.scene as THREE.Mesh; // GLTF 모델을 Mesh로 설정
      this.car.position.set(0, 0.1, 0); // 모델의 초기 위치 설정
      this.car.scale.set(0.5, 0.5, 0.5); // 모델 스케일 조정 (필요 시)
      this.scene.add(this.car);
    }, undefined, (error) => {
      console.error(error); // 로딩 오류 처리
    });
  }

  private setupControls() {
    window.addEventListener('keydown', (event) => {
      if (this.car) {
        if (event.key === 'ArrowUp') this.car.position.z -= this.speed; // 앞쪽으로 이동
        if (event.key === 'ArrowDown') this.car.position.z += this.speed; // 뒤쪽으로 이동
        if (event.key === 'ArrowLeft') this.car.rotation.y += 0.1; // 왼쪽으로 회전
        if (event.key === 'ArrowRight') this.car.rotation.y -= 0.1; // 오른쪽으로 회전
      }
    });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    // 카메라가 자동차를 따라가도록 설정
    if (this.car) {
      this.camera.position.x = this.car.position.x;
      this.camera.position.z = this.car.position.z + 5; // 자동차 앞쪽으로 카메라 위치 설정
      this.camera.lookAt(this.car.position); // 카메라가 자동차를 바라보도록 설정
    }

    this.renderer.render(this.scene, this.camera);
  }

  private createBackgroundObjects() {
    const geometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  
    for (let i = -4; i <= 4; i += 2) {
      const tree = new THREE.Mesh(geometry, material);
      tree.position.set(i, 0.25, -10); // 트리의 위치 설정
      this.scene.add(tree);
    }
  }
}

new App3();

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
  private mixer: THREE.AnimationMixer | undefined; // 애니메이션 믹서
  private clock: THREE.Clock; // 시간 관리를 위한 시계

  private trackInstances: THREE.Mesh[] = []; // 도로 트랙 복제본 배열
  private trackLength: number = 100; // 각 트랙의 길이

  constructor() {
    // 씬, 카메라, 렌더러 설정
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0x87CEEB);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5); // 초기 카메라 위치

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // 조명 추가
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1-40, 1).normalize();
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 50); // 은은한 조명 추가
    this.scene.add(ambientLight);

    this.clock = new THREE.Clock(); // 시계 초기화

    this.createCar();
    this.createTrack();
    this.createCube();
    this.setupControls();

    // 이벤트 리스너 추가
    window.addEventListener('resize', this.onWindowResize, false);

    // 애니메이션 루프 시작
    this.animate();
  }

  private createCube() {
    const geometry = new THREE.BoxGeometry(100, 100, 100); // 큐브 지오메트리 생성

    // 텍스처 로더 인스턴스 생성
    const textureLoader = new THREE.TextureLoader();
    
    // 각 면에 사용할 텍스처 이미지 경로
    const texture = textureLoader.load('models/bg/sky.jpg'); // 하늘 이미지 경로

    // 큐브의 각 면에 텍스처를 적용
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // 앞면
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // 뒷면
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // 윗면
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // 아랫면
        new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide }), // 왼쪽면
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide })  // 오른쪽면
    ];

    const cube = new THREE.Mesh(geometry, materials); // 큐브 메쉬 생성

    this.scene.add(cube); // 씬에 큐브 추가
  
    // 카메라를 큐브의 중앙에 배치
    this.camera.position.set(0, -17, 5); // 카메라의 위치
    this.camera.lookAt(0, -19, 0); // 카메라가 바라보는곳
}


  private onWindowResize = () => {
    // 브라우저 크기 조정 시 카메라와 렌더러 크기 업데이트
    const width = window.innerWidth - 30; // 5px 줄이기
    const height = window.innerHeight - 10; // 5px 줄이기
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix(); // 카메라의 투영 행렬 업데이트
    this.renderer.setSize(width, height); // 렌더러의 크기 조정
};

  private createTrack() {
    const geometry = new THREE.PlaneGeometry(10, this.trackLength);
    
    // 텍스처 로더 인스턴스 생성
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('models/path/path.jpg'); // 텍스처 이미지 경로
    texture.wrapS = THREE.RepeatWrapping; // 텍스처를 반복할 수 있도록 설정
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 5); // X축으로 1회, Y축으로 5회 반복
    
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  
    for (let i = 0; i < 3; i++) {
      const track = new THREE.Mesh(geometry, material);
      track.rotation.x = -Math.PI / 2;
      track.position.set(0, -20, -i * this.trackLength);
      this.scene.add(track);
      this.trackInstances.push(track);
    }
  }

  private createCar() {
    const loader = new GLTFLoader(); // GLTF 로더 인스턴스 생성
    loader.load('models/player/cac.gltf', (gltf) => {
      this.car = gltf.scene as THREE.Mesh; // GLTF 모델을 Mesh로 설정
      this.car.position.set(0, -19, 0); // 모델의 초기 위치 설정
      this.car.scale.set(0.01, 0.01, 0.01); // 모델 스케일 조정 (필요 시)
      this.car.rotation.y += Math.PI;
      this.scene.add(this.car);

      // 애니메이션 믹서 생성 및 애니메이션 재생 설정
      this.mixer = new THREE.AnimationMixer(this.car);
      gltf.animations.forEach((clip) => {
        this.mixer.clipAction(clip).play();
      });
      
    }, undefined, (error) => {
      console.error(error); // 로딩 오류 처리
    });
  }
  
  private setupControls() {
    window.addEventListener('keydown', (event) => {
      if (this.car) {
        // if (event.key === 'ArrowUp') this.car.position.z -= this.speed; // 앞쪽으로 이동
        // if (event.key === 'ArrowDown') this.car.position.z += this.speed; // 뒤쪽으로 이동
        if (event.key === 'ArrowLeft') this.car.position.x -= this.speed; // 왼쪽으로 회전
        if (event.key === 'ArrowRight') this.car.position.x += this.speed; // 오른쪽으로 회전
      }
    });
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
  
    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }
  
    // 자동차는 고정된 위치에 두고, 트랙을 자동차가 보는 방향으로 이동
    if (this.car) {
      // 자동차의 Z 위치에 따라 트랙을 아래로 이동
      for (const track of this.trackInstances) {
        track.position.z += this.speed; // 트랙을 Z축 방향으로 이동
      }
  
      // 자동차가 첫 번째 트랙의 끝에 가까워지면 마지막 트랙을 재활용
      const firstTrack = this.trackInstances[0];
      if (this.car.position.z < firstTrack.position.z - this.trackLength / 10) {
        const lastTrack = this.trackInstances.pop(); // 마지막 트랙을 재활용
        if (lastTrack) {
          lastTrack.position.z = firstTrack.position.z - this.trackLength; // 트랙을 연결된 위치로 이동
          this.trackInstances.unshift(lastTrack); // 재배치한 트랙을 맨 앞에 추가
        }
      }
    }
  
    // 카메라가 자동차를 따라가도록 설정
    // if (this.car) {
    //   this.camera.position.x = this.car.position.x;
    //   this.camera.position.z = this.car.position.z + 5;
    //   this.camera.lookAt(this.car.position);
    // }
  
    this.renderer.render(this.scene, this.camera);
  }
}

new App3();

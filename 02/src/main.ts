import './style.css'
import * as THREE from 'three'

class App2 {
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private player: THREE.Mesh | undefined
  private obstacles: THREE.Mesh[] = []

  constructor() {
    console.log("Hello three.js")

    // 씬, 카메라, 렌더러 설정
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5 // 카메라 위치 조정

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.setupLight() // 조명 추가
    this.createPlayer()
    this.createObstacles(5) // 장애물 5개 생성
    this.setupControls()

    // 애니메이션 루프 시작
    this.animate()
  }

  private setupLight() {
    const color = 0xffffff // 흰색 조명
    const intensity = 1 // 강도
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(1, 1, 1) // 조명 위치
    this.scene.add(light) // 씬에 조명 추가
  }

  private createPlayer() {
    const geometry = new THREE.SphereGeometry(0.2, 32, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    this.player = new THREE.Mesh(geometry, material)
    this.player.position.z = 0 // 플레이어의 위치 조정
    this.scene.add(this.player)
  }

  private createObstacles(count: number) {
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      const obstacle = new THREE.Mesh(geometry, material)
      obstacle.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 5 + 2) // 랜덤 위치
      this.scene.add(obstacle)
      this.obstacles.push(obstacle)
    }
  }

  private setupControls() {
    window.addEventListener('keydown', (event) => {
      if (this.player) { // player가 초기화된 경우에만 위치를 변경
        if (event.key === 'ArrowLeft') this.player.position.x -= 0.1
        if (event.key === 'ArrowRight') this.player.position.x += 0.1
        if (event.key === 'ArrowUp') this.player.position.y += 0.1
        if (event.key === 'ArrowDown') this.player.position.y -= 0.1
      }
    })
  }

  private update(time: number) {
    this.obstacles.forEach(obstacle => {
      obstacle.position.z -= 0.05 // 장애물 이동 속도 조정
      if (obstacle.position.z < -2) {
        obstacle.position.set(Math.random() * 4 - 2, Math.random() * 2 - 1, Math.random() * 5 + 2) // 새로운 위치로 리셋
      }

      const distance = this.player?.position.distanceTo(obstacle.position) || 0
      if (distance < 0.35) {
        alert("Game Over!")
        // 장애물 리셋
        this.obstacles.forEach(ob => ob.position.z = 2)
      }
    })
  }

  private animate = (time: number = 0) => {
    requestAnimationFrame(this.animate)
    this.update(time)
    this.renderer.render(this.scene, this.camera)
  }
}

new App2()

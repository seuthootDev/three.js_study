import './style.css'
import * as THREE from 'three'

class App{
  private renderer: THREE.WebGLRenderer   // 앱 안에서만 참조되게 프라이빗
  private domApp: Element
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera
  private cube?: THREE.Mesh

  constructor(){    // 생성자
    console.log("Hello three.js")
    this.renderer = new THREE.WebGLRenderer ({antialias: true})
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

    this.domApp = document.querySelector('#app')!
    this.domApp.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }

  private setupCamera(){
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100)///카메라 가로 세로 위치
    
    this.camera.position.z = 2
  }

  private setupLight(){
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1,2,4)

    this.scene.add(light)
  }

  private setupModels(){
    const geometry = new THREE.BoxGeometry(1,1,1) // 가로세로깊이
    const material = new THREE.MeshPhongMaterial({color : 0x44aa88})

    this.cube = new THREE.Mesh(geometry,material)
    this.scene.add(this.cube)
  }

  private setupEvents(){
    window.onresize = this.resize.bind(this)
    this.resize()
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  private resize(){
    const width = this.domApp.clientWidth
    const height = this.domApp.clientHeight

    const camera = this.camera
    if(camera){
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
  }

  private update(time: number){
    time *= 0.001

    const cube = this.cube

    if(cube){
      cube.rotation.x = time
      cube.rotation.y = time
    }
  }

  private render(time : number){
    console.log(time)
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()
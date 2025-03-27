import * as THREE from 'three'


const { log: l } = console

let index = 1

class Galaxy {
  #geometry;
  #material;
  #points = null;

  static defaultParameters = {
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    position: [0, 0, 0],
    rotation: 0,
    debug: false,
    guiInstance: false
  }

  constructor(scene, options = {}) {
    this.params = { ...Galaxy.defaultParameters, ...options };
    this.scene = scene

    this.#generateGalaxy()
    this.#initGui()

    index++;

    return this.#points
  }

  #initGui() {
    if (!this.params.debug) return;
    if (!this.params.guiInstance) return;

    const folder = this.params.guiInstance.addFolder(`Galaxy ${index}`)

    folder.add(this.params.position, '0').min(-5).max(5).step(0.1).name('X').onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params.position, '1').min(-5).max(5).step(0.1).name('Y').onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params.position, '2').min(-5).max(5).step(0.1).name('Z').onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'rotation').min(-5).max(5).step(0.01).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'count').min(100).max(500000).step(100).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'radius').min(0.01).max(20).step(0.01).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'branches').min(2).max(20).step(1).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'spin').min(-1).max(3).step(0.1).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'randomness').min(0).max(2).step(0.01).onFinishChange(() => { this.#generateGalaxy() })
    folder.add(this.params, 'randomnessPower').min(1).max(5).step(0.1).onFinishChange(() => { this.#generateGalaxy() })
    folder.addColor(this.params, 'insideColor').onFinishChange(() => { this.#generateGalaxy() })
    folder.addColor(this.params, 'outsideColor').onFinishChange(() => { this.#generateGalaxy() })
  }

  #createGeometry() {
    this.#geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(this.params.count * 3)
    const colors = new Float32Array(this.params.count * 3)

    const colorInside = new THREE.Color(this.params.insideColor)
    const colorOutside = new THREE.Color(this.params.outsideColor)

    for (let i = 0; i < this.params.count; i++) {
      const i3 = i * 3
      const radius = Math.random() * this.params.radius

      // Position
      const { x, y, z } = this.#getPosition(i, radius)

      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / this.params.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }
    l(positions)

    this.#geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.#geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  #getPosition(index, radius) {
    const spinAngle = radius * this.params.spin
    const branchAngle = (index % this.params.branches) / this.params.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), this.params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomY = Math.pow(Math.random(), this.params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), this.params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

    return {
      x: Math.cos(branchAngle + spinAngle) * radius + randomX,
      y: randomY,
      z: Math.sin(branchAngle + spinAngle) * radius + randomZ
    }
  }

  #createMaterial() {
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/textures/particles/4.png')

    this.#material = new THREE.PointsMaterial({
      transparent: true,
      alphaMap: texture,
      size: this.params.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,

    })
  }

  #destroy() {
    if (this.#points !== null) {
      this.#geometry.dispose()
      this.#material.dispose()
      this.scene.remove(this.#points)
    }
  }

  #setPosition() {
    this.#points.position.set(...this.params.position)
  }

  #setRotation() {
    this.#points.rotation.set(this.params.rotation, 0, this.params.rotation)
  }

  #generateGalaxy() {
    this.#destroy()
    this.#createGeometry()
    this.#createMaterial()

    this.#points = new THREE.Points(this.#geometry, this.#material)
    this.#setPosition()
    this.#setRotation()

    this.scene.add(this.#points)
  }

  getGalaxy() {
    return this.#points;
  }
}

export { Galaxy }
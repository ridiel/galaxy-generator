import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Galaxy } from './galaxy'

const { log: l } = console


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const galaxiesParams = {
    count: 10
}

const getRandomNumber = (min, max) => {
    return Math.random() * (max - min) + min
}

function randomizeGalaxies() {
    for (let i = 0; i < galaxiesParams.count; i++) {
        new Galaxy(scene, {
            //debug: true,
            //guiInstance: gui,
            position: [
                Math.random() * (Math.random() < 0.5 ? -1 : 1) * 5,
                Math.random() * (Math.random() < 0.5 ? -1 : 1) * 5,
                Math.random() * (Math.random() < 0.5 ? -1 : 1) * 5
            ],
            rotation: Math.random() * (Math.random() < 0.5 ? -1 : 1) * Math.PI * 2,
            spin: Math.random() * 2 * (Math.random() < 0.5 ? -1 : 1),
            size: Math.random() * 0.04 + 0.01,
            branches: parseInt(getRandomNumber(2, 6)),
            radius: getRandomNumber(1, 8),
            randomnessPower: getRandomNumber(1.5, 3),
        });
    }
}

randomizeGalaxies()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 6
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.005


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
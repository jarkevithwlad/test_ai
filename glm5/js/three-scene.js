/**
 * Three.js 3D Scene
 * Interactive background with geometric shapes and particles
 */

class ThreeScene {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) {
            console.warn('Canvas element not found');
            return;
        }

        // Configuration
        this.config = {
            particles: {
                count: this.isMobile() ? 400 : 800,
                size: 0.03,
                color: 0x00D4FF,
                secondaryColor: 0x8B5CF6,
                spread: { x: 60, y: 40, z: 30 },
                speed: 0.0005,
                mouseInfluence: 0.08
            },
            shapes: {
                count: 6,
                colors: [0x00D4FF, 0x8B5CF6, 0x10B981, 0xF472B6]
            },
            camera: {
                fov: 75,
                near: 0.1,
                far: 1000,
                position: { x: 0, y: 0, z: 30 }
            }
        };

        // State
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.isRunning = true;
        this.animationId = null;

        // Initialize
        this.init();
    }

    /**
     * Check if device is mobile
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth < 768;
    }

    /**
     * Initialize the scene
     */
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createGeometricShapes();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Create Three.js scene
     */
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x0A0A0F, 0.015);
    }

    /**
     * Create camera
     */
    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            aspect,
            this.config.camera.near,
            this.config.camera.far
        );
        this.camera.position.set(
            this.config.camera.position.x,
            this.config.camera.position.y,
            this.config.camera.position.z
        );
    }

    /**
     * Create WebGL renderer
     */
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
    }

    /**
     * Create lights
     */
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Point lights for glow effect
        const pointLight1 = new THREE.PointLight(0x00D4FF, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8B5CF6, 0.8, 50);
        pointLight2.position.set(-10, -10, 5);
        this.scene.add(pointLight2);

        this.lights = { pointLight1, pointLight2 };
    }

    /**
     * Create geometric shapes (icosahedrons, octahedrons, tori)
     */
    createGeometricShapes() {
        this.shapes = [];

        const geometries = [
            () => new THREE.IcosahedronGeometry(1, 0),
            () => new THREE.OctahedronGeometry(0.8, 0),
            () => new THREE.TorusGeometry(0.5, 0.2, 8, 16),
            () => new THREE.TetrahedronGeometry(0.7, 0),
            () => new THREE.DodecahedronGeometry(0.6, 0),
            () => new THREE.TorusKnotGeometry(0.4, 0.1, 32, 8)
        ];

        const positions = [
            [-8, 3, -15],
            [7, -2, -12],
            [-5, -3, -8],
            [5, 4, -18],
            [-3, 5, -10],
            [9, 1, -20]
        ];

        for (let i = 0; i < this.config.shapes.count; i++) {
            const geometry = geometries[i % geometries.length]();
            const color = this.config.shapes.colors[i % this.config.shapes.colors.length];
            
            // Wireframe material for tech look
            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.6
            });

            const mesh = new THREE.Mesh(geometry, material);
            
            if (positions[i]) {
                mesh.position.set(...positions[i]);
            } else {
                mesh.position.set(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 15,
                    -Math.random() * 20 - 5
                );
            }

            // Random rotation speeds
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.005
                },
                floatSpeed: Math.random() * 0.002 + 0.001,
                floatOffset: Math.random() * Math.PI * 2,
                initialY: mesh.position.y
            };

            this.shapes.push(mesh);
            this.scene.add(mesh);
        }
    }

    /**
     * Create particle system with glow effect
     */
    createParticles() {
        const particleCount = this.config.particles.count;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color1 = new THREE.Color(this.config.particles.color);
        const color2 = new THREE.Color(this.config.particles.secondaryColor);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Position
            positions[i3] = (Math.random() - 0.5) * this.config.particles.spread.x;
            positions[i3 + 1] = (Math.random() - 0.5) * this.config.particles.spread.y;
            positions[i3 + 2] = (Math.random() - 0.5) * this.config.particles.spread.z - 10;

            // Color - mix between primary and secondary
            const mixRatio = Math.random();
            const mixedColor = color1.clone().lerp(color2, mixRatio);
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Size
            sizes[i] = Math.random() * this.config.particles.size + 0.01;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for glow effect
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Subtle movement
                    pos.y += sin(time + position.x * 0.1) * 0.5;
                    pos.x += cos(time + position.y * 0.1) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Circular particle with glow
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.8;
                    
                    // Glow effect
                    vec3 glow = vColor * (1.0 + alpha * 0.5);
                    
                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Store initial positions for animation
        this.particlePositions = positions.slice();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Mouse move
        window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });

        // Scroll
        window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

        // Resize
        window.addEventListener('resize', this.onResize.bind(this));

        // Visibility change - pause when tab is hidden
        document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this));
    }

    /**
     * Handle mouse movement
     */
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    /**
     * Handle scroll
     */
    onScroll() {
        this.scrollY = window.scrollY;
    }

    /**
     * Handle window resize
     */
    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Update shader uniform
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
        }
    }

    /**
     * Handle visibility change
     */
    onVisibilityChange() {
        if (document.hidden) {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        } else {
            this.isRunning = true;
            this.animate();
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const time = performance.now() * 0.001;

        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Update camera position based on mouse (parallax)
        this.camera.position.x = this.mouse.x * 3;
        this.camera.position.y = this.mouse.y * 2 + this.scrollY * 0.005;
        this.camera.lookAt(this.scene.position);

        // Animate geometric shapes
        this.shapes.forEach((shape, index) => {
            const { rotationSpeed, floatSpeed, floatOffset, initialY } = shape.userData;

            // Rotation
            shape.rotation.x += rotationSpeed.x;
            shape.rotation.y += rotationSpeed.y;
            shape.rotation.z += rotationSpeed.z;

            // Floating animation
            shape.position.y = initialY + Math.sin(time * floatSpeed * 10 + floatOffset) * 0.5;

            // Mouse influence
            shape.position.x += (this.mouse.x * 0.5 - shape.position.x * 0.01) * 0.02;
        });

        // Animate particles
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = time;

            // Rotate particle system slowly
            this.particles.rotation.y = time * this.config.particles.speed;
            this.particles.rotation.x = Math.sin(time * 0.0002) * 0.1;

            // Mouse influence on particles
            this.particles.position.x += (this.mouse.x * 2 - this.particles.position.x) * 0.01;
            this.particles.position.y += (this.mouse.y * 2 - this.particles.position.y) * 0.01;
        }

        // Animate lights
        if (this.lights) {
            this.lights.pointLight1.position.x = Math.sin(time * 0.5) * 15;
            this.lights.pointLight1.position.y = Math.cos(time * 0.3) * 10;
            this.lights.pointLight2.position.x = Math.cos(time * 0.4) * 12;
            this.lights.pointLight2.position.y = Math.sin(time * 0.6) * 8;
        }

        // Render
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Destroy the scene
     */
    destroy() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('scroll', this.onScroll.bind(this));
        window.removeEventListener('resize', this.onResize.bind(this));
        document.removeEventListener('visibilitychange', this.onVisibilityChange.bind(this));

        // Dispose geometries and materials
        this.shapes.forEach(shape => {
            shape.geometry.dispose();
            shape.material.dispose();
            this.scene.remove(shape);
        });

        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            this.scene.remove(this.particles);
        }

        // Dispose renderer
        this.renderer.dispose();
    }
}

export default ThreeScene;
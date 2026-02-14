// ============================================
// 3D Background with Three.js
// ============================================
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('3d-background');
        
        // Force canvas to be positioned correctly
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.pointerEvents = 'none';
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        
        this.particles = [];
        this.particleCount = 200;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Transparent background
        
        // Create particles
        this.createParticles();
        
        // Position camera
        this.camera.position.z = 50;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x6366f1, 0.5);
        this.scene.add(ambientLight);
        
        // Add point lights
        const pointLight1 = new THREE.PointLight(0x6366f1, 1, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x22d3ee, 1, 100);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
        
        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Start animation
        this.animate();
    }
    
    createParticles() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        
        const color1 = new THREE.Color(0x6366f1);
        const color2 = new THREE.Color(0x22d3ee);
        const color3 = new THREE.Color(0xf472b6);
        
        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            
            // Random position
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            
            // Random color
            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.33) {
                color = color1;
            } else if (colorChoice < 0.66) {
                color = color2;
            } else {
                color = color3;
            }
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Create individual particle
            const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const particleMaterial = new THREE.MeshPhongMaterial({
                color: color,
                transparent: true,
                opacity: 0.8,
                shininess: 100
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            
            // Add random velocity
            particle.userData = {
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.01
                },
                originalPosition: {
                    x: positions[i3],
                    y: positions[i3 + 1],
                    z: positions[i3 + 2]
                }
            };
            
            this.particles.push(particle);
            this.scene.add(particle);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Create connecting lines
        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.2
        });
        
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array(this.particleCount * this.particleCount * 3);
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
        
        // Store geometry for line updates
        this.particlePositions = positions;
        this.lineGeometry = lineGeometry;
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    updateLines() {
        const positions = this.lineGeometry.attributes.position.array;
        let index = 0;
        
        const maxDistance = 15;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const pos1 = this.particles[i].position;
                const pos2 = this.particles[j].position;
                
                const distance = pos1.distanceTo(pos2);
                
                if (distance < maxDistance && index < positions.length - 6) {
                    positions[index++] = pos1.x;
                    positions[index++] = pos1.y;
                    positions[index++] = pos1.z;
                    positions[index++] = pos2.x;
                    positions[index++] = pos2.y;
                    positions[index++] = pos2.z;
                }
            }
        }
        
        // Clear remaining positions
        for (let i = index; i < positions.length; i++) {
            positions[i] = 0;
        }
        
        this.lineGeometry.attributes.position.needsUpdate = true;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update particles
        this.particles.forEach((particle, index) => {
            const { velocity, originalPosition } = particle.userData;
            
            // Move particle
            particle.position.x += velocity.x;
            particle.position.y += velocity.y;
            particle.position.z += velocity.z;
            
            // Add wave motion
            particle.position.x += Math.sin(Date.now() * 0.001 + index) * 0.01;
            particle.position.y += Math.cos(Date.now() * 0.001 + index) * 0.01;
            
            // Mouse influence
            particle.position.x += this.mouseX * 0.05;
            particle.position.y += this.mouseY * 0.05;
            
            // Boundary check
            if (Math.abs(particle.position.x - originalPosition.x) > 30) {
                particle.position.x = originalPosition.x;
            }
            if (Math.abs(particle.position.y - originalPosition.y) > 30) {
                particle.position.y = originalPosition.y;
            }
            
            // Rotate particle
            particle.rotation.x += 0.01;
            particle.rotation.y += 0.01;
        });
        
        // Update connecting lines
        this.updateLines();
        
        // Slowly rotate entire scene
        this.scene.rotation.y += 0.001;
        this.scene.rotation.x += 0.0005;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ============================================
// Navigation
// ============================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menu-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.menuToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
    }
}

// ============================================
// Counter Animation
// ============================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        if (this.animated) return;
        
        const triggerPoint = window.innerHeight * 0.8;
        
        this.counters.forEach(counter => {
            const counterTop = counter.getBoundingClientRect().top;
            
            if (counterTop < triggerPoint) {
                this.animated = true;
                this.animateCounter(counter);
            }
        });
    }
    
    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    }
}

// ============================================
// Form Handling
// ============================================
class FormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message (simulated)
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        
        // Reset form
        this.form.reset();
    }
}

// ============================================
// Scroll Animations
// ============================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll(); // Initial check
    }
    
    handleScroll() {
        const triggerPoint = window.innerHeight * 0.8;
        
        this.elements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;
            
            if (elTop < triggerPoint) {
                setTimeout(() => {
                    el.classList.add('aos-animate');
                }, delay);
            }
        });
    }
}

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    [data-aos] {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    [data-aos="fade-up"] {
        transform: translateY(30px);
    }
    
    [data-aos="fade-right"] {
        transform: translateX(-30px);
    }
    
    [data-aos="fade-left"] {
        transform: translateX(30px);
    }
    
    [data-aos="zoom-in"] {
        transform: scale(0.8);
    }
    
    [data-aos].aos-animate {
        opacity: 1;
        transform: translateY(0) translateX(0) scale(1);
    }
`;
document.head.appendChild(style);

// ============================================
// Initialize All
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
    new Navigation();
    new CounterAnimation();
    new FormHandler();
    new ScrollAnimations();
});

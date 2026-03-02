// ===== 3D Background Animation =====
class Background {
    constructor() {
        this.canvas = document.getElementById('background');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        this.setupEvents();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.width * this.height) / 5000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * this.width,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(99, 102, 241, 0.5)',
            'rgba(14, 165, 233, 0.5)',
            'rgba(139, 92, 246, 0.5)',
            'rgba(236, 72, 153, 0.4)',
            'rgba(52, 211, 153, 0.4)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw connecting lines
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            // Move particle
            p1.x += p1.vx;
            p1.y += p1.vy;
            
            // Bounce off edges
            if (p1.x < 0 || p1.x > this.width) p1.vx *= -1;
            if (p1.y < 0 || p1.y > this.height) p1.vy *= -1;
            
            // Keep within bounds
            p1.x = Math.max(0, Math.min(this.width, p1.x));
            p1.y = Math.max(0, Math.min(this.height, p1.y));
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p1.color;
            this.ctx.fill();
            
            // Draw connections to nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 - distance / 1500})`;
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== Header Scroll Effect =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== GSAP Animations =====
function initAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero section animations
        gsap.from('.hero-title', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        });
        
        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            delay: 0.4
        });
        
        gsap.from('.hero-buttons', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            delay: 0.6
        });
        
        gsap.from('.hero-stats', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            delay: 0.8
        });
        
        // Services cards
        gsap.from('.service-card', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.services',
                start: 'top 80%'
            }
        });
        
        // Portfolio items
        gsap.from('.portfolio-item', {
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.portfolio',
                start: 'top 80%'
            }
        });
        
        // Process steps
        gsap.from('.process-step', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.process',
                start: 'top 80%'
            }
        });
        
        // Why us features
        gsap.from('.why-feature', {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.why-content',
                start: 'top 70%'
            }
        });
        
        // Testimonial cards
        gsap.from('.testimonial-card', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.testimonials',
                start: 'top 80%'
            }
        });
        
        // Contact form
        gsap.from('#contactForm', {
            opacity: 0,
            x: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.contact',
                start: 'top 70%'
            }
        });
        
        // Stat circles
        gsap.from('.stat-circle', {
            scale: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.why-stats',
                start: 'top 80%'
            }
        });
        
        // CTA section
        gsap.from('.cta-content', {
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.cta',
                start: 'top 80%'
            }
        });
    }
}

// ===== Form Handling =====
function initForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Спасибо за вашу заявку! Мы свяжемся с вами в ближайшее время.');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== Intersection Observer for Fade-in Elements =====
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all section headers
    document.querySelectorAll('.section-header').forEach(section => {
        observer.observe(section);
    });
}

// ===== Parallax Effect for Hero =====
function initParallax() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 50;
            mouseY = (e.clientY - window.innerHeight / 2) / 50;
        });
        
        gsap.to(heroSection.querySelectorAll('.floating-card'), {
            duration: 2,
            ease: 'power2.out',
            x: (i, target) => {
                return (targetX + (target.offsetLeft * 0.05) * Math.sign(Math.random())) * -1;
            },
            y: (i, target) => {
                return (targetY + (target.offsetTop * 0.05) * Math.sign(Math.random())) * -1;
            }
        });
    }
}

// ===== Initialize All Functions =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D background
    new Background();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize animations
    initAnimations();
    
    // Initialize form
    initForm();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize intersection observer
    initIntersectionObserver();
    
    // Initialize parallax
    initParallax();
});

// ===== Reveal on Scroll with CSS =====
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => observer.observe(el));
});

// ===== Console Easter Egg =====
console.log('%c🚀 CodeFlow - Mobile App Development', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%cМы создаем мобильные приложения, которые влюбляют пользователей', 'color: #94a3b8; font-size: 14px;');
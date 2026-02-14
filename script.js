// Инициализация AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Инициализация Three.js для 3D-эффекта фона
let scene, camera, renderer, particles;
const particleCount = 200;

function initThreeJS() {
    // Создание сцены
    scene = new THREE.Scene();
    
    // Создание камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;
    
    // Создание рендерера
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('threeCanvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Создание частиц
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    const color1 = new THREE.Color(0x6366f1); // Primary color
    const color2 = new THREE.Color(0x10b981); // Secondary color
    
    for (let i = 0; i < particleCount; i++) {
        // Случайная позиция
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 20;
        
        positions.push(x, y, z);
        
        // Случайный цвет
        const color = Math.random() > 0.5 ? color1 : color2;
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Создание материала частиц
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    // Создание системы частиц
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    
    // Добавление света
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x6366f1, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    // Обработка изменения размера окна
    window.addEventListener('resize', onWindowResize);
    
    // Запуск анимации
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Вращение частиц
    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
    }
    
    renderer.render(scene, camera);
}

// Инициализация Three.js после загрузки страницы
window.addEventListener('load', () => {
    initThreeJS();
    initParallax();
    initSmoothScroll();
});

// Мобильное меню
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Плавное изменение прозрачности хедера при скролле
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Форма обратной связи
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Получение данных формы
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // В реальном проекте здесь был бы запрос к серверу
        console.log('Form data:', data);
        
        // Показать сообщение об успехе
        alert('Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время.');
        
        // Сброс формы
        contactForm.reset();
    });
}

// Анимация счетчиков при появлении на экране
const statNumbers = document.querySelectorAll('.stat-number');

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = parseInt(entry.target.textContent);
            let current = 0;
            const increment = Math.ceil(number / 50);
            
            const counter = setInterval(() => {
                current += increment;
                if (current >= number) {
                    entry.target.textContent = number + '+';
                    clearInterval(counter);
                } else {
                    entry.target.textContent = current + '+';
                }
            }, 20);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    observer.observe(stat);
});

// Эффект параллакса для фона
function initParallax() {
    const heroSection = document.querySelector('.hero');
    const aboutSection = document.querySelector('.about');
    
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            heroSection.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
        });
    }
}

// Плавная прокрутка к якорным ссылкам
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}



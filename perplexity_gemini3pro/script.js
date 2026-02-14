// Инициализация Three.js сцены для 3D фона
let scene, camera, renderer, particles;

function init3DBackground() {
    // Создание сцены
    scene = new THREE.Scene();

    // Создание камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Создание рендерера
    const canvas = document.getElementById('bg-canvas');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Создание геометрии частиц
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    // Генерация случайных позиций частиц
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Создание материала для частиц
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.3,
        color: 0x667eea,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Создание системы частиц
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Добавление геометрических фигур
    addGeometricShapes();

    // Добавление освещения
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x667eea, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Запуск анимации
    animate();
}

function addGeometricShapes() {
    // Добавление вращающихся геометрических фигур
    const shapes = [];

    // Тор
    const torusGeometry = new THREE.TorusGeometry(10, 2, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0x764ba2,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-20, -10, -20);
    scene.add(torus);
    shapes.push(torus);

    // Икосаэдр
    const icosahedronGeometry = new THREE.IcosahedronGeometry(8, 0);
    const icosahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
    icosahedron.position.set(20, 10, -30);
    scene.add(icosahedron);
    shapes.push(icosahedron);

    // Октаэдр
    const octahedronGeometry = new THREE.OctahedronGeometry(6, 0);
    const octahedronMaterial = new THREE.MeshStandardMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.set(0, -15, -25);
    scene.add(octahedron);
    shapes.push(octahedron);

    window.geometricShapes = shapes;
}

function animate() {
    requestAnimationFrame(animate);

    // Вращение частиц
    if (particles) {
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
    }

    // Вращение геометрических фигур
    if (window.geometricShapes) {
        window.geometricShapes.forEach((shape, index) => {
            shape.rotation.x += 0.005 + index * 0.001;
            shape.rotation.y += 0.003 + index * 0.001;

            // Плавное движение вверх-вниз
            shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });
    }

    // Движение камеры при скролле
    const scrollY = window.scrollY;
    camera.position.y = -scrollY * 0.01;

    renderer.render(scene, camera);
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Инициализация при загрузке страницы
window.addEventListener('load', init3DBackground);

// Плавная прокрутка для навигации
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Наблюдение за элементами
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .portfolio-item, .process-step, .contact-form');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Обработка формы контактов
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Имитация отправки формы
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.textContent = '✓ Отправлено!';
            submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            setTimeout(() => {
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
            }, 2000);
        }, 1500);
    });
}

// Эффект параллакса для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Анимация цифр в статистике
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isPercentage = target <= 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isPercentage) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Запуск анимации счетчиков при появлении в viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                setTimeout(() => {
                    animateCounter(stat, value, 2000);
                }, index * 200);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Добавление эффекта наведения на карточки сервисов
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function(e) {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Интерактивность для портфолио
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', function() {
        const title = this.querySelector('h3').textContent;
        console.log(`Открыт проект: ${title}`);
        // Здесь можно добавить модальное окно или переход на страницу проекта
    });
});

console.log('🚀 AppCraft Landing Page загружен успешно!');
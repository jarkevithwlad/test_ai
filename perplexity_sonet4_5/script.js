// Инициализация AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Инициализация VANTA.js 3D фона
let vantaEffect;

window.addEventListener('DOMContentLoaded', () => {
    try {
        vantaEffect = VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x6366f1,
            backgroundColor: 0x0f172a,
            points: 10.00,
            maxDistance: 25.00,
            spacing: 18.00
        });
    } catch (error) {
        console.log('VANTA initialization error:', error);
    }
});

// Мобильное меню
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (burger) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burger.classList.toggle('active');
    });

    // Закрытие меню при клике на ссылку
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burger.classList.remove('active');
        });
    });
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Изменение хедера при скролле
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(99, 102, 241, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Обработка формы контактов
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Получаем данные формы
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Здесь должна быть отправка данных на сервер
        console.log('Данные формы:', data);

        // Показываем уведомление (можно заменить на более красивое)
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');

        // Очищаем форму
        contactForm.reset();
    });
}

// Анимация цифр в секции "О компании"
const animateNumbers = () => {
    const aboutCards = document.querySelectorAll('.about-card p');

    aboutCards.forEach(card => {
        const text = card.textContent;
        const numberMatch = text.match(/\d+/);

        if (numberMatch) {
            const targetNumber = parseInt(numberMatch[0]);
            const prefix = text.substring(0, text.indexOf(numberMatch[0]));
            const suffix = text.substring(text.indexOf(numberMatch[0]) + numberMatch[0].length);

            let currentNumber = 0;
            const increment = targetNumber / 50;
            const duration = 2000;
            const intervalTime = duration / 50;

            const timer = setInterval(() => {
                currentNumber += increment;

                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(timer);
                }

                card.textContent = prefix + Math.floor(currentNumber) + suffix;
            }, intervalTime);
        }
    });
};

// Intersection Observer для анимации чисел
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.about');
if (aboutSection) {
    observer.observe(aboutSection);
}

// Параллакс эффект для карточек при движении мыши
const cards = document.querySelectorAll('.service-card, .portfolio-item, .about-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Добавление частиц при клике
document.addEventListener('click', (e) => {
    createParticle(e.clientX, e.clientY);
});

function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.opacity = '1';
    particle.style.transition = 'all 1s ease-out';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0)`;
        particle.style.opacity = '0';
    }, 10);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Курсор с эффектом свечения
const cursor = document.createElement('div');
cursor.style.position = 'fixed';
cursor.style.width = '20px';
cursor.style.height = '20px';
cursor.style.borderRadius = '50%';
cursor.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)';
cursor.style.pointerEvents = 'none';
cursor.style.zIndex = '9999';
cursor.style.transition = 'transform 0.1s ease';
cursor.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Увеличение курсора при наведении на интерактивные элементы
const interactiveElements = document.querySelectorAll('a, button, .btn, .service-card, .portfolio-item');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Очистка VANTA при закрытии страницы
window.addEventListener('beforeunload', () => {
    if (vantaEffect) {
        vantaEffect.destroy();
    }
});

console.log('🚀 MobileCode Landing Page загружен');
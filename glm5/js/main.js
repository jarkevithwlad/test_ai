/**
 * Main JavaScript Entry Point
 * Imports and coordinates all modules
 */

// Import modules
import ThreeScene from './three-scene.js';
import Animations from './animations.js';
import Navigation from './navigation.js';

/**
 * App Class
 * Main application controller
 */
class App {
    constructor() {
        this.threeScene = null;
        this.animations = null;
        this.navigation = null;
        this.portfolioFilter = null;
        this.testimonialsCarousel = null;
        this.contactForm = null;

        // Initialize when DOM is ready
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup all components
     */
    setup() {
        // Initialize Three.js scene
        this.initThreeScene();

        // Initialize GSAP animations
        this.initAnimations();

        // Initialize navigation
        this.initNavigation();

        // Initialize portfolio filter
        this.initPortfolioFilter();

        // Initialize testimonials carousel
        this.initTestimonialsCarousel();

        // Initialize contact form
        this.initContactForm();

        // Initialize scroll to top button
        this.initScrollToTop();

        // Log initialization
        console.log('App initialized successfully');
    }

    /**
     * Initialize Three.js 3D scene
     */
    initThreeScene() {
        const canvas = document.getElementById('hero-canvas');
        if (canvas && typeof THREE !== 'undefined') {
            this.threeScene = new ThreeScene();
        }
    }

    /**
     * Initialize GSAP animations
     */
    initAnimations() {
        if (typeof gsap !== 'undefined') {
            this.animations = new Animations();
        }
    }

    /**
     * Initialize navigation
     */
    initNavigation() {
        this.navigation = new Navigation();
    }

    /**
     * Initialize portfolio filter
     */
    initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const portfolioCards = document.querySelectorAll('.portfolio-card');

        if (!filterBtns.length || !portfolioCards.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Get filter value
                const filter = btn.dataset.filter;

                // Filter cards
                this.filterPortfolioCards(portfolioCards, filter);
            });
        });
    }

    /**
     * Filter portfolio cards with animation
     */
    filterPortfolioCards(cards, filter) {
        cards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = filter === 'all' || category === filter;

            if (shouldShow) {
                // Show card
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        onStart: () => {
                            card.style.display = 'block';
                        }
                    });
                } else {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                }
            } else {
                // Hide card
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            }
        });
    }

    /**
     * Initialize testimonials carousel
     */
    initTestimonialsCarousel() {
        const carousel = document.querySelector('.testimonials__carousel');
        const track = document.querySelector('.testimonials__track');
        const cards = document.querySelectorAll('.testimonial-card');
        const prevBtn = document.querySelector('.testimonials__nav--prev');
        const nextBtn = document.querySelector('.testimonials__nav--next');
        const dots = document.querySelectorAll('.testimonials__dot');

        if (!carousel || !track || !cards.length) return;

        this.testimonialsCarousel = {
            currentIndex: 0,
            totalSlides: cards.length,
            autoplayInterval: null,
            autoplayDelay: 5000
        };

        const carouselState = this.testimonialsCarousel;

        // Navigation functions
        const goToSlide = (index) => {
            if (index < 0) index = carouselState.totalSlides - 1;
            if (index >= carouselState.totalSlides) index = 0;

            carouselState.currentIndex = index;

            // Calculate offset
            const cardWidth = cards[0].offsetWidth;
            const gap = 32; // gap between cards
            const offset = index * (cardWidth + gap);

            // Animate
            if (typeof gsap !== 'undefined') {
                gsap.to(track, {
                    x: -offset,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                track.style.transform = `translateX(-${offset}px)`;
            }

            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(carouselState.currentIndex - 1);
                resetAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(carouselState.currentIndex + 1);
                resetAutoplay();
            });
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    goToSlide(carouselState.currentIndex + 1);
                } else {
                    // Swipe right - prev
                    goToSlide(carouselState.currentIndex - 1);
                }
                resetAutoplay();
            }
        };

        // Autoplay
        const startAutoplay = () => {
            carouselState.autoplayInterval = setInterval(() => {
                goToSlide(carouselState.currentIndex + 1);
            }, carouselState.autoplayDelay);
        };

        const resetAutoplay = () => {
            clearInterval(carouselState.autoplayInterval);
            startAutoplay();
        };

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(carouselState.autoplayInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            startAutoplay();
        });

        // Start autoplay
        startAutoplay();
    }

    /**
     * Initialize contact form with validation
     */
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('.form-input');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validation rules
        const validators = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Za-åa-öA-Å\s-]+$/,
                message: 'Please enter a valid name (at least 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: false,
                pattern: /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
                message: 'Please enter a valid phone number'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Please enter a message (at least 10 characters)'
            }
        };

        // Validate single field
        const validateField = (input) => {
            const name = input.name;
            const value = input.value.trim();
            const validator = validators[name];
            let isValid = true;
            let errorMessage = '';

            if (!validator) return true;

            // Check required
            if (validator.required && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            // Check min length
            else if (validator.minLength && value.length < validator.minLength) {
                isValid = false;
                errorMessage = validator.message;
            }
            // Check pattern
            else if (validator.pattern && value && !validator.pattern.test(value)) {
                isValid = false;
                errorMessage = validator.message;
            }

            // Update UI
            const formGroup = input.closest('.form-group');
            if (formGroup) {
                formGroup.classList.toggle('error', !isValid);
                
                // Show/hide error message
                let errorEl = formGroup.querySelector('.form-error');
                if (!isValid) {
                    if (!errorEl) {
                        errorEl = document.createElement('span');
                        errorEl.className = 'form-error';
                        formGroup.appendChild(errorEl);
                    }
                    errorEl.textContent = errorMessage;
                } else if (errorEl) {
                    errorEl.remove();
                }
            }

            return isValid;
        };

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                if (formGroup && formGroup.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate all fields
            let isFormValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                // Focus first invalid field
                const firstInvalid = form.querySelector('.form-group.error .form-input');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Disable submit button
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
            }

            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                // Simulate API call (replace with actual endpoint)
                await this.submitForm(data);

                // Show success message
                this.showFormMessage(form, 'success', 'Thank you! We will contact you soon.');
                
                // Reset form
                form.reset();

            } catch (error) {
                // Show error message
                this.showFormMessage(form, 'error', 'Something went wrong. Please try again.');
                console.error('Form submission error:', error);
            }

            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Request';
            }
        });
    }

    /**
     * Submit form data
     */
    async submitForm(data) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% chance)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    /**
     * Show form message
     */
    showFormMessage(form, type, message) {
        // Remove existing message
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        // Create message element
        const msgEl = document.createElement('div');
        msgEl.className = `form-message form-message--${type}`;
        msgEl.textContent = message;

        // Add to form
        form.appendChild(msgEl);

        // Animate in
        if (typeof gsap !== 'undefined') {
            gsap.from(msgEl, {
                y: 20,
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (typeof gsap !== 'undefined') {
                gsap.to(msgEl, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in',
                    onComplete: () => msgEl.remove()
                });
            } else {
                msgEl.remove();
            }
        }, 5000);
    }

    /**
     * Initialize scroll to top button
     */
    initScrollToTop() {
        // Create scroll to top button if not exists
        let scrollBtn = document.querySelector('.scroll-to-top');
        
        if (!scrollBtn) {
            scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-top';
            scrollBtn.setAttribute('aria-label', 'Scroll to top');
            scrollBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 19V5M12 5L6 11M12 5L18 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            document.body.appendChild(scrollBtn);
        }

        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, { passive: true });

        // Scroll to top on click
        scrollBtn.addEventListener('click', () => {
            if (this.navigation) {
                this.navigation.scrollToTop();
            } else if (typeof gsap !== 'undefined') {
                gsap.to(window, {
                    scrollTo: { y: 0 },
                    duration: 1,
                    ease: 'power3.inOut'
                });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }

    /**
     * Destroy application
     */
    destroy() {
        // Destroy Three.js scene
        if (this.threeScene) {
            this.threeScene.destroy();
        }

        // Destroy animations
        if (this.animations) {
            this.animations.destroy();
        }

        // Destroy navigation
        if (this.navigation) {
            this.navigation.destroy();
        }

        // Clear carousel autoplay
        if (this.testimonialsCarousel && this.testimonialsCarousel.autoplayInterval) {
            clearInterval(this.testimonialsCarousel.autoplayInterval);
        }
    }
}

// Initialize app
const app = new App();

// Export for debugging
window.app = app;

export default app;

/**
 * GSAP Animations
 * Scroll-triggered animations, counters, and text effects
 */

class Animations {
    constructor() {
        // Check if GSAP is available
        if (typeof gsap === 'undefined') {
            console.warn('GSAP is not loaded');
            return;
        }

        // Register ScrollTrigger plugin
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Initialize Lenis for smooth scroll
        this.initLenis();

        // Initialize all animations
        this.init();
    }

    /**
     * Initialize Lenis smooth scroll
     */
    initLenis() {
        if (typeof Lenis === 'undefined') {
            console.warn('Lenis is not loaded');
            return;
        }

        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2
        });

        // Integrate with GSAP ScrollTrigger
        if (typeof ScrollTrigger !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                this.lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.2
                    });
                }
            });
        });
    }

    /**
     * Initialize all animations
     */
    init() {
        this.animateHero();
        this.animateSections();
        this.animateServiceCards();
        this.animateStats();
        this.animatePortfolio();
        this.animateProcess();
        this.animateTestimonials();
        this.animateContact();
        this.animateFooter();
    }

    /**
     * Hero section animations
     */
    animateHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const titleLines = hero.querySelectorAll('.hero__title-line');
        const subtitle = hero.querySelector('.hero__subtitle');
        const buttons = hero.querySelector('.hero__buttons');
        const scrollIndicator = hero.querySelector('.hero__scroll-indicator');

        // Create timeline for hero
        const tl = gsap.timeline({
            defaults: {
                ease: 'power3.out',
                duration: 1
            }
        });

        // Animate title lines
        tl.from(titleLines, {
            y: 60,
            opacity: 0,
            stagger: 0.2
        });

        // Animate subtitle
        tl.from(subtitle, {
            y: 30,
            opacity: 0
        }, '-=0.5');

        // Animate buttons
        tl.from(buttons, {
            y: 20,
            opacity: 0
        }, '-=0.3');

        // Animate scroll indicator
        tl.from(scrollIndicator, {
            opacity: 0,
            y: -20
        }, '-=0.3');

        // Continuous bounce animation for scroll indicator
        gsap.to(scrollIndicator, {
            y: 10,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    }

    /**
     * Section headers animation
     */
    animateSections() {
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const header = section.querySelector('.section-header');
            if (!header) return;

            gsap.from(header, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
    }

    /**
     * Service cards animation
     */
    animateServiceCards() {
        const cards = document.querySelectorAll('.service-card');
        if (!cards.length) return;

        gsap.from(cards, {
            scrollTrigger: {
                trigger: '.services__grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Hover animations
        cards.forEach(card => {
            const icon = card.querySelector('.service-card__icon');
            const link = card.querySelector('.service-card__link');

            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(icon, {
                    scale: 1.1,
                    rotation: 5,
                    duration: 0.3
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.3
                });
            });
        });
    }

    /**
     * Stats counter animation
     */
    animateStats() {
        const statCards = document.querySelectorAll('.stat-card');
        if (!statCards.length) return;

        // Animate stat cards appearance
        gsap.from(statCards, {
            scrollTrigger: {
                trigger: '.advantages__stats',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Animate counters with CountUp.js
        if (typeof countUp === 'undefined') {
            console.warn('CountUp.js is not loaded');
            return;
        }

        const counters = [
            { id: 'projects-count', endVal: 150, suffix: '+' },
            { id: 'clients-count', endVal: 50, suffix: '+' },
            { id: 'years-count', endVal: 5, suffix: '' }
        ];

        ScrollTrigger.create({
            trigger: '.advantages__stats',
            start: 'top 80%',
            onEnter: () => {
                counters.forEach(counter => {
                    const element = document.getElementById(counter.id);
                    if (element) {
                        const countUpInstance = new countUp.CountUp(
                            element,
                            counter.endVal,
                            {
                                duration: 2,
                                suffix: counter.suffix,
                                useEasing: true,
                                useGrouping: true
                            }
                        );
                        if (!countUpInstance.error) {
                            countUpInstance.start();
                        }
                    }
                });
            },
            once: true
        });

        // Animate advantage items
        const advantageItems = document.querySelectorAll('.advantage-item');
        if (advantageItems.length) {
            gsap.from(advantageItems, {
                scrollTrigger: {
                    trigger: '.advantages__list',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: -30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }

    /**
     * Portfolio section animation
     */
    animatePortfolio() {
        const portfolioGrid = document.querySelector('.portfolio__grid');
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        const filterBtns = document.querySelectorAll('.filter-btn');

        if (!portfolioCards.length) return;

        // Animate filter buttons
        gsap.from(filterBtns, {
            scrollTrigger: {
                trigger: '.portfolio__filters',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Animate portfolio cards
        gsap.from(portfolioCards, {
            scrollTrigger: {
                trigger: portfolioGrid,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out'
        });

        // Hover animations for portfolio cards
        portfolioCards.forEach(card => {
            const overlay = card.querySelector('.portfolio-card__overlay');

            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(overlay, {
                    opacity: 1,
                    duration: 0.3
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3
                });
            });
        });
    }

    /**
     * Process timeline animation
     */
    animateProcess() {
        const processSteps = document.querySelectorAll('.process-step');
        const processLine = document.querySelector('.process__line');

        if (!processSteps.length) return;

        // Animate the connecting line
        if (processLine) {
            gsap.from(processLine, {
                scrollTrigger: {
                    trigger: '.process__timeline',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                scaleX: 0,
                transformOrigin: 'left center',
                duration: 1.5,
                ease: 'power2.out'
            });
        }

        // Animate process steps
        gsap.from(processSteps, {
            scrollTrigger: {
                trigger: '.process__timeline',
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });

        // Animate step numbers and icons
        processSteps.forEach((step, index) => {
            const number = step.querySelector('.process-step__number');
            const icon = step.querySelector('.process-step__icon');

            gsap.from([number, icon], {
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                scale: 0,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                delay: index * 0.1,
                ease: 'back.out(1.7)'
            });
        });
    }

    /**
     * Testimonials carousel animation
     */
    animateTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialSection = document.querySelector('.testimonials');

        if (!testimonialCards.length) return;

        // Animate testimonial cards
        gsap.from(testimonialCards, {
            scrollTrigger: {
                trigger: testimonialSection,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }

    /**
     * Contact section animation
     */
    animateContact() {
        const contactSection = document.querySelector('.contact');
        const contactInfo = document.querySelector('.contact__info');
        const contactForm = document.querySelector('.contact__form');

        if (!contactSection) return;

        // Animate contact info
        if (contactInfo) {
            gsap.from(contactInfo, {
                scrollTrigger: {
                    trigger: contactSection,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // Animate contact form
        if (contactForm) {
            gsap.from(contactForm, {
                scrollTrigger: {
                    trigger: contactSection,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        // Form field animations
        const formInputs = contactForm?.querySelectorAll('.form-input');
        if (formInputs) {
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    gsap.to(input, {
                        scale: 1.02,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });

                input.addEventListener('blur', () => {
                    gsap.to(input, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'power2.out'
                    });
                });
            });
        }
    }

    /**
     * Footer animation
     */
    animateFooter() {
        const footer = document.querySelector('.footer');
        if (!footer) return;

        const footerBrand = footer.querySelector('.footer__brand');
        const footerColumns = footer.querySelectorAll('.footer__column');
        const footerSocial = footer.querySelector('.footer__social');
        const footerBottom = footer.querySelector('.footer__bottom');

        gsap.from(footerBrand, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        });

        gsap.from(footerColumns, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        });

        gsap.from(footerSocial, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from(footerBottom, {
            scrollTrigger: {
                trigger: footer,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 20,
            opacity: 0,
            duration: 0.6,
            delay: 0.4,
            ease: 'power3.out'
        });
    }

    /**
     * Get Lenis instance
     */
    getLenis() {
        return this.lenis;
    }

    /**
     * Destroy animations
     */
    destroy() {
        // Kill all ScrollTriggers
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }

        // Destroy Lenis
        if (this.lenis) {
            this.lenis.destroy();
        }
    }
}

export default Animations;
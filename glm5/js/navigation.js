/**
 * Navigation Module
 * Mobile menu, smooth scroll, active menu item, header hide/show
 */

class Navigation {
    constructor() {
        // DOM Elements
        this.header = document.getElementById('header');
        this.nav = document.getElementById('nav');
        this.burger = document.getElementById('burger');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.sections = document.querySelectorAll('section[id]');

        // State
        this.isMenuOpen = false;
        this.lastScrollY = 0;
        this.scrollThreshold = 100;
        this.isHeaderHidden = false;

        // Initialize
        this.init();
    }

    /**
     * Initialize navigation
     */
    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveMenuTracking();
        this.setupHeaderScrollBehavior();
        this.setupKeyboardNavigation();
    }

    /**
     * Setup mobile menu (burger)
     */
    setupMobileMenu() {
        if (!this.burger || !this.nav) return;

        // Toggle menu on burger click
        this.burger.addEventListener('click', () => this.toggleMenu());

        // Close menu on nav link click
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && 
                !this.nav.contains(e.target) && 
                !this.burger.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * Open mobile menu
     */
    openMenu() {
        this.isMenuOpen = true;
        
        // Update burger
        this.burger.classList.add('active');
        this.burger.setAttribute('aria-expanded', 'true');
        
        // Update nav
        this.nav.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        this.animateMenuItems(true);
    }

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.isMenuOpen = false;
        
        // Update burger
        this.burger.classList.remove('active');
        this.burger.setAttribute('aria-expanded', 'false');
        
        // Update nav
        this.nav.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Animate menu items
        this.animateMenuItems(false);
    }

    /**
     * Animate menu items
     */
    animateMenuItems(open) {
        if (typeof gsap === 'undefined') return;

        const items = this.nav.querySelectorAll('.nav__item');

        if (open) {
            gsap.fromTo(items, 
                { opacity: 0, x: -20 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3, 
                    stagger: 0.05,
                    ease: 'power2.out'
                }
            );
        }
    }

    /**
     * Setup smooth scroll to sections
     */
    setupSmoothScroll() {
        // All anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = this.header ? this.header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                    // Use native smooth scroll or GSAP
                    if (typeof gsap !== 'undefined') {
                        gsap.to(window, {
                            scrollTo: { y: targetPosition, autoKill: false },
                            duration: 1,
                            ease: 'power3.inOut'
                        });
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }

                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Setup active menu item tracking on scroll
     */
    setupActiveMenuTracking() {
        if (!this.sections.length || !this.navLinks.length) return;

        // Create intersection observer for sections
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveLink(id);
                }
            });
        }, observerOptions);

        // Observe all sections
        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Fallback: check on scroll
        window.addEventListener('scroll', () => {
            this.checkActiveSection();
        }, { passive: true });
    }

    /**
     * Check which section is currently in view
     */
    checkActiveSection() {
        const scrollY = window.scrollY;
        const headerHeight = this.header ? this.header.offsetHeight : 0;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.setActiveLink(sectionId);
            }
        });
    }

    /**
     * Set active navigation link
     */
    setActiveLink(id) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === `#${id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Setup header hide/show on scroll
     */
    setupHeaderScrollBehavior() {
        if (!this.header) return;

        // Add scrolled class when page is scrolled
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;

            // Add background when scrolled
            if (scrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            // Hide/show header based on scroll direction
            if (scrollY > this.lastScrollY && scrollY > this.scrollThreshold) {
                // Scrolling down - hide header
                if (!this.isHeaderHidden) {
                    this.hideHeader();
                }
            } else {
                // Scrolling up - show header
                if (this.isHeaderHidden || scrollY <= this.scrollThreshold) {
                    this.showHeader();
                }
            }

            this.lastScrollY = scrollY;
        }, { passive: true });
    }

    /**
     * Hide header
     */
    hideHeader() {
        this.isHeaderHidden = true;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(this.header, {
                y: '-100%',
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            this.header.style.transform = 'translateY(-100%)';
        }
    }

    /**
     * Show header
     */
    showHeader() {
        this.isHeaderHidden = false;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(this.header, {
                y: '0%',
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            this.header.style.transform = 'translateY(0)';
        }
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // Tab navigation for menu
        this.navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % this.navLinks.length;
                    this.navLinks[nextIndex].focus();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
                    this.navLinks[prevIndex].focus();
                }
            });
        });
    }

    /**
     * Get current scroll progress
     */
    getScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return scrollTop / docHeight;
    }

    /**
     * Scroll to top
     */
    scrollToTop() {
        if (typeof gsap !== 'undefined') {
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
    }

    /**
     * Destroy navigation
     */
    destroy() {
        // Close menu if open
        if (this.isMenuOpen) {
            this.closeMenu();
        }

        // Remove event listeners would be done automatically
        // when elements are removed from DOM
    }
}

export default Navigation;
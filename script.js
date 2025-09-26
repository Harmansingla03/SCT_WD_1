// DOM Elements
const navbar = document.getElementById('navbar');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Navbar scroll effect
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Mobile menu toggle functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    mobileToggle.classList.toggle('active');
    
    // Prevent body scroll when mobile menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu
function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for navigation links
function smoothScrollToSection(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar height
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if it's open
        closeMobileMenu();
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Add active class to current section link
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Intersection Observer for section animations
function createSectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections except hero
    sections.forEach(section => {
        if (section.id !== 'home') {
            sectionObserver.observe(section);
        }
    });
}

// Parallax effect for hero section
function handleParallaxEffect() {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Throttle function for performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Handle scroll events with throttling
const throttledScrollHandler = throttle(() => {
    handleNavbarScroll();
    updateActiveNavLink();
    handleParallaxEffect();
}, 16); // ~60fps

// Add click effect to buttons
function addButtonClickEffect() {
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Keyboard navigation support
function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
    
    if (e.key === 'Tab' && navMenu.classList.contains('active')) {
        // Keep focus within mobile menu when it's open
        const focusableElements = navMenu.querySelectorAll('a[href]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
}

// Loading animation
function showLoadingAnimation() {
    document.body.classList.add('loading');
    
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 500);
}

// Initialize scroll animations for feature cards
function initializeCardAnimations() {
    const cards = document.querySelectorAll('.feature-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100); // Stagger animation
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
}

// Header height adjustment for mobile devices
function adjustHeaderHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    showLoadingAnimation();
    createSectionObserver();
    initializeCardAnimations();
    addButtonClickEffect();
    adjustHeaderHeight();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    console.log('SkillCraft Landing Page Loaded Successfully! 🚀');
});

// Scroll event listener
window.addEventListener('scroll', throttledScrollHandler);

// Mobile toggle event listener
if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
}

// Navigation links event listeners
navLinks.forEach(link => {
    link.addEventListener('click', smoothScrollToSection);
});

// Keyboard navigation
document.addEventListener('keydown', handleKeyboardNavigation);

// Resize event listener
window.addEventListener('resize', debounce(() => {
    adjustHeaderHeight();
    closeMobileMenu(); // Close mobile menu on resize
}, 250));

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Prevent scroll restoration on page reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .loading {
        overflow: hidden;
    }
    
    .loaded .hero-content > * {
        animation-play-state: running;
    }
    
    .hero {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
`;
document.head.appendChild(style);

// Export functions for potential external use
window.SkillCraftNavigation = {
    closeMobileMenu,
    updateActiveNavLink,
    smoothScrollToSection: smoothScrollToSection.bind({ getAttribute: (attr) => attr })
};
// Global variables
let currentSection = 'home';
let isTransitioning = false;
let isMenuOpen = false;

// DOM Elements
const mainContent = document.getElementById('main-content');
const atomLoader = document.getElementById('atom-loader');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupEventListeners();
    setupScrollAnimation();
});

// Initialize website
function initializeWebsite() {
    // Show main content immediately
    mainContent.classList.remove('hidden');
    mainContent.classList.add('fade-in');
    
    // Show home section
    showSection('home');
}

// Show atom loader
function showAtomLoader() {
    atomLoader.classList.add('active');
    atomLoader.style.display = 'flex';
}

// Hide atom loader
function hideAtomLoader() {
    setTimeout(() => {
        atomLoader.classList.remove('active');
        atomLoader.style.display = 'none';
    }, 200);
}

// Close mobile menu completely
function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    isMenuOpen = false;
}

// Show specific section with animation
function showSection(sectionId) {
    if (isTransitioning) return;
    
    isTransitioning = true;
    
    // Close mobile menu immediately
    closeMobileMenu();
    
    // Disable hamburger during transition
    hamburger.style.pointerEvents = 'none';
    
    // Show atom loader
    showAtomLoader();
    
    setTimeout(() => {
        // Hide all sections
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target section
        const newSection = document.getElementById(sectionId);
        if (newSection) {
            newSection.classList.add('active');
        }
        
        // Update navigation
        updateNavigation(sectionId);
        
        currentSection = sectionId;
        
        // Hide atom loader
        hideAtomLoader();
        
        // Re-enable hamburger after transition
        setTimeout(() => {
            hamburger.style.pointerEvents = 'auto';
            isTransitioning = false;
        }, 200);
        
    }, 1000);
}

// Update navigation active state
function updateNavigation(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isTransitioning) return;
            
            const targetSection = this.getAttribute('data-section');
            
            if (targetSection && targetSection !== currentSection) {
                showSection(targetSection);
            } else if (isMenuOpen) {
                // If same section but menu is open, just close menu
                closeMobileMenu();
            }
        });
    });
    
    // Buttons with data-section attribute
    document.querySelectorAll('[data-section]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isTransitioning) return;
            
            const targetSection = this.getAttribute('data-section');
            
            if (targetSection && targetSection !== currentSection) {
                showSection(targetSection);
            }
        });
    });
    
    // Hamburger menu
    hamburger.addEventListener('click', function() {
        if (isTransitioning) return;
        
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navMenu.classList.add('active');
            this.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu when scrolling
    document.addEventListener('scroll', function() {
        if (isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on touch/scroll for mobile devices
    let touchStartY = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (isMenuOpen) {
            const touchY = e.touches[0].clientY;
            const diff = Math.abs(touchY - touchStartY);
            
            // Close menu if user scrolls more than 10px
            if (diff > 10) {
                closeMobileMenu();
            }
        }
    });
    
    // Modal functionality
    setupModalListeners();
    
    // Scroll indicator click
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            showSection('about');
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show atom loader
            showAtomLoader();
            
            // Simulate form submission
            setTimeout(() => {
                hideAtomLoader();
                
                // Show success message (you can customize this)
                const button = this.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                button.textContent = 'Message Sent!';
                button.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    this.reset();
                }, 3000);
            }, 2000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        const sections = ['home', 'about', 'meeting', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentIndex < sections.length - 1) {
                showSection(sections[currentIndex + 1]);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentIndex > 0) {
                showSection(sections[currentIndex - 1]);
            }
        }
    });
}

// Setup scroll animations for elements
function setupScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.skill-item, .project-card, .contact-method');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
                    }, 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.skill-item, .project-card, .contact-method').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS for scroll animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(50px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(8px) rotate(45deg);
    }
    
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-8px) rotate(-45deg);
    }
    
    /* Additional hover effects */
    .project-card:hover .project-placeholder {
        transform: scale(1.1);
        transition: transform 0.3s ease;
    }
    
    .skill-item:hover .skill-icon {
        transform: scale(1.2) rotate(10deg);
        transition: transform 0.3s ease;
    }
    
    .contact-method:hover .contact-icon {
        transform: scale(1.2);
        transition: transform 0.3s ease;
    }
    
    /* Smooth transitions for all interactive elements */
    * {
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    
    /* Loading animation improvements */
    .atom-loader.active .atom-svg {
        animation: rotate 3s linear infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Utility functions
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

// Add smooth scrolling for any anchor links
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

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
}, 250));

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        const sections = ['home', 'about', 'meeting', 'contact'];
        const currentIndex = sections.indexOf(currentSection);
        
        if (diff > 0 && currentIndex < sections.length - 1) {
            // Swipe up - next section
            showSection(sections[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe down - previous section
            showSection(sections[currentIndex - 1]);
        }
    }
}

// Add performance optimization
function optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.body.classList.add('reduced-motion');
        
        const style = document.createElement('style');
        style.textContent = `
            .reduced-motion * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize performance optimizations
optimizeAnimations();

// Add preloader for images (if any are added later)
function preloadImages() {
    const imageUrls = [
        // Add image URLs here if needed
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize image preloading
preloadImages();

// Modal functionality
function setupModalListeners() {
    const modal = document.getElementById('modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalClose = modal.querySelector('.modal-close');
    const skillItems = document.querySelectorAll('.skill-item[data-modal]');
    
    // Modal data
    const modalData = {
        solutions: {
            icon: '💻',
            title: 'Advanced Solutions',
            description: 'Our cutting-edge semiconductor controllers are designed to meet the demanding requirements of modern manufacturing. We provide precision control systems that optimize production efficiency, reduce downtime, and ensure consistent quality across all manufacturing processes. Our solutions integrate seamlessly with existing infrastructure while delivering measurable improvements in performance and reliability.'
        },
        design: {
            icon: '🔧',
            title: 'Intuitive Design',
            description: 'We believe technology should be accessible and easy to use. Our design philosophy centers on creating intuitive interfaces that require minimal training. Every product is carefully crafted with the end-user in mind, featuring clear visual feedback, logical workflows, and responsive controls. We combine aesthetic excellence with functional design to create solutions that operators actually want to use.'
        },
        innovation: {
            icon: '🚀',
            title: 'Continuous Innovation',
            description: 'Staying ahead in semiconductor manufacturing requires constant innovation. Our engineering team is dedicated to pushing the boundaries of what\'s possible, developing next-generation technologies that anticipate future industry needs. We invest heavily in R&D, collaborate with leading research institutions, and maintain a culture of experimentation to bring breakthrough solutions to market.'
        }
    };
    
    // Open modal when skill item is clicked
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const modalType = this.getAttribute('data-modal');
            const data = modalData[modalType];
            
            if (data) {
                modalIcon.textContent = data.icon;
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when backdrop is clicked
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    
    // Close modal when Escape key is pressed
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

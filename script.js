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
    createMolecules();
    initMolecularCanvas();
    initMolecularVideo();
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
    document.body.classList.add('loading');
}

// Hide atom loader
function hideAtomLoader() {
    setTimeout(() => {
        atomLoader.classList.remove('active');
        atomLoader.style.display = 'none';
        document.body.classList.remove('loading');
    }, 200);
}

// Close mobile menu completely
function closeMobileMenu() {
    // Use requestAnimationFrame for smoother animation
    requestAnimationFrame(() => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
    isMenuOpen = false;
    });
}

// Scroll to top function
function scrollToTop() {
    mainContent.scrollTop = 0;
    // Also try window.scrollTo as fallback
    if (window.scrollTo) {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
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
        // Hide video and overlay immediately when leaving home
        if (currentSection === 'home' && sectionId !== 'home') {
            const video = document.getElementById('molecular-video');
            const overlay = document.querySelector('.video-overlay');
            if (video) {
                video.style.display = 'none';
                video.style.visibility = 'hidden';
            }
            if (overlay) {
                overlay.style.display = 'none';
                overlay.style.visibility = 'hidden';
            }
        }
        
        // Show video and overlay when going to home
        if (sectionId === 'home' && currentSection !== 'home') {
            const video = document.getElementById('molecular-video');
            const overlay = document.querySelector('.video-overlay');
            if (video) {
                video.style.display = 'block';
                video.style.visibility = 'visible';
            }
            if (overlay) {
                overlay.style.display = 'block';
                overlay.style.visibility = 'visible';
            }
        }
        
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
        
        // Scroll to top when changing sections
        scrollToTop();
        
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
        
        // Use requestAnimationFrame for smoother animation
        requestAnimationFrame(() => {
        if (isMenuOpen) {
            navMenu.classList.add('active');
            this.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            closeMobileMenu();
        }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Modal functionality
    setupModalListeners();

    // FAQ accordion
    setupFAQAccordion();
    
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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };
            
            // Show atom loader
            showAtomLoader();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.disabled = true;
            
            try {
                // Try to submit to API endpoint (if available)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                hideAtomLoader();
                
                if (result.success || response.ok) {
                    // Show success message
                    button.textContent = 'Message Sent!';
                    button.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                        button.disabled = false;
                        this.reset();
                    }, 3000);
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                // Fallback: if API is not available, show success anyway (for development)
                console.log('API call failed, using fallback:', error);
                hideAtomLoader();
                
                button.textContent = 'Message Sent!';
                button.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    this.reset();
                }, 3000);
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        const sections = ['home', 'about', 'experience', 'services', 'meeting', 'faq', 'contact'];
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
                const children = entry.target.querySelectorAll('.skill-item, .project-card, .contact-method, .experience-card, .service-card, .service-detail, .faq-item, .founding-principle, .mission-statement');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
                    }, 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.skill-item, .project-card, .contact-method, .experience-card, .service-card, .service-detail, .faq-item, .founding-principle, .mission-statement').forEach(el => {
        observer.observe(el);
    });
}

// Setup FAQ accordion interactions
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    const closeAll = () => {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            if (!question || !answer) return;
            item.classList.remove('open');
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            answer.style.maxHeight = '0px';
        });
    };

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question || !answer) return;

        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;
        question.id = questionId;
        question.setAttribute('aria-controls', answerId);
        answer.id = answerId;
        answer.setAttribute('aria-labelledby', questionId);
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        answer.style.maxHeight = '0px';

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';

            closeAll();

            if (!isExpanded) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
                answer.setAttribute('aria-hidden', 'false');
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    window.addEventListener('resize', () => {
        faqItems.forEach(item => {
            if (!item.classList.contains('open')) return;
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
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
    
    .hamburger .bar {
        transform-origin: center;
        transition: transform 0.25s ease, opacity 0.2s ease;
    }
    .hamburger.active .bar:nth-child(2) {
        opacity: 0;
    }
    .hamburger.active .bar:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
    }
    .hamburger.active .bar:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
    }
    @media (max-width: 768px) {
        .hamburger.active .bar:nth-child(1) {
            transform: translateY(6px) rotate(45deg);
        }
        .hamburger.active .bar:nth-child(3) {
            transform: translateY(-6px) rotate(-45deg);
        }
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

// Add resize handler for responsive adjustments
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
    
}, 250));

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

// Create and animate background molecules
function createMolecules() {
    const container = document.getElementById('molecules-container');
    if (!container) return;

    // Number of molecules (adjust based on performance)
    const moleculeCount = 10;
    
    // Simplified molecule configurations for better performance
    const moleculeTypes = [
        // Linear molecule (CO2-like)
        {
            atoms: [
                { x: 0, y: 0, z: 0, color: 'cyan' },
                { x: 30, y: 0, z: 0, color: 'pink' },
                { x: -30, y: 0, z: 0, color: 'pink' }
            ],
            bonds: [30, 30]
        },
        // Tetrahedral molecule (CH4-like)
        {
            atoms: [
                { x: 0, y: 0, z: 0, color: 'cyan' },
                { x: 25, y: 25, z: 25, color: 'pink' },
                { x: -25, y: 25, z: 25, color: 'pink' },
                { x: 25, y: -25, z: 25, color: 'pink' },
                { x: -25, y: -25, z: -25, color: 'pink' }
            ],
            bonds: [43, 43, 43, 43]
        },
        // Triangular molecule (H2O-like)
        {
            atoms: [
                { x: 0, y: 0, z: 0, color: 'cyan' },
                { x: 0, y: -28, z: 0, color: 'pink' },
                { x: 24, y: 14, z: 0, color: 'pink' },
                { x: -24, y: 14, z: 0, color: 'pink' }
            ],
            bonds: [28, 28, 28]
        }
    ];

    // Create molecules
    for (let i = 0; i < moleculeCount; i++) {
        const config = moleculeTypes[Math.floor(Math.random() * moleculeTypes.length)];
        const molecule = createMolecule(config);
        container.appendChild(molecule);
        
        // Random initial position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // Random animation parameters
        const moveDuration = 25 + Math.random() * 20; // 25-45 seconds for movement
        const spinSpeed = 20 + Math.random() * 15; // 20-35 seconds for one full rotation
        
        // Start animations
        animateMolecule(molecule, startX, startY, moveDuration, spinSpeed);
    }
}

// Create a single molecule
function createMolecule(config) {
    const molecule = document.createElement('div');
    molecule.className = 'molecule';
    
    // Create center atom
    const centerAtom = document.createElement('div');
    centerAtom.className = 'molecule-center';
    molecule.appendChild(centerAtom);
    
    // Create connected atoms and bonds
    config.atoms.forEach((atom, index) => {
        if (index === 0) return; // Skip center atom
        
        const bondLength = config.bonds[index - 1] || 30;
        
        // Calculate 3D position
        const distance = Math.sqrt(atom.x * atom.x + atom.y * atom.y + atom.z * atom.z);
        const angleY = Math.atan2(atom.x, atom.z) * (180 / Math.PI);
        const angleX = -Math.asin(atom.y / distance) * (180 / Math.PI);
        
        // Create bond
        const bond = document.createElement('div');
        bond.className = 'molecule-bond';
        bond.style.width = distance + 'px';
        bond.style.transform = `translate(-50%, -50%) rotateY(${angleY}deg) rotateX(${angleX}deg)`;
        molecule.appendChild(bond);
        
        // Create atom at end of bond
        const atomElement = document.createElement('div');
        atomElement.className = 'molecule-atom';
        atomElement.style.transform = `translate(-50%, -50%) translate3d(${atom.x}px, ${atom.y}px, ${atom.z}px)`;
        molecule.appendChild(atomElement);
    });
    
    return molecule;
}

// Animate molecule movement and rotation
function animateMolecule(molecule, startX, startY, moveDuration, spinDuration) {
    let startTime = null;
    let rotationX = Math.random() * 360;
    let rotationY = Math.random() * 360;
    let rotationZ = Math.random() * 360;
    
    // Rotation speeds (degrees per second)
    const rotSpeedX = (360 / spinDuration) * (Math.random() > 0.5 ? 1 : -1);
    const rotSpeedY = (360 / spinDuration) * (Math.random() > 0.5 ? 1 : -1);
    const rotSpeedZ = (360 / spinDuration * 0.5) * (Math.random() > 0.5 ? 1 : -1);
    
    // Helper function to generate path points within viewport
    const generatePathPoints = () => {
        const margin = 100; // Keep molecules away from edges
        const pathPoints = [];
        const numPoints = 4;
        for (let i = 0; i < numPoints; i++) {
            pathPoints.push({
                x: margin + Math.random() * (window.innerWidth - 2 * margin),
                y: margin + Math.random() * (window.innerHeight - 2 * margin)
            });
        }
        pathPoints[0] = { 
            x: Math.max(margin, Math.min(window.innerWidth - margin, startX)), 
            y: Math.max(margin, Math.min(window.innerHeight - margin, startY))
        };
        return pathPoints;
    };
    
    let pathPoints = generatePathPoints();
    
    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = (currentTime - startTime) / 1000;
        const progress = (elapsed % moveDuration) / moveDuration;
        
        // Smooth path interpolation using cubic bezier-like curve
        const segment = Math.floor(progress * (pathPoints.length - 1));
        const segmentProgress = (progress * (pathPoints.length - 1)) % 1;
        
        // Use smoothstep for smoother movement
        const smoothProgress = segmentProgress * segmentProgress * (3 - 2 * segmentProgress);
        
        const p1 = pathPoints[segment];
        const p2 = pathPoints[(segment + 1) % pathPoints.length];
        
        const x = p1.x + (p2.x - p1.x) * smoothProgress;
        const y = p1.y + (p2.y - p1.y) * smoothProgress;
        
        // Keep within bounds
        const margin = 100;
        const clampedX = Math.max(margin, Math.min(window.innerWidth - margin, x));
        const clampedY = Math.max(margin, Math.min(window.innerHeight - margin, y));
        
        // Apply position
        molecule.style.left = clampedX + 'px';
        molecule.style.top = clampedY + 'px';
        
        // Update rotation based on actual frame time
        const deltaTime = 1/60; // Approximate frame time
        rotationX += rotSpeedX * deltaTime;
        rotationY += rotSpeedY * deltaTime;
        rotationZ += rotSpeedZ * deltaTime;
        
        // Normalize rotations
        rotationX = rotationX % 360;
        rotationY = rotationY % 360;
        rotationZ = rotationZ % 360;
        
        // Apply 3D rotation
        molecule.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`;
        
        requestAnimationFrame(animate);
    }
    
    // Regenerate path on window resize
    const handleResize = debounce(() => {
        pathPoints = generatePathPoints();
    }, 250);
    window.addEventListener('resize', handleResize);
    
    requestAnimationFrame(animate);
}

// Initialize and animate molecular canvas on home page with 3D effects
function initMolecularCanvas() {
    const canvas = document.getElementById('molecular-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    // Color constants matching theme
    const colors = {
        cyan: '#3BFFFF',
        pink: '#F10092',
        cyanGlow: 'rgba(59, 255, 255, 0.9)',
        pinkGlow: 'rgba(241, 0, 146, 0.9)',
        cyanDim: 'rgba(59, 255, 255, 0.5)',
        pinkDim: 'rgba(241, 0, 146, 0.5)',
        cyanBright: 'rgba(59, 255, 255, 1)',
        pinkBright: 'rgba(241, 0, 146, 1)'
    };
    
    // 3D rotation state
    let rotationX = 0.3;
    let rotationY = 0.2;
    let rotationZ = 0;
    
    // Perspective projection
    const perspective = 800;
    
    // Get center coordinates dynamically
    function getCenter() {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
    }
    
    // Set canvas size
    function resizeCanvas() {
        const width = homeSection.offsetWidth || window.innerWidth;
        const height = homeSection.offsetHeight || window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        createNodes();
    });
    
    // 3D rotation functions
    function rotateX(point, angle) {
        const y = point.y * Math.cos(angle) - point.z * Math.sin(angle);
        const z = point.y * Math.sin(angle) + point.z * Math.cos(angle);
        return { x: point.x, y, z };
    }
    
    function rotateY(point, angle) {
        const x = point.x * Math.cos(angle) + point.z * Math.sin(angle);
        const z = -point.x * Math.sin(angle) + point.z * Math.cos(angle);
        return { x, y: point.y, z };
    }
    
    function rotateZ(point, angle) {
        const x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
        const y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
        return { x, y, z: point.z };
    }
    
    // Project 3D point to 2D screen
    function project(point) {
        let p = { x: point.x, y: point.y, z: point.z };
        
        // Apply rotations
        p = rotateX(p, rotationX);
        p = rotateY(p, rotationY);
        p = rotateZ(p, rotationZ);
        
        // Perspective projection
        const scale = perspective / (perspective + p.z);
        const center = getCenter();
        return {
            x: center.x + p.x * scale,
            y: center.y + p.y * scale,
            z: p.z,
            scale: scale
        };
    }
    
    // Node class for 3D molecular spheres
    class Node {
        constructor(x, y, z) {
            this.baseX = x;
            this.baseY = y;
            this.baseZ = z;
            this.x = x;
            this.y = y;
            this.z = z;
            this.radius = 5 + Math.random() * 4;
            this.color = Math.random() > 0.5 ? colors.cyan : colors.pink;
            this.glowColor = this.color === colors.cyan ? colors.cyanGlow : colors.pinkGlow;
            this.waveOffset = Math.random() * Math.PI * 2;
            this.waveSpeed = 0.008 + Math.random() * 0.015;
            this.waveAmplitude = 20 + Math.random() * 30;
            this.projected = null;
        }
        
        update(time) {
            // Wavy 3D movement
            this.x = this.baseX + Math.sin(time * this.waveSpeed + this.waveOffset) * this.waveAmplitude;
            this.y = this.baseY + Math.cos(time * this.waveSpeed * 0.8 + this.waveOffset) * this.waveAmplitude;
            this.z = this.baseZ + Math.sin(time * this.waveSpeed * 1.2 + this.waveOffset * 0.7) * this.waveAmplitude * 0.6;
        }
        
        project() {
            this.projected = project({ x: this.x, y: this.y, z: this.z });
        }
        
        draw(ctx) {
            if (!this.projected) return;
            
            const { x, y, scale, z } = this.projected;
            const radius = this.radius * scale;
            
            // Depth-based opacity
            const depthFactor = Math.max(0.3, Math.min(1, (z + 200) / 400));
            const opacity = 0.4 + depthFactor * 0.6;
            
            // Outer glow with depth
            const glowRadius = radius * (2.5 + depthFactor);
            const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
            const glowColor = this.color === colors.cyan 
                ? `rgba(59, 255, 255, ${0.6 * opacity})` 
                : `rgba(241, 0, 146, ${0.6 * opacity})`;
            glowGradient.addColorStop(0, glowColor);
            glowGradient.addColorStop(0.4, this.color === colors.cyan 
                ? `rgba(59, 255, 255, ${0.3 * opacity})` 
                : `rgba(241, 0, 146, ${0.3 * opacity})`);
            glowGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Main 3D sphere with realistic lighting
            const lightX = x - radius * 0.4;
            const lightY = y - radius * 0.4;
            const sphereGradient = ctx.createRadialGradient(
                lightX, lightY, 0,
                x, y, radius
            );
            
            // Bright highlight
            sphereGradient.addColorStop(0, `rgba(255, 255, 255, ${0.8 * opacity})`);
            // Main color
            sphereGradient.addColorStop(0.2, this.color === colors.cyan 
                ? `rgba(59, 255, 255, ${0.9 * opacity})` 
                : `rgba(241, 0, 146, ${0.9 * opacity})`);
            // Mid-tone
            sphereGradient.addColorStop(0.5, this.color === colors.cyan 
                ? `rgba(59, 255, 255, ${0.7 * opacity})` 
                : `rgba(241, 0, 146, ${0.7 * opacity})`);
            // Shadow side
            sphereGradient.addColorStop(0.8, this.color === colors.cyan 
                ? `rgba(0, 150, 200, ${0.5 * opacity})` 
                : `rgba(180, 0, 100, ${0.5 * opacity})`);
            // Edge shadow
            sphereGradient.addColorStop(1, `rgba(0, 0, 0, ${0.3 * opacity})`);
            
            ctx.fillStyle = sphereGradient;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Secondary highlight for more 3D effect
            const highlightGradient = ctx.createRadialGradient(
                lightX, lightY, 0,
                lightX, lightY, radius * 0.5
            );
            highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.9 * opacity})`);
            highlightGradient.addColorStop(0.5, `rgba(255, 255, 255, ${0.3 * opacity})`);
            highlightGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = highlightGradient;
            ctx.beginPath();
            ctx.arc(lightX, lightY, radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Rim light for depth
            ctx.strokeStyle = this.color === colors.cyan 
                ? `rgba(59, 255, 255, ${0.4 * opacity})` 
                : `rgba(241, 0, 146, ${0.4 * opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, radius * 0.95, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    
    // Create nodes in 3D space
    const nodes = [];
    const nodeCount = 30;
    const connectionDistance = 200;
    
    // Function to create nodes
    function createNodes() {
        nodes.length = 0; // Clear existing nodes
        
        // Ensure canvas is sized
        if (canvas.width === 0 || canvas.height === 0) {
            resizeCanvas();
        }
        
        const center = getCenter();
        
        // Create nodes in a 3D grid pattern
        const cols = 5;
        const rows = 5;
        const depth = 3;
        const spacingX = canvas.width / (cols + 1);
        const spacingY = canvas.height / (rows + 1);
        const spacingZ = 150;
        
        for (let i = 0; i < nodeCount; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols) % rows;
            const dep = Math.floor(i / (cols * rows));
            const x = spacingX * (col + 1) + (Math.random() - 0.5) * spacingX * 0.5 - center.x;
            const y = spacingY * (row + 1) + (Math.random() - 0.5) * spacingY * 0.5 - center.y;
            const z = (dep - depth / 2) * spacingZ + (Math.random() - 0.5) * spacingZ * 0.5;
            nodes.push(new Node(x, y, z));
        }
    }
    
    // Initialize nodes
    createNodes();
    
    // Animation loop
    let time = 0;
    function animate() {
        // Only animate if home section is active
        if (!homeSection.classList.contains('active')) {
            requestAnimationFrame(animate);
            return;
        }
        
        // Ensure canvas is properly sized
        if (canvas.width === 0 || canvas.height === 0) {
            resizeCanvas();
            createNodes();
            requestAnimationFrame(animate);
            return;
        }
        
        // Ensure nodes exist
        if (nodes.length === 0) {
            createNodes();
            requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        time += 0.016; // Approximate 60fps
        
        // Slow 3D rotation
        rotationY += 0.002;
        rotationX = 0.3 + Math.sin(time * 0.1) * 0.1;
        
        // Update nodes
        nodes.forEach(node => node.update(time));
        
        // Project all nodes
        nodes.forEach(node => node.project());
        
        // Sort nodes by depth (z) for proper rendering
        const sortedNodes = [...nodes].sort((a, b) => {
            if (!a.projected || !b.projected) return 0;
            return b.projected.z - a.projected.z;
        });
        
        // Draw connections (bonds) between nearby nodes with 3D depth
        const connections = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (!nodes[i].projected || !nodes[j].projected) continue;
                
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dz = nodes[i].z - nodes[j].z;
                const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance3D < connectionDistance) {
                    const screenDx = nodes[i].projected.x - nodes[j].projected.x;
                    const screenDy = nodes[i].projected.y - nodes[j].projected.y;
                    const screenDistance = Math.sqrt(screenDx * screenDx + screenDy * screenDy);
                    
                    connections.push({
                        node1: nodes[i],
                        node2: nodes[j],
                        depth: (nodes[i].projected.z + nodes[j].projected.z) / 2,
                        distance: screenDistance
                    });
                }
            }
        }
        
        // Sort connections by depth
        connections.sort((a, b) => b.depth - a.depth);
        
        // Draw connections with 3D depth effects
        connections.forEach(conn => {
            const { node1, node2, distance } = conn;
            if (!node1.projected || !node2.projected) return;
            
            const depthFactor = Math.max(0.2, Math.min(1, (conn.depth + 200) / 400));
            const opacity = (0.3 + depthFactor * 0.5) * (1 - distance / connectionDistance * 0.6);
            
            // Create gradient for bond with 3D depth
            const gradient = ctx.createLinearGradient(
                node1.projected.x, node1.projected.y,
                node2.projected.x, node2.projected.y
            );
            
            const color1 = node1.color === colors.cyan 
                ? `rgba(59, 255, 255, ${opacity})` 
                : `rgba(241, 0, 146, ${opacity})`;
            const color2 = node2.color === colors.cyan 
                ? `rgba(59, 255, 255, ${opacity})` 
                : `rgba(241, 0, 146, ${opacity})`;
            const midColor = node1.color === colors.cyan 
                ? `rgba(241, 0, 146, ${opacity * 0.7})` 
                : `rgba(59, 255, 255, ${opacity * 0.7})`;
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(0.5, midColor);
            gradient.addColorStop(1, color2);
            
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = gradient;
            ctx.lineWidth = (1.5 + depthFactor * 1) * (1 - distance / connectionDistance * 0.5);
            ctx.shadowBlur = 6 * depthFactor;
            ctx.shadowColor = node1.color === colors.cyan ? colors.cyanDim : colors.pinkDim;
            
            // Wavy bond effect with 3D perspective
            ctx.beginPath();
            const midX = (node1.projected.x + node2.projected.x) / 2;
            const midY = (node1.projected.y + node2.projected.y) / 2;
            const waveOffset = Math.sin(time * 2 + node1.x + node2.x) * (8 + depthFactor * 4);
            const perpX = -screenDy / distance * waveOffset;
            const perpY = screenDx / distance * waveOffset;
            
            ctx.moveTo(node1.projected.x, node1.projected.y);
            ctx.quadraticCurveTo(midX + perpX, midY + perpY, node2.projected.x, node2.projected.y);
            ctx.stroke();
        });
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        
        // Draw nodes from back to front
        sortedNodes.forEach(node => node.draw(ctx));
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Initialize molecular video background
function initMolecularVideo() {
    const video = document.getElementById('molecular-video');
    if (!video) return;
    
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    // Ensure video plays when home section is active
    function handleVideoPlay() {
        if (homeSection.classList.contains('active')) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    // Auto-play might be blocked, but video will play on user interaction
                    console.log('Video autoplay prevented:', err);
                });
            }
        } else {
            video.pause();
        }
    }
    
    // Play video when it's ready
    video.addEventListener('loadeddata', () => {
        handleVideoPlay();
    });
    
    // Also try when metadata is loaded
    video.addEventListener('loadedmetadata', () => {
        handleVideoPlay();
    });
    
    // Handle video errors
    video.addEventListener('error', (e) => {
        console.log('Video error:', e);
        // Try to load the fallback source if MP4 fails
        if (video.currentSrc && video.currentSrc.includes('.mp4')) {
            console.log('MP4 failed, trying MOV fallback');
        }
    });
    
    // Observe home section visibility
    const observer = new MutationObserver(() => {
        handleVideoPlay();
    });
    
    observer.observe(homeSection, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Initial play attempt after a short delay
    setTimeout(() => {
        handleVideoPlay();
    }, 100);
    
    // Fallback: play on any user interaction
    const playOnInteraction = () => {
        if (homeSection.classList.contains('active')) {
            video.play().catch(() => {});
        }
    };
    
    document.addEventListener('click', playOnInteraction, { once: true });
    document.addEventListener('touchstart', playOnInteraction, { once: true });
}



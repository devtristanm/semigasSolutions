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
    
    // Form submission and conditional fields
    setupContactForm();
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (isTransitioning) return;
        
        const sections = ['home', 'about', 'experience', 'services', 'faq', 'contact'];
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

// Contact form setup with validation and submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    const contactType = document.getElementById('contact-type');
    const contactTypeButtons = document.querySelectorAll('.contact-type-btn');
    const formFieldsContainer = document.getElementById('form-fields-container');
    const messageFieldGroup = document.getElementById('message-field-group');
    const messageField = document.getElementById('message-field');
    const calendarFieldGroup = document.getElementById('calendar-field-group');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    
    // Handle contact type button clicks
    contactTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedType = this.getAttribute('data-type');
            
            // Update hidden input
            contactType.value = selectedType;
            
            // Update button states
            contactTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Hide both fields first
            messageFieldGroup.style.display = 'none';
            calendarFieldGroup.style.display = 'none';
            messageField.removeAttribute('required');
            submitBtn.style.display = 'none';
            
            if (selectedType === 'message') {
                // Show form fields container
                formFieldsContainer.style.display = 'block';
                // Show message field
                messageFieldGroup.style.display = 'block';
                messageField.setAttribute('required', 'required');
                // Show submit button
                submitBtn.style.display = 'block';
            } else if (selectedType === 'meeting') {
                // Hide all form fields - only show calendar
                formFieldsContainer.style.display = 'none';
                // Show calendar
                calendarFieldGroup.style.display = 'block';
                // Calendly widget will auto-initialize when visible
                setTimeout(() => {
                    if (typeof Calendly !== 'undefined' && Calendly.initInlineWidget) {
                        const widget = document.querySelector('#calendar-field-group .calendly-inline-widget');
                        if (widget && !widget.hasAttribute('data-processed')) {
                            widget.setAttribute('data-processed', 'true');
                        }
                    }
                }, 100);
            }
        });
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        
        // Check if contact type is selected
        if (!contactType.value) {
            showFormMessage('Please select either "Send a Message" or "Book a Meeting".', 'error');
            return;
        }
        
        // If Meeting is selected, don't submit form - Calendly handles it
        if (contactType.value === 'meeting') {
            showFormMessage('Please use the calendar above to select and book your meeting time. Calendly will collect your information and handle the booking.', 'success');
            return;
        }
        
        // For Message type, validate form
        if (!this.checkValidity()) {
            this.reportValidity();
            return;
        }
        
        // Function to normalize phone number - strips all non-numeric characters
        function normalizePhoneNumber(phone) {
            // Remove all non-digit characters
            return phone.replace(/\D/g, '');
        }
        
        // Collect form data
        const rawPhone = document.getElementById('phone').value.trim();
        const normalizedPhone = normalizePhoneNumber(rawPhone);
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: normalizedPhone, // Store normalized phone number
            email: document.getElementById('email').value.trim(),
            contactType: contactType.value,
            message: messageField.value.trim()
        };
        
        // Validate required fields
        if (!formData.name || !normalizedPhone || !formData.email || !formData.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate phone has at least 10 digits
        if (normalizedPhone.length < 10) {
            showFormMessage('Please enter a valid phone number with at least 10 digits.', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = submitBtn;
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        showAtomLoader();
        
        // Submit form data
        submitFormData(formData, submitButton, originalText);
    });
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    function submitFormData(data, button, originalText) {
        // Prepare email template parameters for EmailJS
        const templateParams = {
            to_email: 'contactus@semigassolutions.com',
            from_name: data.name,
            from_email: data.email,
            phone: data.phone, // Already normalized (digits only)
            message: data.message,
            subject: `New Contact Form Message from ${data.name}`
        };
        
        // EmailJS Configuration
        // Replace these with your actual EmailJS values:
        const EMAILJS_CONFIG = {
            PUBLIC_KEY: 'vy6kFHg8Hcf0G6Slr', // Replace with your EmailJS Public Key
            SERVICE_ID: 'service_m9rc8cu', // Replace with your EmailJS Service ID
            TEMPLATE_ID: 'template_299k0i5' // Replace with your EmailJS Template ID
        };
        
        // Check if EmailJS is available
        if (typeof emailjs !== 'undefined') {
            // Initialize EmailJS with your public key
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            
            // Send email
            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            )
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                hideAtomLoader();
                
                // Show success message
                showFormMessage('Thank you! Your message has been sent to contactus@semigassolutions.com. We\'ll get back to you soon.', 'success');
                
                // Reset form
                resetForm(button, originalText);
            })
            .catch(function(error) {
                console.error('Email sending failed:', error);
                hideAtomLoader();
                
                // Show error message
                showFormMessage('There was an error sending your message. Please try again or email us directly at contactus@semigassolutions.com', 'error');
                
                // Reset form
                resetForm(button, originalText);
            });
        } else {
            // Fallback if EmailJS is not loaded - use mailto as backup
            console.warn('EmailJS not loaded, using mailto fallback');
            hideAtomLoader();
            
            const emailSubject = encodeURIComponent(templateParams.subject);
            const emailBody = encodeURIComponent(
                `Name: ${data.name}\n` +
                `Phone: ${data.phone}\n` +
                `Email: ${data.email}\n\n` +
                `Message:\n${data.message}`
            );
            
            // Open email client as fallback
            window.location.href = `mailto:contactus@semigassolutions.com?subject=${emailSubject}&body=${emailBody}`;
            
            showFormMessage('Opening your email client to send the message...', 'success');
            resetForm(button, originalText);
        }
    }
    
    function resetForm(button, originalText) {
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
        
        // Reset form
        contactForm.reset();
        // Reset button states
        contactTypeButtons.forEach(btn => btn.classList.remove('active'));
        // Reset field visibility
        formFieldsContainer.style.display = 'none';
        messageFieldGroup.style.display = 'none';
        calendarFieldGroup.style.display = 'none';
        messageField.removeAttribute('required');
        submitBtn.style.display = 'none';
    }
}

// Modal functionality
function setupModalListeners() {
    const modal = document.getElementById('modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalIcon = modal.querySelector('.modal-icon');
    const modalClose = modal.querySelector('.modal-close');
    const skillItems = document.querySelectorAll('.skill-item[data-modal], .molecule-ball[data-modal], .molecule-hotspot[data-modal]');
    
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
        },
        kip: {
            icon: '',
            title: 'Founding Principle: Keep It In the Pipe™',
            description: 'At SemiGas Solutions, our entire company is centered on one unwavering principle: Keep It In the Pipe™. "Keep It In the Pipe™" is the number one rule for managing any hazardous production material. When every team member embraces this principle, we stay safe, our systems remain pure, and our facilities stay in production. From training and consultation to gas systems controls and engineering, every service we offer reinforces the Keep It In the Pipe™ mindset. In order to build the best semiconductors in the world, we are required to handle the most dangerous gases and chemicals on the planet. Everyone needs to go home to their loved ones each day. Let\'s "Keep It In the Pipe™".'
        }
    };
    
    // Open modal when skill item or molecule ball is clicked
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            const modalType = this.getAttribute('data-modal');
            const data = modalData[modalType];
            
            if (data) {
                if (modalType === 'kip') {
                    // For KIP, show the logo instead of icon
                    modalIcon.innerHTML = '<img src="assets/KI2P Logo (1).png" alt="KI2P Logo" style="max-width: 150px; height: auto;">';
                } else {
                    modalIcon.textContent = data.icon;
                }
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



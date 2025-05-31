// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', init);



// Color themes from the main app
const colorThemes = {
    gradient1: { // Neon Pulse
        colors: ['#ff00cc', '#00ffff', '#ff00cc'],
        background: 'rgba(18, 18, 18, 0.7)'
    },
    gradient2: { // Ocean Waves
        colors: ['#00c6fb', '#005bea', '#00c6fb'],
        background: 'rgba(18, 18, 18, 0.7)'
    },
    gradient3: { // Fire Ember
        colors: ['#ff0844', '#ffb199', '#ff0844'],
        background: 'rgba(18, 18, 18, 0.7)'
    },
    gradient4: { // Galaxy
        colors: ['#8e2de2', '#4a00e0', '#8e2de2'],
        background: 'rgba(18, 18, 18, 0.7)'
    }
};

// Initialize everything
function init() {
    // Hide loading screen
    hideLoadingScreen();

    // Setup animations
    setupScrollAnimations();

    // Setup mobile navigation
    setupMobileNav();

    // Setup hero canvas animation
    setupHeroAnimation();

    // Setup demo previews
    setupDemoPreviews();

    // Setup FAQ functionality
    setupFAQ();

    // Setup theme toggle
    setupThemeToggle();

    // Setup accessibility features
    setupAccessibility();

    // Add scroll event to handle sticky navigation
    window.addEventListener('scroll', handleScroll);

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Setup enhanced button effects
    setupButtonEffects();
}

// Hide loading screen
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    }
}

// Enhanced theme toggle with staggered animations and effects
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    themeToggle.addEventListener('click', (e) => {
        // Prevent multiple rapid clicks
        if (themeToggle.classList.contains('rotating')) return;

        // Create ripple effect
        createRippleEffect(e, themeToggle);

        // Add rotation animation
        themeToggle.classList.add('rotating');
        setTimeout(() => {
            themeToggle.classList.remove('rotating');
        }, 600);

        if (prefersReducedMotion) {
            // Instant theme change for reduced motion
            toggleThemeInstant();
        } else {
            // Enhanced theme transition with blur-to-clear effects
            performEnhancedThemeTransition();
        }

        // Update aria-label
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.setAttribute('aria-label',
            isLight ? 'Switch to dark theme' : 'Switch to light theme'
        );
    });
}

// Create ripple effect on theme toggle click
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Instant theme toggle for reduced motion
function toggleThemeInstant() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Enhanced theme transition with staggered animations for homepage
function performEnhancedThemeTransition() {
    const elementsToAnimate = [
        { selector: '.nav-container', delay: 0 },
        { selector: '.hero, .features, .demos, .how-it-works, .faq', delay: 50 },
        { selector: '.feature-card, .demo-item, .step-content, .faq-item', delay: 100 },
        { selector: '.github-pill, .theme-toggle', delay: 150 },
        { selector: '.animated-background, .gradient-blob', delay: 200 }
    ];

    // Add transitioning class to prevent interactions
    document.body.classList.add('theme-transitioning');

    // Phase 1: Blur out elements with staggered timing
    elementsToAnimate.forEach(({ selector, delay }) => {
        setTimeout(() => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('blur-out');
            });
        }, delay);
    });

    // Phase 2: Toggle theme at midpoint
    setTimeout(() => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    }, 350); // Midpoint of 0.7s transition

    // Phase 3: Blur in elements with staggered timing
    setTimeout(() => {
        elementsToAnimate.forEach(({ selector, delay }) => {
            setTimeout(() => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.classList.remove('blur-out');
                    el.classList.add('blur-in');
                });
            }, delay);
        });
    }, 400);

    // Phase 4: Clean up classes
    setTimeout(() => {
        elementsToAnimate.forEach(({ selector }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.remove('blur-out', 'blur-in');
            });
        });
        document.body.classList.remove('theme-transitioning');
    }, 900); // Allow time for all animations to complete
}

// Handle scroll events for pill navigation
function handleScroll() {
    const nav = document.querySelector('nav');
    const navContainer = document.querySelector('.nav-container');

    if (!nav || !navContainer) return;

    // Enhanced scroll effects for pill navigation
    if (window.scrollY > 20) {
        navContainer.style.background = 'rgba(18, 18, 18, 0.95)';
        navContainer.style.backdropFilter = 'blur(25px)';
        navContainer.style.boxShadow = `
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(108, 99, 255, 0.15),
            0 0 60px rgba(108, 99, 255, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `;
        navContainer.style.borderColor = 'rgba(108, 99, 255, 0.25)';
    } else {
        navContainer.style.background = 'rgba(18, 18, 18, 0.85)';
        navContainer.style.backdropFilter = 'blur(20px)';
        navContainer.style.boxShadow = `
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(108, 99, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `;
        navContainer.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
}

// Enhanced scroll animations with staggered timing and blur effects
function setupScrollAnimations() {
    // Define animation types for different elements
    const animationConfig = {
        '.features-grid .feature-card': { animation: 'blur-to-focus', stagger: 0.15 },
        '.demo-grid .demo-item': { animation: 'scale-in-blur', stagger: 0.2 },
        '.steps-container .step': { animation: 'slide-in-left', stagger: 0.25 },
        '.about-content': { animation: 'blur-to-focus', stagger: 0 },
        '.faq-container .faq-item': { animation: 'slide-in-right', stagger: 0.15 },
        '.hero-stats .stat-item': { animation: 'scale-in-blur', stagger: 0.15 }
    };

    // Create intersection observer with enhanced options
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Find matching animation config
                for (const [selector, config] of Object.entries(animationConfig)) {
                    if (element.matches(selector.split(' ').pop())) {
                        // Apply animation class
                        element.classList.add(config.animation);

                        // Add stagger delay if it's part of a group
                        const parent = element.closest(selector.split(' ')[0]);
                        if (parent && config.stagger > 0) {
                            const siblings = parent.querySelectorAll(selector.split(' ').pop());
                            const index = Array.from(siblings).indexOf(element);
                            element.style.animationDelay = `${index * config.stagger}s`;
                        }
                        break;
                    }
                }

                // Fallback to fade-in for other elements
                if (!element.classList.contains('blur-to-focus') &&
                    !element.classList.contains('scale-in-blur') &&
                    !element.classList.contains('slide-in-left') &&
                    !element.classList.contains('slide-in-right')) {
                    element.classList.add('fade-in');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully visible
    });

    // Observe all animation elements
    Object.keys(animationConfig).forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    });

    // Also observe container elements for fallback
    const containerElements = document.querySelectorAll('.features-grid, .demo-grid, .steps-container, .about-content, .faq-container');
    containerElements.forEach(el => observer.observe(el));
}

// Setup mobile navigation
function setupMobileNav() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (!mobileMenuIcon || !mobileNav) return;

    // Open mobile navigation
    mobileMenuIcon.addEventListener('click', () => {
        openMobileNav();
    });

    // Close mobile navigation
    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', () => {
            closeMobileNav();
        });
    }

    // Close mobile navigation when clicking overlay
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', () => {
            closeMobileNav();
        });
    }

    // Close mobile navigation when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    function openMobileNav() {
        mobileNav.classList.add('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileMenuIcon.setAttribute('aria-expanded', 'true');

        // Focus first link
        const firstLink = mobileNav.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    function closeMobileNav() {
        mobileNav.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileMenuIcon.setAttribute('aria-expanded', 'false');

        // Return focus to menu button
        mobileMenuIcon.focus();
    }
}

// Setup hero canvas animation
function setupHeroAnimation() {
    const heroCanvas = document.getElementById('heroCanvas');
    if (!heroCanvas) return;
    
    const ctx = heroCanvas.getContext('2d');
    let canvasWidth = heroCanvas.offsetWidth;
    let canvasHeight = heroCanvas.offsetHeight;
    
    // Set actual canvas dimensions
    heroCanvas.width = canvasWidth;
    heroCanvas.height = canvasHeight;
    
    // Audio context for generating demo data
    let audioData = [];
    
    // Generate some demo data with a sine wave pattern
    for (let i = 0; i < 128; i++) {
        audioData[i] = 128 + 120 * Math.sin(i * 0.1);
    }
    
    function animate() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw a gradient background
        const theme = colorThemes.gradient1;
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        theme.colors.forEach((color, i) => {
            gradient.addColorStop(i / (theme.colors.length - 1), color);
        });
        
        // Fill background
        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw bars
        const barWidth = canvasWidth / audioData.length;
        const barSpacing = 2;
        const barMaxHeight = canvasHeight * 0.8;
        
        ctx.fillStyle = gradient;
        
        for (let i = 0; i < audioData.length; i++) {
            // Update demo data with a moving wave
            audioData[i] = 128 + 120 * Math.sin((i * 0.1) + (Date.now() * 0.002));
            
            const value = audioData[i] / 255;
            const barHeight = value * barMaxHeight;
            
            ctx.fillRect(
                i * barWidth + barSpacing / 2,
                canvasHeight - barHeight,
                barWidth - barSpacing,
                barHeight
            );
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvasWidth = heroCanvas.offsetWidth;
        canvasHeight = heroCanvas.offsetHeight;
        heroCanvas.width = canvasWidth;
        heroCanvas.height = canvasHeight;
    });
    
    // Start the animation
    animate();
}

// Setup demo previews
function setupDemoPreviews() {
    const demoItems = document.querySelectorAll('.demo-item');
    
    demoItems.forEach(item => {
        const canvas = item.querySelector('.demo-canvas');
        if (!canvas) return;
        
        const type = item.dataset.type;
        const theme = item.dataset.theme;
        
        setupDemoCanvas(canvas, type, theme);
    });
}

// Setup a single demo canvas
function setupDemoCanvas(canvas, type, theme) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let canvasWidth = canvas.offsetWidth;
    let canvasHeight = canvas.offsetHeight;
    
    // Set actual canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Audio data for demo
    let audioData = [];
    
    // Generate some demo data
    for (let i = 0; i < 64; i++) {
        audioData[i] = 128 + 120 * Math.sin(i * 0.2);
    }
    
    function animate() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Get the theme colors
        const themeData = colorThemes[theme] || colorThemes.gradient1;
        
        // Draw background
        ctx.fillStyle = themeData.background;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw the visualization based on type
        switch(type) {
            case 'bars':
                drawBars(ctx, audioData, canvasWidth, canvasHeight, themeData);
                break;
            case 'wave':
                drawWave(ctx, audioData, canvasWidth, canvasHeight, themeData);
                break;
            case 'circular':
                drawCircular(ctx, audioData, canvasWidth, canvasHeight, themeData);
                break;
            default:
                drawBars(ctx, audioData, canvasWidth, canvasHeight, themeData);
        }
        
        // Update the audio data for animation
        for (let i = 0; i < audioData.length; i++) {
            audioData[i] = 128 + 120 * Math.sin((i * 0.2) + (Date.now() * 0.002));
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();
}

// Draw bars visualization
function drawBars(ctx, data, width, height, theme) {
    const barWidth = width / data.length;
    const barSpacing = 1;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    theme.colors.forEach((color, i) => {
        gradient.addColorStop(i / (theme.colors.length - 1), color);
    });
    
    ctx.fillStyle = gradient;
    
    for (let i = 0; i < data.length; i++) {
        const value = data[i] / 255;
        const barHeight = value * height * 0.8;
        
        ctx.fillRect(
            i * barWidth + barSpacing / 2,
            height - barHeight,
            barWidth - barSpacing,
            barHeight
        );
    }
}

// Draw wave visualization
function drawWave(ctx, data, width, height, theme) {
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    theme.colors.forEach((color, i) => {
        gradient.addColorStop(i / (theme.colors.length - 1), color);
    });
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const sliceWidth = width / data.length;
    let x = 0;
    
    for (let i = 0; i < data.length; i++) {
        const v = data[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
    }
    
    ctx.lineTo(width, height / 2);
    ctx.stroke();
}

// Draw circular visualization
function drawCircular(ctx, data, width, height, theme) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(
        centerX - radius, 
        centerY - radius, 
        centerX + radius, 
        centerY + radius
    );
    theme.colors.forEach((color, i) => {
        gradient.addColorStop(i / (theme.colors.length - 1), color);
    });
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i < data.length; i += 2) {
        const angle = Math.PI * 2 / (data.length / 2) * (i / 2);
        const amplitude = data[i] / 255;
        const dynamicRadius = radius * (0.7 + amplitude * 0.3);
        
        const x = centerX + Math.cos(angle) * dynamicRadius;
        const y = centerY + Math.sin(angle) * dynamicRadius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
}

// Setup FAQ functionality
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Toggle current FAQ item
            question.setAttribute('aria-expanded', !isExpanded);
            if (answer) {
                answer.setAttribute('aria-hidden', isExpanded);
            }
        });

        // Keyboard support
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
}

// Setup accessibility features
function setupAccessibility() {
    // Add focus indicators for keyboard navigation
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');

    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('keyboard-focus');
        });

        element.addEventListener('blur', () => {
            element.classList.remove('keyboard-focus');
        });
    });

    // Announce page changes for screen readers
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionTitle = entry.target.querySelector('h2');
                if (sectionTitle) {
                    // Update page title for screen readers
                    document.title = `SoundWave - ${sectionTitle.textContent}`;
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip to main content with Alt+M
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Toggle theme with Alt+T
        if (e.altKey && e.key === 't') {
            e.preventDefault();
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.click();
            }
        }

        // Open mobile menu with Alt+N
        if (e.altKey && e.key === 'n') {
            e.preventDefault();
            const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
            if (mobileMenuIcon && window.innerWidth <= 768) {
                mobileMenuIcon.click();
            }
        }
    });
}



// Setup button ripple effects and enhanced interactions
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.launch-btn, .primary-button, .secondary-button');

    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
}

// Create ripple effect on button click
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 400);
}



// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initTerminalLoading();
    initThemeToggle();
    initNavigation();
    initTypingEffect();
    initParticles();
    initScrollAnimations();
    initStatsCounter();
    initSkillBars();
    initContactForm();
    initResumeModal();
    initMobileMenu();
    initProfilePhoto();
    initCustomCursor();
    
    // Terminal Loading Animation
    function initTerminalLoading() {
        const terminal = document.getElementById('terminal-loading');
        if (!terminal) return;
        
        const lines = terminal.querySelectorAll('.terminal-line');
        
        // Animate terminal lines one by one
        lines.forEach((line, index) => {
            setTimeout(() => {
                const typingText = line.querySelector('.typing-text');
                if (!typingText) return;
                
                const originalText = typingText.textContent;
                typingText.textContent = '';
                typingText.style.borderRight = '2px solid #32c7d1';
                
                let charIndex = 0;
                const typeInterval = setInterval(() => {
                    if (charIndex < originalText.length) {
                        typingText.textContent += originalText.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                        typingText.style.borderRight = 'none';
                    }
                }, 50);
            }, index * 800);
        });
        
        // Hide terminal after animation
        setTimeout(() => {
            terminal.classList.add('fade-out');
            setTimeout(() => {
                terminal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }, 4000);
    }
    
    // Theme Toggle - FIXED
    function initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;
        
        const body = document.body;
        
        // Load saved theme or default to light
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-color-scheme', savedTheme);
        
        console.log('Theme toggle initialized, current theme:', savedTheme);
        
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = body.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('Switching theme from', currentTheme, 'to', newTheme);
            
            body.setAttribute('data-color-scheme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Show notification
            showNotification(`Switched to ${newTheme} mode`, 'success');
        });
    }
    
    // Navigation - FIXED with proper smooth scrolling
    function initNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        console.log('Navigation initialized with', navLinks.length, 'links and', sections.length, 'sections');
        
        // Smooth scroll for navigation links - ENHANCED
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = link.getAttribute('data-target') || link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                console.log('Navigating to section:', targetId);
                
                if (targetSection) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const offsetTop = targetSection.offsetTop - navbarHeight - 20;
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: Math.max(0, offsetTop),
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    updateActiveNavLink(targetId);
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const mobileToggle = document.getElementById('mobile-menu-toggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (mobileToggle) mobileToggle.classList.remove('active');
                    }
                } else {
                    console.warn('Target section not found:', targetId);
                }
            });
        });
        
        // Update active nav link
        function updateActiveNavLink(activeId = null) {
            if (activeId) {
                // Directly set active link
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-target="${activeId}"], .nav-link[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    console.log('Set active link:', activeId);
                }
                return;
            }
            
            // Auto-detect active section on scroll
            const scrollPos = window.scrollY + 100;
            let currentSection = 'home'; // default
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop - 50 && scrollPos < sectionTop + sectionHeight - 50) {
                    currentSection = sectionId;
                }
            });
            
            // Update active state
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-target="${currentSection}"], .nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Navbar effects on scroll
        function updateNavbar() {
            if (!navbar) return;
            
            const isScrolled = window.scrollY > 50;
            if (isScrolled) {
                navbar.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.4)';
            } else {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            }
        }
        
        // Set initial active link
        updateActiveNavLink('home');
        
        window.addEventListener('scroll', throttle(() => {
            updateActiveNavLink();
            updateNavbar();
        }, 100));
    }
    
    // Profile Photo Loading - ENHANCED
    function initProfilePhoto() {
        const profilePhoto = document.getElementById('profile-photo');
        const fallback = document.getElementById('avatar-fallback');
        
        if (!profilePhoto || !fallback) return;
        
        console.log('Initializing profile photo...');
        
        // Show fallback initially
        profilePhoto.classList.add('loading');
        fallback.classList.add('show');
        
        // Handle successful load
        profilePhoto.addEventListener('load', () => {
            console.log('✅ Profile photo loaded successfully');
            profilePhoto.classList.remove('loading');
            profilePhoto.classList.add('loaded');
            fallback.classList.remove('show');
            showNotification('Profile photo loaded!', 'success');
        });
        
        // Handle error
        profilePhoto.addEventListener('error', () => {
            console.log('❌ Profile photo failed to load, using fallback');
            profilePhoto.classList.add('error');
            fallback.classList.add('show');
            showNotification('Using fallback avatar', 'info');
        });
        
        // Check if image is already loaded (cached)
        if (profilePhoto.complete && profilePhoto.naturalHeight !== 0) {
            console.log('Profile photo was already cached');
            profilePhoto.classList.remove('loading');
            profilePhoto.classList.add('loaded');
            fallback.classList.remove('show');
        } else if (profilePhoto.complete && profilePhoto.naturalHeight === 0) {
            // Image failed to load
            profilePhoto.classList.add('error');
            fallback.classList.add('show');
        }
        
        // Fallback timeout in case events don't fire
        setTimeout(() => {
            if (profilePhoto.classList.contains('loading')) {
                console.log('Profile photo timeout, showing fallback');
                profilePhoto.classList.add('error');
                fallback.classList.add('show');
            }
        }, 5000);
    }
    
    // Typing Effect
    function initTypingEffect() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const texts = ['Cybersecurity Learner', 'Data Analyst', 'Full Stack Developer', 'Problem Solver'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseDuration = 2000;
        
        function typeText() {
            const currentText = texts[textIndex];
            
            if (!isDeleting) {
                // Typing
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                
                if (charIndex === currentText.length) {
                    setTimeout(() => {
                        isDeleting = true;
                        typeText();
                    }, pauseDuration);
                    return;
                }
            } else {
                // Deleting
                typingElement.textContent = currentText.substring(0, charIndex);
                charIndex--;
                
                if (charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                }
            }
            
            const speed = isDeleting ? deletingSpeed : typingSpeed;
            setTimeout(typeText, speed);
        }
        
        // Start typing effect after terminal animation
        setTimeout(typeText, 5000);
    }
    
    // Particle System
    function initParticles() {
        const particlesContainer = document.getElementById('particles-container');
        if (!particlesContainer) return;
        
        const particleCount = 30;
        
        function createParticle() {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const startX = Math.random() * window.innerWidth;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 5;
            const opacity = Math.random() * 0.5 + 0.3;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--color-primary);
                border-radius: 50%;
                left: ${startX}px;
                bottom: -10px;
                opacity: ${opacity};
                animation: float ${duration}s linear infinite;
                animation-delay: ${delay}s;
                pointer-events: none;
            `;
            
            particlesContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, (duration + delay) * 1000);
        }
        
        // Create initial particles
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => createParticle(), i * 200);
        }
        
        // Continuously create new particles
        setInterval(createParticle, 1000);
    }
    
    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        const elementsToAnimate = document.querySelectorAll(
            'section, .project-card, .skill-category, .stat-item, .timeline-item, .cert-item'
        );
        
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Stats Counter Animation - FIXED with correct values
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let hasAnimated = false;
        
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateStats();
                }
            });
        });
        
        const statsRow = document.querySelector('.stats-row');
        if (statsRow) {
            statsObserver.observe(statsRow);
        }
        
        function animateStats() {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const steps = 60;
                const stepValue = target / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += stepValue;
                    if (current >= target) {
                        stat.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, duration / steps);
            });
        }
    }
    
    // Skill Bars Animation
    function initSkillBars() {
        const skillItems = document.querySelectorAll('.skill-item');
        let hasAnimated = false;
        
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateSkillBars();
                }
            });
        });
        
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            skillsObserver.observe(skillsSection);
        }
        
        function animateSkillBars() {
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    const progress = item.querySelector('.skill-progress');
                    if (progress) {
                        const width = progress.getAttribute('data-width');
                        progress.style.width = width;
                    }
                }, index * 100);
            });
        }
    }
    
    // Contact Form
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Create mailto link
            const mailtoLink = `mailto:pranchal2213081@akgec.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showNotification('Thank you! Your email client should open now.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Resume Modal - ENHANCED
    function initResumeModal() {
        const modal = document.getElementById('resume-modal');
        const downloadBtn = document.getElementById('download-resume');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('modal-cancel');
        const backdrop = document.getElementById('modal-backdrop');
        const pdfDownloadBtn = document.getElementById('download-pdf-btn');
        
        if (!modal || !downloadBtn) return;
        
        // Open modal
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Opening resume modal');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal function
        function closeModal() {
            console.log('Closing resume modal');
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Close modal event listeners
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        if (backdrop) backdrop.addEventListener('click', closeModal);
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
        
        // Handle PDF download button in modal
        if (pdfDownloadBtn) {
            pdfDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Create enhanced resume content
                const resumeContent = `
PRANCHAL KATIYAR
Full Stack Developer | Data Analyst | Python Programmer

Contact Information:
Email: pranchal2213081@akgec.ac.in
Phone: +91-6386975021
Location: Uttar Pradesh, India
LinkedIn: https://linkedin.com/in/pranchal-katiyar
GitHub: https://github.com/PranchalKatiyar

EDUCATION
Bachelor of Technology (B.Tech) - Information Technology
Ajay Kumar Garg Engineering College
Dr. A.P.J. Abdul Kalam Technical University (AKTU)
Expected Graduation: June 2026

TECHNICAL SKILLS
Programming Languages: Python, JavaScript, SQL, HTML5, CSS3, Java
Frontend Development: React.js, Angular, Vue.js, HTML5, CSS3, Bootstrap, Responsive Design
Backend Development: Node.js, Express.js, Django, Flask, REST APIs, GraphQL
Databases: MySQL, PostgreSQL, MongoDB, NoSQL, Database Design, Query Optimization
Cloud & DevOps: AWS (EC2, S3, Lambda), Google Cloud Platform, Docker, CI/CD Pipelines
Data Analytics: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Statistical Analysis
Tools & Technologies: Power BI, Tableau, Google Analytics, Git, VS Code, Jupyter Notebook, PyCharm, Postman, Jira

FEATURED PROJECTS

1. Full-Stack E-Commerce Platform
Technologies: MongoDB, Express.js, React.js, Node.js, AWS
• Developed responsive e-commerce application with user authentication and payment integration
• Implemented RESTful APIs reducing load time by 40%
• Achieved 99.9% uptime with AWS deployment and CI/CD pipeline
• Built inventory management system handling 1000+ products

2. Student Performance Prediction System
Technologies: Python, Scikit-learn, Pandas, Flask, SQL
• Built machine learning model achieving 85% prediction accuracy
• Processed 5000+ student records for analysis
• Designed interactive web interface for real-time predictions
• Implemented data visualization for performance insights

3. Real-Time Sales Analytics Dashboard
Technologies: Power BI, SQL, Python, Excel
• Developed comprehensive dashboard displaying 15+ KPIs
• Improved data accuracy by 30% through automated ETL pipelines
• Implemented advanced SQL queries for real-time data processing
• Achieved 50% faster reporting for business analysis

4. Movie Recommendation Web App
Technologies: Python, React.js, Flask, Pandas, Machine Learning
• Built full-stack recommendation system using collaborative filtering
• Performed EDA on 10,000+ IMDB movie records
• Deployed on AWS supporting 100+ concurrent users
• Implemented user authentication and personalized recommendations

EXPERIENCE

Coordinator | Renaissance AKGEC | January 2023 - Present
• Led cross-functional team of 50+ students in organizing 10+ college events
• Managed project budgets exceeding ₹5 lakhs with zero delays
• Implemented agile methodologies reducing event preparation time by 25%
• Mentored junior team members in leadership and project management
• Coordinated with stakeholders for events with 2000+ participants

Volunteer | NayePankh Foundation | December 2022 - Present
• Contributed to data-driven social initiatives supporting 500+ individuals
• Developed data collection systems to track program effectiveness
• Collaborated with government officials and NGO partners
• Built technology solutions for community impact measurement

CERTIFICATIONS
• Google Data Analytics Professional Certificate - Coursera (2024)
• Python for Data Science - IBM/Udemy (2024)
• SQL for Data Analysts - DataCamp (2024)
• Microsoft Power BI Essentials - Great Learning (2024)
• JavaScript ES6+ and React.js - Udemy (2024)
• AWS Cloud Fundamentals - In Progress (2025)

KEY ACHIEVEMENTS
• 15+ Projects Completed with outstanding results
• 50+ Students Helped through mentoring and technical guidance
• 20+ Professional Certifications in cutting-edge technologies
• 500+ People Impacted through social technology initiatives
• 85% accuracy achieved in machine learning models
• 40% improvement in application performance optimization

COURSEWORK
Data Structures & Algorithms, Database Management Systems, Software Engineering, 
Web Development, Machine Learning, Cloud Computing, Cybersecurity Fundamentals, 
Statistical Analysis, System Design, API Development
                `;
                
                // Create and download the file
                const blob = new Blob([resumeContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Pranchal_Katiyar_Resume_2025.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showNotification('Resume downloaded successfully!', 'success');
                closeModal();
            });
        }
    }
    
    // Mobile Menu - ENHANCED
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (!mobileToggle || !navMenu) return;
        
        console.log('Mobile menu initialized');
        
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                console.log('Mobile menu closed');
            } else {
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
                console.log('Mobile menu opened');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
    
    // Custom Cursor
    function initCustomCursor() {
        // Only add custom cursor on desktop
        if (window.innerWidth <= 768) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add('active');
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
        
        // Animate cursor movement
        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Hover effects
        const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .nav-link');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
            });
        });
    }
    
    // Project Links Handler
    function initProjectLinks() {
        const projectLinks = document.querySelectorAll('.project-link');
        
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    console.log('Opening project link:', href);
                    window.open(href, '_blank', 'noopener,noreferrer');
                } else {
                    // Default to GitHub profile
                    window.open('https://github.com/PranchalKatiyar', '_blank', 'noopener,noreferrer');
                }
            });
        });
    }
    
    // Initialize project links
    initProjectLinks();
    
    // Utility Functions
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        const baseStyles = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid var(--color-border);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
            max-width: 350px;
            font-size: 14px;
            font-family: var(--font-family-base);
        `;
        
        notification.style.cssText = baseStyles;
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--color-success)';
            notification.style.background = 'rgba(50, 184, 198, 0.1)';
            notification.style.color = 'var(--color-success)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--color-error)';
            notification.style.background = 'rgba(192, 21, 47, 0.1)';
            notification.style.color = 'var(--color-error)';
        } else if (type === 'info') {
            notification.style.borderColor = 'var(--color-info)';
            notification.style.background = 'rgba(98, 108, 113, 0.1)';
            notification.style.color = 'var(--color-info)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Performance optimization: Throttle function
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    // Enhanced accessibility
    function enhanceAccessibility() {
        // Add skip link for keyboard navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -50px;
            left: 10px;
            background: var(--color-primary);
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            font-weight: 500;
            transition: top 0.3s ease;
            font-size: 14px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '10px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-50px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const main = document.getElementById('main-content');
        if (main) {
            main.setAttribute('tabindex', '-1');
        }
        
        // Enhance nav link accessibility
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.setAttribute('tabindex', '0');
            link.setAttribute('role', 'menuitem');
            
            // Add keyboard navigation
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }
    
    enhanceAccessibility();
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Console welcome message for developers
    console.log(
        '%c🚀 Welcome to Pranchal Katiyar\'s Portfolio!',
        'color: #32c7d1; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);'
    );
    console.log(
        '%cBuilt with modern web technologies and lots of ☕',
        'color: #666; font-size: 12px; font-style: italic;'
    );
    console.log(
        '%cInterested in collaboration? Email: pranchal2213081@akgec.ac.in',
        'color: #32c7d1; font-size: 14px;'
    );
    console.log(
        '%c✅ FIXES APPLIED:',
        'color: #27ca3f; font-size: 14px; font-weight: bold;'
    );
    console.log(
        '%c• High-contrast navigation with dark backgrounds\n• Profile photo with enhanced fallback handling\n• Fixed theme toggle functionality\n• Smooth scrolling navigation\n• Updated stats: 15+ Projects, 50+ Students, 20+ Certifications\n• Enhanced mobile responsiveness',
        'color: #27ca3f; font-size: 12px;'
    );
    
    // Error handling
    window.addEventListener('error', (e) => {
        console.error('Portfolio Error:', e.error);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
    
    // Initialize additional features after DOM is fully loaded
    setTimeout(() => {
        // Preload critical animations
        document.body.classList.add('loaded');
        
        // Initialize any remaining interactive features
        initializeInteractiveFeatures();
        
        // Log initialization complete
        console.log('🎉 Portfolio fully initialized!');
    }, 100);
    
    function initializeInteractiveFeatures() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('.btn, .nav-link');
        buttons.forEach(button => {
            button.addEventListener('click', createRippleEffect);
        });
        
        function createRippleEffect(e) {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
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
                z-index: 0;
            `;
            
            // Add ripple keyframes if not already added
            if (!document.getElementById('ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                    .btn, .nav-link {
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(style);
            }
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }
        
        // Add loading states to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .project-card, .cert-item');
        interactiveElements.forEach(element => {
            element.addEventListener('mousedown', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('mouseup', () => {
                element.style.transform = '';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    // Smooth scroll polyfill for older browsers
    if (!('scrollBehavior' in document.documentElement.style)) {
        console.log('Adding smooth scroll polyfill');
        
        const smoothScrollPolyfill = function(target) {
            const targetPosition = target.offsetTop - 70;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const progressPercentage = Math.min(progress / duration, 1);
                
                // Easing function
                const easeInOutQuad = function(t) {
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                };
                
                window.scrollTo(0, startPosition + distance * easeInOutQuad(progressPercentage));
                
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            });
        };
    }
});
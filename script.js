// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeScrollAnimations();
    initializeMenuTabs();
    initializeSpecialsCarousel();
    initializeReservationForm();
    initializeProgressiveReservation(); // New progressive form
    initializeQuickBooking(); // New quick booking
    initializeSmartMenu(); // New smart menu with Hick's Law
    initializeGallery();
    initializeLightbox();
    initializeScrollToTop();
    initializeScrollIndicator();
    initializeParallax();
    setMinimumDate();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Trigger hero animations after loading
        document.body.classList.add('loaded');
    }, 2000);
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav link highlight
    window.addEventListener('scroll', highlightActiveNavLink);
}

function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animatedElements = document.querySelectorAll(
        '.menu-item, .testimonial-card, .gallery-item, .team-member, .special-card, .about-text, .about-visual'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Section headers animation
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
        observer.observe(header);
    });
}

// Menu Tabs
function initializeMenuTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Animate menu items
            const menuItems = document.querySelectorAll(`#${targetTab} .menu-item`);
            menuItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    });
}

// Chef's Specials Carousel
let currentSpecialIndex = 0;
const specials = document.querySelectorAll('.special-card');
const totalSpecials = specials.length;

function initializeSpecialsCarousel() {
    showSpecial(currentSpecialIndex);
    
    // Auto-rotate carousel
    setInterval(() => {
        changeSpecial(1);
    }, 5000);
}

function showSpecial(index) {
    specials.forEach(special => special.classList.remove('active'));
    specials[index].classList.add('active');

    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function changeSpecial(direction) {
    currentSpecialIndex += direction;
    
    if (currentSpecialIndex >= totalSpecials) {
        currentSpecialIndex = 0;
    } else if (currentSpecialIndex < 0) {
        currentSpecialIndex = totalSpecials - 1;
    }
    
    showSpecial(currentSpecialIndex);
}

function currentSpecial(index) {
    currentSpecialIndex = index - 1;
    showSpecial(currentSpecialIndex);
}

// Reservation Form
function initializeReservationForm() {
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const reservationData = {};
        
        for (let [key, value] of formData.entries()) {
            reservationData[key] = value;
        }
        
        // Validate form
        if (validateReservationForm(reservationData)) {
            // Show success message
            showNotification('Reservation submitted successfully! We will call you shortly to confirm your booking.', 'success');
            form.reset();
        }
    });

    // Add form field animations
    const formInputs = form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

function validateReservationForm(data) {
    const requiredFields = ['name', 'phone', 'guests', 'date', 'time'];
    
    for (let field of requiredFields) {
        if (!data[field]) {
            showNotification(`Please fill in the ${field} field.`, 'error');
            return false;
        }
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid phone number.', 'error');
        return false;
    }
    
    // Date validation
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date.', 'error');
        return false;
    }
    
    return true;
}

function setMinimumDate() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// Gallery
function initializeGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter gallery items
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Lightbox
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

function openLightbox(button) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    const galleryItem = button.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    
    lightboxImg.src = img.src;
    lightboxCaption.textContent = img.alt;
    
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
}

// Scroll to Top
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--gradient-gold);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Parallax Effect
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-video-bg');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Scroll Indicator
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        // Add click event to scroll to menu section
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('menu');
        });
        
        // Hide scroll indicator when user scrolls past hero section
        window.addEventListener('scroll', () => {
            const heroSection = document.getElementById('home');
            if (heroSection) {
                const heroHeight = heroSection.offsetHeight;
                const scrolled = window.pageYOffset;
                
                if (scrolled > heroHeight * 0.8) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.pointerEvents = 'none';
                } else {
                    scrollIndicator.style.opacity = '1';
                    scrollIndicator.style.pointerEvents = 'auto';
                }
            }
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ========================================= 
// UX LAWS IMPLEMENTATIONS
// ========================================= 

// Tesler's Law - Progressive Disclosure for Reservation
function initializeProgressiveReservation() {
    const form = document.getElementById('reservationForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const reservationData = {};
            
            for (let [key, value] of formData.entries()) {
                reservationData[key] = value;
            }
            
            // Validate current step
            if (validateCurrentStep()) {
                // Show success message
                showNotification('Reservation submitted successfully! We will call you shortly to confirm your booking.', 'success');
                
                // Reset form and go back to quick booking
                form.reset();
                showQuickBooking();
            }
        });
    }
}

// Quick Booking System
function initializeQuickBooking() {
    const quickOptions = document.querySelectorAll('.quick-option');
    
    quickOptions.forEach(option => {
        option.addEventListener('click', () => {
            const time = option.getAttribute('data-time');
            const guests = option.getAttribute('data-guests');
            
            // Pre-fill the detailed form with selected values
            document.getElementById('time').value = time;
            document.getElementById('guests').value = guests;
            
            // Set date to today + 1
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('date').value = tomorrow.toISOString().split('T')[0];
            
            // Show detailed form and go to step 1 (user info)
            showDetailedForm();
            
            showNotification(`Selected ${time} for ${guests} guests. Please provide your contact information.`, 'info');
        });
    });
}

// Form Step Navigation
let currentStep = 1;

function showDetailedForm() {
    document.getElementById('quickBooking').style.display = 'none';
    document.getElementById('reservationForm').classList.remove('hidden');
    currentStep = 1;
    showStep(currentStep);
}

function showQuickBooking() {
    document.getElementById('quickBooking').style.display = 'block';
    document.getElementById('reservationForm').classList.add('hidden');
    currentStep = 1;
}

function nextStep(step) {
    if (validateCurrentStep()) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${currentStep}`).style.animationName = 'slideOutLeft';
        
        setTimeout(() => {
            document.getElementById(`step${currentStep}`).style.display = 'none';
            
            // Show next step
            currentStep = step;
            showStep(currentStep);
        }, 300);
    }
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep}`).style.animationName = 'slideOutRight';
    
    setTimeout(() => {
        document.getElementById(`step${currentStep}`).style.display = 'none';
        
        // Show previous step
        currentStep = step;
        showStep(currentStep);
    }, 300);
}

function showStep(step) {
    const stepElement = document.getElementById(`step${step}`);
    stepElement.style.display = 'block';
    stepElement.style.animationName = currentStep > step ? 'slideInLeft' : 'slideInRight';
    stepElement.classList.add('active');
    
    // Update progress indicators
    updateProgressIndicators(step);
}

function updateProgressIndicators(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    progressSteps.forEach((progStep, index) => {
        progStep.classList.remove('active', 'completed');
        if (index + 1 < step) {
            progStep.classList.add('completed');
        } else if (index + 1 === step) {
            progStep.classList.add('active');
        }
    });
    
    progressLines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index + 1 < step) {
            line.classList.add('completed');
        }
    });
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            field.parentElement.classList.add('error');
            showNotification(`Please fill in the ${field.labels[0].textContent.replace(' *', '')} field.`, 'error');
            
            // Remove error class after 3 seconds
            setTimeout(() => {
                field.parentElement.classList.remove('error');
            }, 3000);
            
            return false;
        }
    }
    
    // Additional validation for step 1 (contact info)
    if (currentStep === 1) {
        const phone = document.getElementById('phone').value;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            showNotification('Please enter a valid phone number.', 'error');
            return false;
        }
    }
    
    // Additional validation for step 2 (date/time)
    if (currentStep === 2) {
        const selectedDate = new Date(document.getElementById('date').value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date.', 'error');
            return false;
        }
    }
    
    return true;
}

// Hick's Law - Smart Menu with Progressive Disclosure
function initializeSmartMenu() {
    // Initially show only first 4 items per category
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        const items = tabContent.querySelectorAll('.menu-item');
        
        items.forEach((item, index) => {
            if (index >= 4) { // Changed from 6 to 4
                item.style.display = 'none';
                item.classList.add('hidden-item');
            }
        });
        
        // Add "Show More" button if there are more than 4 items
        if (items.length > 4) { // Changed from 6 to 4
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'btn-outline show-more-items';
            showMoreBtn.innerHTML = `
                <span>Show More Items (${items.length - 4})</span>
                <i class="fas fa-chevron-down"></i>
            `;
            showMoreBtn.addEventListener('click', () => showMoreMenuItems(tabContent, showMoreBtn));
            tabContent.appendChild(showMoreBtn);
        }
    });
}

function showMoreMenuItems(tabContent, button) {
    const hiddenItems = tabContent.querySelectorAll('.hidden-item');
    
    hiddenItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.display = 'block';
            item.classList.remove('hidden-item');
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
    
    button.remove();
}

// Add popular items indicator
function addPopularItemsIndicator() {
    const popularItems = [
        'Chicken Tikka Masala',
        'Biryani',
        'Naan Bread',
        'Samosas',
        'Mango Lassi'
    ];
    
    document.querySelectorAll('.menu-item h3').forEach(title => {
        if (popularItems.some(popular => title.textContent.includes(popular))) {
            const popularBadge = document.createElement('span');
            popularBadge.className = 'popular-badge';
            popularBadge.innerHTML = '<i class="fas fa-star"></i> Popular';
            title.appendChild(popularBadge);
        }
    });
}

// Newsletter Subscription
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
});

// Menu Item Hover Effects
document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const image = item.querySelector('.menu-item-image img');
            const overlay = item.querySelector('.menu-overlay');
            
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
            
            if (overlay) {
                overlay.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const image = item.querySelector('.menu-item-image img');
            const overlay = item.querySelector('.menu-overlay');
            
            if (image) {
                image.style.transform = 'scale(1)';
            }
            
            if (overlay) {
                overlay.style.opacity = '0.9';
            }
        });
    });
});

// Testimonials Auto-Scroll
document.addEventListener('DOMContentLoaded', function() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    function showNextTestimonial() {
        testimonialCards.forEach(card => card.classList.remove('highlight'));
        
        if (testimonialCards[currentTestimonial]) {
            testimonialCards[currentTestimonial].classList.add('highlight');
        }
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }
    
    // Add highlight effect every 3 seconds
    setInterval(showNextTestimonial, 3000);
});

// Interactive Team Members
document.addEventListener('DOMContentLoaded', function() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', () => {
            const memberName = member.querySelector('h4').textContent;
            const memberRole = member.querySelector('p').textContent;
            
            showNotification(`Meet ${memberName}, our talented ${memberRole}!`, 'info');
        });
    });
});

// Dynamic Copyright Year
document.addEventListener('DOMContentLoaded', function() {
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.innerHTML = footerText.innerHTML.replace('2024', currentYear);
    }
});

// Performance Optimization: Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
});

// UX Laws Implementation - Enhanced Quick Actions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize popular items indicator
    addPopularItemsIndicator();
    
    // Add quick order functionality
    initializeQuickOrder();
    
    // Enhanced accessibility
    initializeA11yEnhancements();
});

// Quick order functionality for menu items
function initializeQuickOrder() {
    const quickOrderBtns = document.querySelectorAll('.quick-add-btn');
    
    quickOrderBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const menuItem = btn.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent.replace(/★.*$/, '').trim();
            const itemPrice = menuItem.querySelector('.price, .menu-item-price').textContent;
            
            showNotification(`${itemName} added to your order! ${itemPrice}`, 'success');
            
            // Add visual feedback
            btn.innerHTML = '<i class="fas fa-check"></i> Added';
            btn.style.background = '#4CAF50';
            
            setTimeout(() => {
                btn.innerHTML = 'Quick Order';
                btn.style.background = '';
            }, 2000);
        });
    });
}

// Accessibility enhancements
function initializeA11yEnhancements() {
    // Add ARIA labels to interactive elements
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
    
    // Add keyboard navigation for custom elements
    document.querySelectorAll('.quick-option').forEach(option => {
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                option.click();
            }
        });
    });
    
    // Enhance form accessibility
    document.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const label = group.querySelector('label');
        
        if (input && label && !input.getAttribute('aria-describedby')) {
            const helpId = `help-${input.id}`;
            input.setAttribute('aria-describedby', helpId);
        }
    });
}

// Initialize menu search when DOM is loaded
// Removed menu search functionality as requested

// Add CSS for image loading animation
const style = document.createElement('style');
style.textContent = `
    img {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: transparent;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .testimonial-card {
        transition: all 0.3s ease;
    }
    
    .testimonial-card.highlight {
        transform: scale(1.02);
        box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }
    
    .team-member {
        cursor: pointer;
    }
    
    .scroll-top-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
    }
`;

document.head.appendChild(style);

// Menu Items Toggle Functionality
function toggleMenuItems(category) {
    const hiddenItems = document.querySelectorAll(`#${category} .hidden-item`);
    const button = document.querySelector(`#${category} .show-more-btn`);
    const btnText = button.querySelector('.btn-text');
    const btnIcon = button.querySelector('.btn-icon');
    
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // Hide items
        hiddenItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('show');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }, index * 100);
        });
        
        button.classList.remove('expanded');
        btnText.textContent = 'Show other items';
        btnIcon.classList.remove('fa-chevron-up');
        btnIcon.classList.add('fa-chevron-down');
    } else {
        // Show items
        hiddenItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('show');
                }, 50);
            }, index * 100);
        });
        
        button.classList.add('expanded');
        btnText.textContent = 'Show less items';
        btnIcon.classList.remove('fa-chevron-down');
        btnIcon.classList.add('fa-chevron-up');
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(script);
}

// Reservation form functionality
function submitReservation(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target.closest('form');
    const formData = new FormData(form);
    
    const reservationData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        specialRequests: formData.get('special-requests')
    };
    
    // Validate required fields
    if (!reservationData.name || !reservationData.phone || !reservationData.date || !reservationData.time || !reservationData.guests) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Show confirmation modal with booking details
    showConfirmationModal(reservationData);
    
    // Reset form
    form.reset();
}

function showConfirmationModal(data) {
    // Populate confirmation details
    document.getElementById('confirmName').textContent = data.name;
    document.getElementById('confirmPhone').textContent = data.phone;
    document.getElementById('confirmDate').textContent = new Date(data.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('confirmTime').textContent = data.time;
    document.getElementById('confirmGuests').textContent = `${data.guests} ${data.guests === '1' ? 'person' : 'people'}`;
    
    // Show modal
    const modal = document.getElementById('confirmationModal');
    modal.classList.add('show');
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

function closeConfirmation() {
    const modal = document.getElementById('confirmationModal');
    modal.classList.remove('show');
    
    // Restore body scrolling
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeConfirmation();
    }
});

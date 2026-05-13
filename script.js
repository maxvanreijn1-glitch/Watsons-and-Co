// ===== HAMBURGER MENU ===== //
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== //
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

// ===== CONTACT FORM SUBMISSION ===== //
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const message = this.querySelector('textarea').value;

        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show success message
        alert('Thank you for your message! We will be in touch shortly.');
        this.reset();
    });
}

// ===== NEWSLETTER FORM ===== //
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        alert('Thank you for subscribing! Check your email for confirmation.');
        this.reset();
    });
});

// ===== PROPERTY FILTER ===== //
const searchBtn = document.querySelector('.btn-search');
if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        const location = document.querySelector('.search-bar input').value;
        const type = document.querySelectorAll('.search-bar select')[0].value;
        const price = document.querySelectorAll('.search-bar select')[1].value;

        if (!location && type === 'Property Type' && price === 'Price Range') {
            alert('Please enter at least one search criteria');
            return;
        }

        // Simulate search
        alert(`Searching for properties in "${location}" with type "${type}" and price range "${price}"`);
    });
}

// ===== SCROLL ANIMATIONS ===== //
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe property cards and service cards
document.querySelectorAll('.property-card, .service-card, .stat, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ===== ADD FADE-IN-UP ANIMATION ===== //
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ===== NAVBAR BACKGROUND ON SCROLL ===== //
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ===== LAZY LOADING IMAGES ===== //
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// ===== PROPERTY CARD VIEW DETAILS ===== //
document.querySelectorAll('.property-card .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const propertyName = this.closest('.property-card').querySelector('h3').textContent;
        alert(`Viewing details for: ${propertyName}\n\nFull property details page would load here in a production environment.`);
    });
});

// ===== EXPLORE PROPERTIES BUTTON ===== //
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Explore Properties')) {
        btn.addEventListener('click', function() {
            const propertiesSection = document.getElementById('properties');
            if (propertiesSection) {
                propertiesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// ===== COUNTERS ANIMATION ===== //
function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h3 = entry.target;
                const finalValue = h3.textContent;
                const numericValue = parseInt(finalValue);
                
                if (!isNaN(numericValue)) {
                    let currentValue = 0;
                    const increment = numericValue / 30;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            h3.textContent = finalValue;
                            clearInterval(counter);
                        } else {
                            h3.textContent = Math.floor(currentValue) + (finalValue.includes('+') ? '+' : '');
                        }
                    }, 50);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

animateCounters();

// ===== FORM VALIDATION HELPERS ===== //
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) || phone === '';
}

// Add real-time validation to contact form
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.type === 'email' && this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ff6b6b';
        } else if (this.type === 'tel' && this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#ff6b6b';
        } else {
            this.style.borderColor = '#e0e0e0';
        }
    });
});

// ===== ACTIVE NAVIGATION LINK INDICATOR ===== //
window.addEventListener('scroll', function() {
    let current = '';
    
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== MOBILE MENU HAMBURGER ANIMATION ===== //
if (hamburger) {
    const originalHamburger = hamburger;
    hamburger.addEventListener('click', function() {
        originalHamburger.style.transition = 'all 0.3s ease';
    });
}

// ===== CONSOLE MESSAGE ===== //
console.log('%cWatsons & Co', 'font-size: 24px; font-weight: bold; color: #000000;');
console.log('%cLuxury Estate Agents Website', 'font-size: 14px; color: #666666;');
console.log('%cFor inquiries, contact: info@watsonsandco.com', 'font-size: 12px; color: #999999;');

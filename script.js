/* ============================================================
   Watsons & Co — Main Script
   ============================================================ */

// ── Navbar: transparent over hero, solid on scroll ──────────
const navbar = document.getElementById('navbar');
function updateNavbar() {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
updateNavbar();
window.addEventListener('scroll', updateNavbar, { passive: true });

// ── Mobile hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    navbar.classList.add('scrolled');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ── Search tabs ──────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ── Search button ────────────────────────────────────────────
document.getElementById('searchBtn')?.addEventListener('click', () => {
    const location = document.querySelector('.search-field input')?.value;
    if (!location) {
        document.querySelector('.search-field input')?.focus();
        return;
    }
    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
        propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ── Smooth scroll for all anchor links ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

function addReveal(selector, delayClass = '') {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        if (delayClass) el.classList.add(`reveal-delay-${(i % 3) + 1}`);
        revealObserver.observe(el);
    });
}

addReveal('.property-card', true);
addReveal('.service-item', true);
addReveal('.testimonial', true);
addReveal('.area-card', true);
addReveal('.stat-item');
addReveal('.section-header');

// ── Animated stat counters ───────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }

        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    counterObserver.observe(el);
});

// ── Contact form ─────────────────────────────────────────────
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]')?.value ?? '';
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
        this.querySelector('input[type="email"]')?.focus();
        return;
    }

    const btn = this.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent — Thank You';
    btn.disabled = true;
    btn.style.background = '#1a3a2a';

    setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
        this.reset();
    }, 4000);
});

// ── Newsletter form ──────────────────────────────────────────
document.getElementById('newsletterForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = this.querySelector('input[type="email"]');
    const btn   = this.querySelector('button');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input?.value ?? '')) {
        input?.focus();
        return;
    }
    btn.textContent = 'Subscribed';
    btn.disabled = true;
    setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        this.reset();
    }, 3000);
});

// ── Active nav link on scroll (home page only) ───────────────
const sections = document.querySelectorAll('section[id]');
if (sections.length) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });
}

// ── Inner page: force navbar scrolled, mark active link ──────
const currentFile = location.pathname.split('/').pop() || 'index.html';
if (currentFile !== 'index.html' && currentFile !== '') {
    navbar.classList.add('scrolled');
    window.removeEventListener('scroll', updateNavbar);
}

document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentFile || (currentFile === 'index.html' && href === 'index.html'))) {
        link.classList.add('active-page');
    }
});

// ── Hero image subtle parallax ───────────────────────────────
const heroImg = document.querySelector('.hero-img');
if (heroImg && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
            heroImg.style.transform = `translateY(${y * 0.25}px)`;
        }
    }, { passive: true });
}

// ============================================================
//  LISTINGS PAGE (buy.html / rent.html)
// ============================================================
function renderPropertyCard(p) {
    return `
        <article class="property-card reveal"
            data-area="${p.area}"
            data-price="${p.priceNum}"
            data-beds="${p.beds}">
            <div class="property-img-wrap">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
                <span class="prop-tag${p.tag === 'To Let' ? ' prop-tag--rent' : ''}">${p.tag}</span>
                ${p.isNew ? '<span class="prop-tag prop-tag--new">New Instruction</span>' : ''}
            </div>
            <div class="property-body">
                <div class="property-price">${p.price}</div>
                <h3 class="property-name">${p.name}</h3>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${p.location}</p>
                <div class="property-meta">
                    <span><i class="fas fa-bed"></i> ${p.beds}</span>
                    <span><i class="fas fa-bath"></i> ${p.baths}</span>
                    <span><i class="fas fa-vector-square"></i> ${p.sqft.toLocaleString()} sq ft</span>
                </div>
            </div>
            <a href="property.html?id=${p.id}" class="property-link">View Property <i class="fas fa-arrow-right"></i></a>
        </article>`;
}

if (document.getElementById('listingsGrid')) {
    const grid    = document.getElementById('listingsGrid');
    const noRes   = document.getElementById('noResults');
    const countEl = document.getElementById('listingCount');
    const status  = document.body.dataset.status; // 'sale' or 'let'

    const pool = (typeof PROPERTIES !== 'undefined') ? PROPERTIES.filter(p => p.status === status) : [];

    function applyFilters() {
        const area  = document.getElementById('fArea').value;
        const price = parseInt(document.getElementById('fPrice').value) || Infinity;
        const beds  = parseInt(document.getElementById('fBeds').value) || 0;

        let visible = 0;
        grid.querySelectorAll('.property-card').forEach(card => {
            const ok = (!area  || card.dataset.area  === area)
                    && (parseInt(card.dataset.price) <= price)
                    && (parseInt(card.dataset.beds)  >= beds);
            card.style.display = ok ? '' : 'none';
            if (ok) visible++;
        });
        countEl.textContent = visible;
        noRes.style.display = visible === 0 ? 'block' : 'none';
    }

    // Render all cards
    grid.innerHTML = pool.map(renderPropertyCard).join('');
    countEl.textContent = pool.length;

    // Observe newly rendered cards for reveal
    grid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Wire up filter controls
    ['fArea','fPrice','fBeds'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyFilters);
    });
    document.getElementById('fReset')?.addEventListener('click', () => {
        ['fArea','fPrice','fBeds'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        applyFilters();
    });
}

// ============================================================
//  PROPERTY DETAIL PAGE (property.html)
// ============================================================
if (document.getElementById('propDetailWrap')) {
    const id   = new URLSearchParams(location.search).get('id');
    const prop = (typeof PROPERTIES !== 'undefined') ? PROPERTIES.find(p => p.id === id) : null;

    if (!prop) {
        location.href = 'buy.html';
    } else {
        // Page title & breadcrumb
        document.title = `${prop.name} — Watsons & Co`;
        const bcName = document.getElementById('bcPropName');
        const bcLink = document.getElementById('bcStatusLink');
        if (bcName) bcName.textContent = prop.name;
        if (bcLink) {
            bcLink.textContent = prop.status === 'sale' ? 'Buy' : 'Rent';
            bcLink.href = prop.status === 'sale' ? 'buy.html' : 'rent.html';
        }

        // Header
        document.getElementById('propTag').textContent   = prop.tag;
        document.getElementById('propTag').className     = `prop-tag${prop.tag === 'To Let' ? ' prop-tag--rent' : ''}`;
        document.getElementById('propName').textContent  = prop.name;
        document.getElementById('propPrice').textContent = prop.price;
        document.getElementById('propLoc').innerHTML     = `<i class="fas fa-map-marker-alt"></i> ${prop.location}`;

        // Gallery
        const mainImg  = document.getElementById('galleryMain');
        const thumbWrap = document.getElementById('galleryThumbs');
        mainImg.src = prop.imgs[0];
        mainImg.alt = prop.name;

        let currentImg = 0;
        prop.imgs.forEach((src, i) => {
            const div = document.createElement('div');
            div.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
            div.innerHTML = `<img src="${src}" alt="${prop.name} photo ${i+1}" loading="lazy">`;
            div.addEventListener('click', () => {
                currentImg = i;
                mainImg.src = src;
                thumbWrap.querySelectorAll('.gallery-thumb').forEach((t, j) => {
                    t.classList.toggle('active', j === i);
                });
            });
            thumbWrap.appendChild(div);
        });

        // Lightbox
        const lb      = document.getElementById('lightbox');
        const lbImg   = document.getElementById('lightboxImg');
        mainImg.parentElement.addEventListener('click', () => {
            lbImg.src = prop.imgs[currentImg];
            lb.classList.add('open');
        });
        document.getElementById('lbClose')?.addEventListener('click', () => lb.classList.remove('open'));
        document.getElementById('lbPrev')?.addEventListener('click', () => {
            currentImg = (currentImg - 1 + prop.imgs.length) % prop.imgs.length;
            lbImg.src = prop.imgs[currentImg];
        });
        document.getElementById('lbNext')?.addEventListener('click', () => {
            currentImg = (currentImg + 1) % prop.imgs.length;
            lbImg.src = prop.imgs[currentImg];
        });
        lb?.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });
        document.addEventListener('keydown', e => {
            if (!lb.classList.contains('open')) return;
            if (e.key === 'Escape') lb.classList.remove('open');
            if (e.key === 'ArrowLeft')  document.getElementById('lbPrev')?.click();
            if (e.key === 'ArrowRight') document.getElementById('lbNext')?.click();
        });

        // Description
        const descWrap = document.getElementById('propDesc');
        if (descWrap) descWrap.innerHTML = prop.description.map(t => `<p class="prop-detail-desc">${t}</p>`).join('');

        // Features
        const featWrap = document.getElementById('propFeatures');
        if (featWrap) featWrap.innerHTML = prop.features.map(f =>
            `<li><i class="fas fa-circle"></i>${f}</li>`
        ).join('');

        // Stats sidebar
        document.getElementById('statBeds').textContent  = prop.beds;
        document.getElementById('statBaths').textContent = prop.baths;
        document.getElementById('statSqft').textContent  = prop.sqft.toLocaleString();

        // Info table
        document.getElementById('infoEpc').textContent     = prop.epc;
        document.getElementById('infoTenure').textContent  = prop.tenure;
        document.getElementById('infoCouncil').textContent = prop.council;

        // Enquiry form pre-fill
        const hiddenProp = document.getElementById('enquiryProperty');
        if (hiddenProp) hiddenProp.value = prop.name;

        // Similar properties
        const similarGrid = document.getElementById('similarGrid');
        if (similarGrid) {
            const similar = PROPERTIES
                .filter(p => p.status === prop.status && p.id !== prop.id)
                .slice(0, 3);
            similarGrid.innerHTML = similar.map(renderPropertyCard).join('');
            similarGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        }

        // Enquiry submit
        document.getElementById('enquiryForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('button[type="submit"]');
            const orig = btn.textContent;
            btn.textContent = 'Enquiry Sent — Thank You';
            btn.disabled = true;
            btn.style.background = '#1a3a2a';
            setTimeout(() => {
                btn.textContent = orig;
                btn.disabled = false;
                btn.style.background = '';
                this.reset();
                if (hiddenProp) hiddenProp.value = prop.name;
            }, 4000);
        });
    }
}

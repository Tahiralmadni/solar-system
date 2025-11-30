// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- Particle System (Starfield) ---
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let width, height;
const stars = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initStars();
}

function initStars() {
    stars.length = 0;
    const starCount = Math.floor((width * height) / 2000); // Density
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function animateStars() {
    ctx.fillStyle = '#050505'; // Clear with bg color
    ctx.fillRect(0, 0, width, height);

    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Move stars slowly
        star.y += star.speed;
        if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
        }
    });

    requestAnimationFrame(animateStars);
}

window.addEventListener('resize', resize);
resize();
animateStars();

// --- GSAP Animations ---

// 1. Progress Bar
gsap.to('.progress-bar', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
    }
});

// 2. Back to Top Button Visibility
gsap.to('#back-to-top', {
    opacity: 1,
    autoAlpha: 1,
    scrollTrigger: {
        trigger: '#sun', // Show after passing hero
        start: 'top center',
        toggleActions: 'play none none reverse'
    }
});

// 3. Section Animations (Planets & Text)
const sections = document.querySelectorAll('section:not(#hero)');

sections.forEach((section) => {
    const visual = section.querySelector('.planet-svg');
    const info = section.querySelector('.planet-info');

    // Timeline for each section
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top 70%', // Start animation when section is 70% in view
            end: 'top 30%',
            toggleActions: 'play none none reverse',
            // scrub: 1 // Optional: tie to scroll position
        }
    });

    // Animate Planet
    tl.to(visual, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out'
    });

    // Animate Text
    tl.to(info, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out'
    }, '-=1'); // Overlap by 1s
});

// 4. Hero Animation
gsap.from('#hero h1', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.5
});

gsap.from('#hero p', {
    y: 50,
    opacity: 0,
    duration: 1.5,
    ease: 'power3.out',
    delay: 0.8
});

// 5. Navigation Active State
const navDots = document.querySelectorAll('.nav-dot');

sections.forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveDot(section.id),
        onEnterBack: () => setActiveDot(section.id)
    });
});

// Hero special case
ScrollTrigger.create({
    trigger: '#hero',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveDot('hero'),
    onEnterBack: () => setActiveDot('hero')
});

function setActiveDot(id) {
    navDots.forEach(dot => {
        dot.classList.remove('active');
        const label = dot.getAttribute('data-label').toLowerCase();
        if (label === id || (id === 'hero' && label === 'start')) {
            dot.classList.add('active');
        }
    });
}

// --- Smooth Scroll Function ---
function scrollToSection(selector) {
    gsap.to(window, {
        duration: 1.5,
        scrollTo: selector,
        ease: 'power2.inOut'
    });
}

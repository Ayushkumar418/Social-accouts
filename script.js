/* ==========================================
   AYUSH KUMAR - PREMIUM PORTFOLIO
   Interactive JavaScript Enhancements
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initEntranceAnimations();
    initInteractiveEffects();
    initParallaxOrbs();
    initHoverSounds();
    initTypingAnimation();
    initCustomCursor();
    initScrollReveal();
    updateCopyright();
});

/* ==========================================
   HOVER SOUND EFFECTS
   ========================================== */
let audioContext = null;

function initHoverSounds() {
    // Create audio context on first user interaction (browser requirement)
    const initAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        document.removeEventListener('click', initAudioContext);
        document.removeEventListener('touchstart', initAudioContext);
    };

    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('touchstart', initAudioContext, { once: true });

    // Add hover sounds to social cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', () => playHoverSound('pop'));
    });

    // Add hover sounds to pill badges
    const pillBadges = document.querySelectorAll('.pill-badge');
    pillBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => playHoverSound('soft'));
    });

    // Add click sound to avatar
    const avatar = document.querySelector('.avatar-img');
    if (avatar) {
        avatar.addEventListener('click', () => playHoverSound('click'));
    }
}

function playHoverSound(type = 'pop') {
    if (!audioContext) return;

    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const now = audioContext.currentTime;

        switch (type) {
            case 'pop':
                // Subtle pop sound
                oscillator.frequency.setValueAtTime(800, now);
                oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.08, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                oscillator.start(now);
                oscillator.stop(now + 0.08);
                break;

            case 'soft':
                // Softer tick sound
                oscillator.frequency.setValueAtTime(600, now);
                oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.03);
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.05, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;

            case 'click':
                // Click sound
                oscillator.frequency.setValueAtTime(1000, now);
                oscillator.frequency.exponentialRampToValueAtTime(500, now + 0.06);
                oscillator.type = 'triangle';
                gainNode.gain.setValueAtTime(0.1, now);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
        }
    } catch (e) {
        // Silently fail if audio doesn't work
    }
}

/* ==========================================
   FLOATING PARTICLES
   ========================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        const colors = [
            'rgba(139, 92, 246, 0.6)',  // Purple
            'rgba(59, 130, 246, 0.5)',   // Blue
            'rgba(236, 72, 153, 0.4)',   // Pink
            'rgba(6, 182, 212, 0.5)',    // Cyan
            'rgba(255, 255, 255, 0.3)'   // White
        ];

        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2
        };
    }

    function initParticlesArray() {
        particles = [];
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(createParticle());
        }
    }

    function drawParticle(p) {
        const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${Math.max(0, pulseOpacity)})`);
        ctx.fill();
    }

    function updateParticle(p) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.02;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            updateParticle(p);
            drawParticle(p);
        });

        // Draw connections between nearby particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });

        animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticlesArray();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticlesArray();
    });
}

/* ==========================================
   ENTRANCE ANIMATIONS
   ========================================== */
function initEntranceAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Stagger social cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + (index * 100));
    });

    // Stagger pill badges
    const pillBadges = document.querySelectorAll('.pill-badge');
    pillBadges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(15px) scale(0.95)';

        setTimeout(() => {
            badge.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0) scale(1)';
        }, 300 + (index * 80));
    });
}

/* ==========================================
   INTERACTIVE EFFECTS
   ========================================== */
function initInteractiveEffects() {
    const socialCards = document.querySelectorAll('.social-card');

    socialCards.forEach(card => {
        // Mouse move glow effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = `${x - 50}px`;
                glow.style.top = `${y - 50}px`;
            }
        });

        // Touch feedback
        card.addEventListener('touchstart', () => {
            card.style.transform = 'scale(0.98)';
        }, { passive: true });

        card.addEventListener('touchend', () => {
            card.style.transform = '';
        }, { passive: true });
    });

    // Avatar hover glow boost
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarGlow = document.querySelector('.avatar-glow');

    if (avatarContainer && avatarGlow) {
        avatarContainer.addEventListener('mouseenter', () => {
            avatarGlow.style.opacity = '0.7';
            avatarGlow.style.transform = 'scale(1.2)';
        });

        avatarContainer.addEventListener('mouseleave', () => {
            avatarGlow.style.opacity = '';
            avatarGlow.style.transform = '';
        });
    }
}

/* ==========================================
   PARALLAX ORBS
   ========================================== */
function initParallaxOrbs() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const orbs = document.querySelectorAll('.orb');
    if (orbs.length === 0) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animateOrbs() {
        currentX += (mouseX - currentX) * 0.03;
        currentY += (mouseY - currentY) * 0.03;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 15;
            const x = currentX * speed;
            const y = currentY * speed;
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });

        requestAnimationFrame(animateOrbs);
    }

    animateOrbs();
}

/* ==========================================
   UPDATE COPYRIGHT YEAR
   ========================================== */
function updateCopyright() {
    const copyrightElement = document.querySelector('.footer-copy');
    if (copyrightElement) {
        const year = new Date().getFullYear();
        copyrightElement.textContent = `© ${year} All rights reserved`;
    }
}

/* ==========================================
   TYPING ANIMATION
   ========================================== */
function initTypingAnimation() {
    const typedName = document.getElementById('typed-name');
    const cursor = document.querySelector('.typing-cursor');
    if (!typedName) return;

    const text = 'Ayush Kumar';
    let charIndex = 0;
    const typingSpeed = 100; // ms per character

    function typeCharacter() {
        if (charIndex < text.length) {
            typedName.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeCharacter, typingSpeed);
        } else {
            // Typing complete - hide cursor after a delay
            setTimeout(() => {
                if (cursor) {
                    cursor.style.animation = 'none';
                    cursor.style.opacity = '0';
                    cursor.style.transition = 'opacity 0.5s ease';
                }
            }, 2000);
        }
    }

    // Start typing after a short delay
    setTimeout(typeCharacter, 800);
}

/* ==========================================
   CUSTOM CURSOR
   ========================================== */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    // Check if it's a touch device
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        cursor.style.display = 'none';
        return;
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cursor.style.display = 'none';
        return;
    }

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');

    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animateCursor() {
        // Dot follows closely
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        dot.style.left = `${dotX}px`;
        dot.style.top = `${dotY}px`;

        // Ring follows with more lag
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .social-card, .pill-badge, .avatar-img');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicking');
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

/* ==========================================
   SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollReveal() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Add scroll-reveal class to elements
    const revealElements = [
        { selector: '.quote-box', class: 'scroll-reveal' },
        { selector: '.social-section', class: 'scroll-reveal' },
        { selector: '.footer', class: 'scroll-reveal' }
    ];

    revealElements.forEach(({ selector, class: className }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add(className);
        }
    });

    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

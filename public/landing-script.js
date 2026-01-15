// Partículas en Canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 100;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(14, 165, 233, 0.8)';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        // Partícula con brillo
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Conectar partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                const opacity = 1 - distance / 120;
                ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.5})`;
                ctx.lineWidth = 1;
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

// Estrellas mejoradas
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        
        // Diferentes tamaños de estrellas
        const size = Math.random();
        if (size < 0.6) {
            star.className = 'star small';
        } else if (size < 0.9) {
            star.className = 'star medium';
        } else {
            star.className = 'star large';
        }
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Contador de estadísticas animado
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const dataTarget = stat.getAttribute('data-target');
        
        // Solo animar si tiene data-target (stats del hero)
        if (dataTarget) {
            const target = parseInt(dataTarget);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target.toLocaleString();
                }
            };

            updateCount();
        }
        // Los stats de la fundación mantienen su texto original
    });
}

// Countdown Timer (Original)
function updateCountdown() {
    // Fecha de lanzamiento: 12 de diciembre de 2025
    const launchDate = new Date('2025-12-12T00:00:00').getTime();
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = launchDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            const countdownContainer = document.querySelector('.countdown-container');
            if (countdownContainer) {
                countdownContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <h2 style="font-size: 48px; color: #10b981; margin-bottom: 20px;">🎉 ¡Ya Disponible!</h2>
                        <p style="font-size: 20px; color: #9ca3af; margin-bottom: 30px;">SOS-HABILIDOSOS está oficialmente lanzado</p>
                        <button class="btn-large btn-primary" onclick="window.location.href='/feed'">
                            Entrar Ahora
                        </button>
                    </div>
                `;
            }
        }
    }, 1000);
}

// Nuevo Countdown de Lanzamiento (30 días)
function updateLaunchCountdown() {
    // Fecha de lanzamiento: 30 días desde hoy
    const now = new Date();
    const launchDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const distance = launchDate.getTime() - currentTime;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const launchDaysEl = document.getElementById('launch-days');
        const launchHoursEl = document.getElementById('launch-hours');
        const launchMinutesEl = document.getElementById('launch-minutes');
        const launchSecondsEl = document.getElementById('launch-seconds');

        if (launchDaysEl) launchDaysEl.textContent = String(days).padStart(2, '0');
        if (launchHoursEl) launchHoursEl.textContent = String(hours).padStart(2, '0');
        if (launchMinutesEl) launchMinutesEl.textContent = String(minutes).padStart(2, '0');
        if (launchSecondsEl) launchSecondsEl.textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(timer);
            const launchCountdownContent = document.querySelector('.launch-countdown-content');
            if (launchCountdownContent) {
                launchCountdownContent.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div class="launch-badge">
                            <span>🎉 ¡LANZADO!</span>
                        </div>
                        <h2 style="font-size: 48px; color: #10b981; margin-bottom: 20px;">¡SOS-HABILIDOSOS Ya Está Aquí!</h2>
                        <p style="font-size: 20px; color: #9ca3af; margin-bottom: 30px;">La revolución de las habilidades ha comenzado</p>
                        <button class="btn-large btn-primary" onclick="window.location.href='/app'">
                            🚀 Entrar a la Plataforma
                        </button>
                    </div>
                `;
            }
        }
    }, 1000);
}

// Smooth Scroll
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

// Modal de Registro
const modal = document.getElementById('register-modal');
const btnRegister = document.getElementById('btn-register');
const btnEarlyAccess = document.getElementById('btn-early-access');
const btnDemo = document.getElementById('btn-demo');
const modalClose = document.getElementById('modal-close');

function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

btnRegister.addEventListener('click', openModal);
btnEarlyAccess.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// Botón Reality
const btnReality = document.getElementById('btn-reality');
if (btnReality) {
    btnReality.addEventListener('click', () => {
        openModal();
        // Scroll al modal
        setTimeout(() => {
            const modalTitle = document.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'Habilidosos: "Un Golazo A Tus Sueños"';
            }
            const modalSubtitle = document.querySelector('.modal-subtitle');
            if (modalSubtitle) {
                modalSubtitle.textContent = '¡Regístrate en SOS-HABILIDOSOS y dale un golazo a tus sueños en el Reality 2026!';
            }
        }, 100);
    });
}

// Botón Notificar Lanzamiento
const btnNotifyLaunch = document.getElementById('btn-notify-launch');
if (btnNotifyLaunch) {
    btnNotifyLaunch.addEventListener('click', () => {
        openModal();
        setTimeout(() => {
            const modalTitle = document.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = 'Notificación de Lanzamiento';
            }
            const modalSubtitle = document.querySelector('.modal-subtitle');
            if (modalSubtitle) {
                modalSubtitle.textContent = 'Regístrate para ser el primero en saber cuando SOS-HABILIDOSOS esté disponible';
            }
        }, 100);
    });
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Demo Video
btnDemo.addEventListener('click', () => {
    alert('¡Demo próximamente! Regístrate para ser notificado cuando esté disponible.');
});

// Formulario de Registro
const registerForm = document.getElementById('register-form');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animación de éxito
    const formData = new FormData(registerForm);
    console.log('Registro:', Object.fromEntries(formData));
    
    // Mostrar mensaje de éxito
    alert('¡Registro exitoso! Te contactaremos pronto con más información.');
    closeModal();
    registerForm.reset();
});

// Newsletter
const newsletterForm = document.getElementById('newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = newsletterForm.querySelector('input[type="email"]').value;
    console.log('Newsletter:', email);
    
    alert('¡Gracias por suscribirte! Recibirás actualizaciones en tu correo.');
    newsletterForm.reset();
});

// Intersection Observer para animaciones al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplicar animaciones a las secciones
document.querySelectorAll('.feature-card, .pricing-card, .community-stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.8)';
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Parallax effect (deshabilitado para evitar conflictos)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    // Parallax deshabilitado temporalmente para evitar conflictos de z-index
    // const parallaxElements = document.querySelectorAll('.hero-content');
    
    // parallaxElements.forEach(el => {
    //     const speed = 0.5;
    //     el.style.transform = `translateY(${scrolled * speed}px)`;
    // });
});

// Cursor personalizado (opcional)
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #10b981;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s;
    display: none;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.display = 'block';
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = '#0ea5e9';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = '#10b981';
    });
});

// Typing effect para el título
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s infinite';
        alert('🎉 ¡Código secreto activado! Eres un verdadero habilidoso.');
    }
});

// Inicializar todo
window.addEventListener('load', () => {
    initParticles();
    animateParticles();
    createStars();
    animateStats();
    updateCountdown();
    updateLaunchCountdown(); // Nuevo contador de lanzamiento
    
    // Fade in inicial
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s';
        document.body.style.opacity = '1';
    }, 100);
});

// Prevenir zoom en móviles
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// Console message
console.log('%c¡Hola Habilidoso! 👋', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%c¿Interesado en unirte al equipo? Envíanos un email a: careers@sos-habilidoso.com', 'color: #0ea5e9; font-size: 14px;');

// Partículas en Canvas
const canvas = document.getElementById('particles-canvas');
console.log('Canvas element:', canvas);

if (!canvas) {
    console.error('Canvas element not found!');
} else {
    const ctx = canvas.getContext('2d');
    console.log('Canvas context:', ctx);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
}

if (!canvas) {
    console.error('Canvas element not found!');
} else {
    const ctx = canvas.getContext('2d');
    console.log('Canvas context:', ctx);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

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
        console.log('Initializing particles...');
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        console.log('Particles initialized:', particles.length);
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

    // Resize canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Inicializar partículas cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, starting particles...');
            initParticles();
            animateParticles();
        });
    } else {
        console.log('DOM already loaded, starting particles...');
        initParticles();
        animateParticles();
    }
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
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

if (btnRegister) {
    btnRegister.addEventListener('click', openModal);
}
if (btnEarlyAccess) {
    btnEarlyAccess.addEventListener('click', openModal);
}
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

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
    console.log('🚀 === INICIO DE CARGA ===');
    
    initParticles();
    animateParticles();
    createStars();
    animateStats();
    updateCountdown();
    updateLaunchCountdown(); // Nuevo contador de lanzamiento
    
    // Inicializar botones PWA
    console.log('🔍 Buscando botones PWA...');
    installButtonHeader = document.getElementById('btn-download-app-header');
    installButtonAndroid = document.getElementById('btn-download-android');
    installButtonIOS = document.getElementById('btn-download-ios');
    
    console.log('📱 PWA: Buttons initialized:', {
        header: installButtonHeader ? '✓ Encontrado' : '✗ NO encontrado',
        android: installButtonAndroid ? '✓ Encontrado' : '✗ NO encontrado',
        ios: installButtonIOS ? '✓ Encontrado' : '✗ NO encontrado'
    });
    
    console.log('🔧 Estado PWA:', {
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        hasServiceWorker: 'serviceWorker' in navigator,
        deferredPrompt: deferredPrompt ? 'Disponible' : 'No disponible',
        userAgent: navigator.userAgent
    });
    
    // Agregar event listeners a todos los botones PWA
    if (installButtonHeader) {
        installButtonHeader.addEventListener('click', (e) => {
            console.log('🖱️ CLICK en botón HEADER');
            // Si no hay prompt disponible, dejar que el enlace funcione normalmente
            if (deferredPrompt) {
                e.preventDefault(); // Solo prevenir si vamos a mostrar el prompt
                handleInstall(installButtonHeader, 'header');
            } else {
                console.log('🔗 Dejando que el enlace funcione normalmente (abrirá la PWA si está instalada)');
            }
        });
        console.log('✓ PWA: Header button listener added');
    } else {
        console.warn('⚠️ PWA: Header button NOT found in DOM');
    }

    if (installButtonAndroid) {
        installButtonAndroid.addEventListener('click', (e) => {
            console.log('🖱️ CLICK en botón ANDROID');
            // Si no hay prompt disponible, dejar que el enlace funcione normalmente
            if (deferredPrompt) {
                e.preventDefault(); // Solo prevenir si vamos a mostrar el prompt
                handleInstall(installButtonAndroid, 'android');
            } else {
                console.log('🔗 Dejando que el enlace funcione normalmente (abrirá la PWA si está instalada)');
            }
        });
        console.log('✓ PWA: Android button listener added');
    } else {
        console.warn('⚠️ PWA: Android button NOT found in DOM');
    }

    if (installButtonIOS) {
        installButtonIOS.addEventListener('click', (e) => {
            console.log('🖱️ CLICK en botón iOS');
            // Si no hay prompt disponible, dejar que el enlace funcione normalmente
            if (deferredPrompt) {
                e.preventDefault(); // Solo prevenir si vamos a mostrar el prompt
                handleInstall(installButtonIOS, 'ios');
            } else {
                console.log('🔗 Dejando que el enlace funcione normalmente (abrirá la PWA si está instalada)');
            }
        });
        console.log('✓ PWA: iOS button listener added');
    } else {
        console.warn('⚠️ PWA: iOS button NOT found in DOM');
    }
    
    console.log('✅ === CARGA COMPLETADA ===');
    
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


// ============================================
// PWA INSTALLATION FUNCTIONALITY
// ============================================

let deferredPrompt;
let installButtonHeader;
let installButtonAndroid;
let installButtonIOS;

// Detectar el evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('\n🎉 === BEFOREINSTALLPROMPT EVENT FIRED ===');
    console.log('📅 Timestamp:', new Date().toLocaleTimeString());
    console.log('🎯 Event:', e);
    
    // Prevenir que el navegador muestre su propio prompt
    e.preventDefault();
    console.log('🚫 Default prompt prevented');
    
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    console.log('💾 Prompt saved to deferredPrompt variable');
    
    console.log('✅ PWA: Install buttons ready');
    console.log('🏁 === BEFOREINSTALLPROMPT HANDLED ===\n');
});

// Función para manejar la instalación
async function handleInstall(buttonElement, source) {
    console.log(`\n🎯 === HANDLE INSTALL INICIADO ===`);
    console.log(`📍 Source: ${source}`);
    console.log(`🔘 Button element:`, buttonElement);
    
    // Verificar si la app ya está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isStandaloneIOS = window.navigator.standalone === true;
    const isInstalled = isStandalone || isStandaloneIOS;
    
    console.log(`📊 Estado de instalación:`, {
        isStandalone,
        isStandaloneIOS,
        isInstalled,
        deferredPromptAvailable: !!deferredPrompt
    });
    
    if (isInstalled) {
        console.log('✅ PWA: App already installed, already running in standalone mode');
        showNotification('¡Ya estás usando la app!', 'La aplicación ya está abierta en modo PWA', 'info');
        console.log(`🏁 === HANDLE INSTALL FINALIZADO (ya instalada) ===\n`);
        return;
    }
    
    // Si estamos en el navegador pero la app está instalada, intentar abrirla
    if (!deferredPrompt) {
        console.log('⚠️ PWA: No deferred prompt available');
        console.log('🔍 Checking if app is installed...');
        
        // Detectar el sistema operativo
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
        const isAndroid = /android/i.test(userAgent);
        
        console.log(`📱 Sistema operativo detectado:`, {
            isIOS,
            isAndroid,
            userAgent: userAgent.substring(0, 50) + '...'
        });
        
        // Mostrar mensaje para abrir la app instalada
        console.log('💬 Mostrando notificación de app instalada');
        showNotification(
            '¡App ya instalada!', 
            'Busca el ícono de SOS Habilidoso en tu pantalla de inicio o lista de aplicaciones para abrirla.', 
            'info'
        );
        
        // Intentar abrir la app usando el manifest start_url
        console.log('⏳ Redirigiendo a /login en 2 segundos...');
        setTimeout(() => {
            console.log('🔄 Ejecutando redirección a /login');
            window.location.href = '/login';
        }, 2000);
        
        console.log(`🏁 === HANDLE INSTALL FINALIZADO (sin prompt) ===\n`);
        return;
    }
    
    // Si hay prompt disponible, mostrar instalación
    console.log('✨ PWA: Showing install prompt...');
    console.log('🎬 Ejecutando deferredPrompt.prompt()');
    deferredPrompt.prompt();
    
    // Esperar la respuesta del usuario
    console.log('⏳ Esperando respuesta del usuario...');
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 PWA: User response: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('✅ PWA: User accepted the install prompt');
        showNotification('¡Instalación Exitosa!', 'La app está lista en tu dispositivo', 'success');
    } else {
        console.log('❌ PWA: User dismissed the install prompt');
    }
    
    // Limpiar el prompt
    deferredPrompt = null;
    console.log('🧹 Prompt limpiado');
    console.log(`🏁 === HANDLE INSTALL FINALIZADO (con prompt) ===\n`);
}

// Detectar cuando la app se instala exitosamente
window.addEventListener('appinstalled', (e) => {
    console.log('PWA: App installed successfully');
    showNotification('¡Instalación Exitosa!', 'La app está lista en tu dispositivo', 'success');
    deferredPrompt = null;
});

// Función para mostrar notificaciones
function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    
    let icon = '<i class="fas fa-check-circle"></i>';
    let gradient = 'linear-gradient(135deg, #10b981, #0ea5e9)';
    
    if (type === 'info') {
        icon = '<i class="fas fa-info-circle"></i>';
        gradient = 'linear-gradient(135deg, #0ea5e9, #3b82f6)';
    } else if (type === 'warning') {
        icon = '<i class="fas fa-exclamation-circle"></i>';
        gradient = 'linear-gradient(135deg, #f59e0b, #ef4444)';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${gradient};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(16, 185, 129, 0.4);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        animation: slideInRight 0.5s ease;
        max-width: 350px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 24px;">${icon}</div>
            <div>
                <div style="font-size: 16px; margin-bottom: 5px;">${title}</div>
                <div style="font-size: 13px; opacity: 0.9;">${message}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Función para mostrar instrucciones de iOS
function showIOSInstructions() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
        ">
            <div style="text-align: center; margin-bottom: 30px;">
                <i class="fab fa-apple" style="font-size: 48px; color: #0ea5e9; margin-bottom: 20px;"></i>
                <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 10px; color: white;">Instalar en iOS</h2>
                <p style="color: #9ca3af; font-size: 14px;">Sigue estos pasos para instalar la app:</p>
            </div>
            <div style="color: white; line-height: 1.8; margin-bottom: 30px;">
                <div style="display: flex; align-items: start; gap: 15px; margin-bottom: 20px;">
                    <div style="
                        background: linear-gradient(135deg, #10b981, #0ea5e9);
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-weight: 700;
                    ">1</div>
                    <div>
                        <strong>Toca el botón de compartir</strong> <i class="fas fa-share" style="color: #0ea5e9;"></i> en la barra inferior de Safari
                    </div>
                </div>
                <div style="display: flex; align-items: start; gap: 15px; margin-bottom: 20px;">
                    <div style="
                        background: linear-gradient(135deg, #10b981, #0ea5e9);
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-weight: 700;
                    ">2</div>
                    <div>
                        Desplázate y selecciona <strong>"Agregar a pantalla de inicio"</strong> <i class="fas fa-plus-square" style="color: #0ea5e9;"></i>
                    </div>
                </div>
                <div style="display: flex; align-items: start; gap: 15px;">
                    <div style="
                        background: linear-gradient(135deg, #10b981, #0ea5e9);
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-weight: 700;
                    ">3</div>
                    <div>
                        Toca <strong>"Agregar"</strong> en la esquina superior derecha
                    </div>
                </div>
            </div>
            <button onclick="this.closest('div').parentElement.remove()" style="
                width: 100%;
                padding: 15px;
                background: linear-gradient(135deg, #10b981, #0ea5e9);
                border: none;
                border-radius: 12px;
                color: white;
                font-weight: 600;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 10px 30px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                Entendido
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Agregar animaciones CSS si no existen
if (!document.getElementById('pwa-animations')) {
    const style = document.createElement('style');
    style.id = 'pwa-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Log para debugging
console.log('PWA: Installation script loaded');
console.log('PWA: Waiting for DOM to initialize buttons...');

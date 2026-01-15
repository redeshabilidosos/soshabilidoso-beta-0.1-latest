// SOS-HABILIDOSOS - JavaScript Principal
// Inicialización cuando el DOM esté completamente cargado
window.addEventListener('load', function() {
    
    // ===== CONFIGURACIÓN DE PARTÍCULAS (EXACTO COMO LANDING.HTML) =====
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

    // ===== CONFIGURACIÓN DE ESTRELLAS (EXACTO COMO LANDING.HTML) =====
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

    // ===== MENÚ HAMBURGUESA =====
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuToggle && mobileMenu) {
        // Toggle del menú
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // ===== SMOOTH SCROLL =====
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

    // ===== CONTADORES ANIMADOS =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, 16);
        });
    }

    // ===== COUNTDOWN DE LANZAMIENTO (30 DÍAS DESDE HOY) =====
    function updateLaunchCountdown() {
        // Fecha de lanzamiento: 30 días desde hoy
        const now = new Date();
        const launchDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
        
        const timer = setInterval(() => {
            const currentTime = new Date().getTime();
            const distance = launchDate.getTime() - currentTime;

            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('launch-days').textContent = '00';
                document.getElementById('launch-hours').textContent = '00';
                document.getElementById('launch-minutes').textContent = '00';
                document.getElementById('launch-seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('launch-days');
            const hoursEl = document.getElementById('launch-hours');
            const minutesEl = document.getElementById('launch-minutes');
            const secondsEl = document.getElementById('launch-seconds');

            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    // ===== MODAL DE REGISTRO =====
    const registerModal = document.getElementById('register-modal');
    const modalClose = document.getElementById('modal-close');
    const btnRegister = document.getElementById('btn-register');
    const btnReality = document.getElementById('btn-reality');
    const btnLogin = document.getElementById('btn-login');

    function openModal() {
        if (registerModal) {
            registerModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (registerModal) {
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Event listeners para abrir modal
    if (btnRegister) {
        btnRegister.addEventListener('click', openModal);
    }

    if (btnReality) {
        btnReality.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirigir al registro del reality
            window.location.href = 'http://localhost:4000/register-habilidosos';
        });
    }

    if (btnLogin) {
        btnLogin.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirigir al login
            window.location.href = '/login';
        });
    }

    // Event listeners para cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (registerModal) {
        registerModal.addEventListener('click', function(e) {
            if (e.target === registerModal) {
                closeModal();
            }
        });
    }

    // ===== FORMULARIOS =====
    const registerForm = document.getElementById('register-form');
    const newsletterForm = document.getElementById('newsletter-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica de registro
            alert('¡Gracias por registrarte! Te notificaremos cuando esté disponible.');
            closeModal();
        });
    }

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            // Aquí iría la lógica del newsletter
            alert('¡Gracias por suscribirte! Te mantendremos informado.');
            this.reset();
        });
    }

    // ===== INTERSECTION OBSERVER PARA ANIMACIONES =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar contadores cuando entren en vista
                if (entry.target.classList.contains('hero-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    document.querySelectorAll('.feature-card, .category-item, .hero-stats, .community-stat').forEach(el => {
        observer.observe(el);
    });

    // ===== INICIALIZACIÓN (EXACTO COMO LANDING.HTML) =====
    initParticles();
    animateParticles();
    createStars();
    updateLaunchCountdown();

    // Event listeners para redimensionar
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Limpiar animaciones al salir de la página
    window.addEventListener('beforeunload', function() {
        // Cleanup si es necesario
    });

    console.log('🚀 SOS-HABILIDOSOS inicializado correctamente');
});
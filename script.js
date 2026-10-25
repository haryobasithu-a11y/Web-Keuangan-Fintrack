document.addEventListener('DOMContentLoaded', () => {
    const cursorGlow = document.getElementById('cursor-glow');
    const cursorDot = document.getElementById('cursor-dot');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        // Smooth lerp follow
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;

        if (cursorGlow) {
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover scale effect on clickable elements
    const clickables = document.querySelectorAll('a, button, .bento-item, .team-card');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(2.4)';
        });
        el.addEventListener('mouseleave', () => {
            if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // =========================================================================
    // 2. AMBIENT CANVAS PARTICLES (SUBTLE DUST MESH)
    // =========================================================================
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const count = 55;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        function drawAmbient() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < count; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(38, 132, 234, ${p.alpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < count; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(99, 169, 245, ${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(drawAmbient);
        }
        drawAmbient();
    }

    // =========================================================================
    // 3. TYPEWRITER EFFECT IN HERO
    // =========================================================================
    const typewriteEl = document.querySelector('.typewrite');
    if (typewriteEl) {
        const words = JSON.parse(typewriteEl.getAttribute('data-words'));
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 90;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typewriteEl.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriteEl.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 90;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1800; // Jeda saat kata selesai diketik
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400;
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 800);
    }

    // =========================================================================
    // 4. ANIMATED STATS COUNTER
    // =========================================================================
    const statNums = document.querySelectorAll('.stat-num');
    let statsCounted = false;

    function countUp() {
        statNums.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 1600;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // EaseOutQuad
                const currentVal = Math.floor(progress * target);
                stat.textContent = currentVal + (target === 100 ? '%' : '+');

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (target === 100 ? '%' : '+');
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Trigger counting on load
    setTimeout(countUp, 400);

    // =========================================================================
    // 5. 3D TILT EFFECT ON SQUAD CARDS (PURE JS)
    // =========================================================================
    const tiltCards = document.querySelectorAll('[data-tilt]');
    tiltCards.forEach(card => {
        const frame = card.querySelector('.avatar-3d-frame');
        const shine = card.querySelector('.frame-glass-shine');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -12;
            const rotateY = ((x - centerX) / centerX) * 12;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

            // 3D Parallax Pop-out on Avatar Frame
            if (frame) {
                frame.style.transform = `translateZ(42px) rotateX(${rotateX * 0.4}deg) rotateY(${rotateY * 0.4}deg) scale(1.05)`;
            }

            // Glass shine highlight sweeps with light direction
            if (shine) {
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                shine.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 50%, transparent 80%)`;
            }

            // Card glow follows mouse
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            if (frame) {
                frame.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)';
            }
            if (shine) {
                shine.style.background = 'linear-gradient(125deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 60%)';
            }
        });
    });

    // =========================================================================
    // 6. PORTFOLIO FILTER
    // =========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const bentoItems = document.querySelectorAll('.bento-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            bentoItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // =========================================================================
    // 7. PROJECT CASE STUDY MODAL
    // =========================================================================
    window.openProjectModal = function(title, tag, desc, stack, imgSrc) {
        const modal = document.getElementById('project-modal');
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-tag').textContent = tag;
        document.getElementById('modal-desc').textContent = desc;
        document.getElementById('modal-stack').textContent = stack;

        const imgContainer = document.getElementById('modal-img-container');
        const modalImg = document.getElementById('modal-img');
        if (imgContainer && modalImg) {
            if (imgSrc) {
                modalImg.src = imgSrc;
                imgContainer.style.display = 'flex';
            } else {
                imgContainer.style.display = 'none';
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeProjectModal = function() {
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // =========================================================================
    // 7B. KARTA IDENTITY EXPLORER TABS
    // =========================================================================
    const idTabBtns = document.querySelectorAll('.id-tab-btn');
    const idPanels = document.querySelectorAll('.id-panel');

    idTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            idTabBtns.forEach(b => b.classList.remove('active'));
            idPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const activePanel = document.getElementById(`panel-${targetTab}`);
            if (activePanel) activePanel.classList.add('active');
        });
    });

    // Copy Color Code to Clipboard with Toast
    window.copyColor = function(hex, name) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(hex).then(() => {
                showToast(`🎨 Warna ${name} (${hex}) berhasil disalin ke clipboard!`);
            }).catch(() => {
                showToast(`Kode warna: ${hex}`);
            });
        } else {
            showToast(`Kode warna: ${hex}`);
        }
    };

    // Scroll to Identity Section smoothly
    window.scrollToIdentity = function() {
        const section = document.getElementById('identity');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });

    // =========================================================================
    // 8. INTERACTIVE CONTACT FORM & TOAST NOTIFICATION
    // =========================================================================
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    function showToast(message) {
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3800);
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const submitLabel = submitButton ? submitButton.querySelector('span') : null;
            const originalLabel = submitLabel ? submitLabel.textContent : '';

            if (submitButton) submitButton.disabled = true;
            if (submitLabel) submitLabel.textContent = 'Mengirim pesan...';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: { Accept: 'application/json' },
                    body: new FormData(contactForm)
                });
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Pesan belum berhasil dikirim. Silakan coba lagi.');
                }

                showToast(result.message);
                contactForm.reset();
            } catch (error) {
                showToast(error.message || 'Koneksi bermasalah. Silakan coba lagi.');
            } finally {
                if (submitButton) submitButton.disabled = false;
                if (submitLabel) submitLabel.textContent = originalLabel;
            }
        });
    }

    // =========================================================================
    // 9. NAVBAR SCROLL EFFECT & MOBILE MENU TOGGLE
    // =========================================================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // =========================================================================
    // 10. CONSOLE CREDITS
    // =========================================================================
    console.log(
        "%c KARTA STUDIO — BRANDING AGENCY %c\n" +
        "Crafted with passion by:\n" +
        "1. Muhammad Raffi Akbar (Direktur / Owner)\n" +
        "2. Haryo Basithu Priyono (Manajer Operasional & Layanan Klien)\n" +
        "3. Muhammad Zidane (Manajer Pemasaran & Media Sosial)\n" +
        "4. Muhammad Fadlan Sumartono (Manajer Kreatif Desain & Logo)\n" +
        "5. Reyvan Dwi Herwanto (Manajer Video Editing & Produksi Konten)\n" +
        "Visit: https://kartastudio.com",
        "background: #38bdf8; color: #04060b; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;",
        "color: #94a3b8; font-size: 12px;"
    );

});
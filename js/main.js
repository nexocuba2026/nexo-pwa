// ============================================
// HOSTAL CIENFUEGOS - JAVASCRIPT PRINCIPAL
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ----- ELEMENTOS DEL DOM -----
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');
    const transporteCheckbox = document.getElementById('transporte');
    const transporteDetalles = document.getElementById('transporteDetalles');
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const newsletterForm = document.getElementById('newsletterForm');

    // ----- MENÚ MÓVIL -----
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // ----- NAVBAR SCROLL -----
    window.addEventListener('scroll', function() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255,255,255,0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(255,255,255,0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
            }
        }
    });

    // ----- TRANSPORTE CHECKBOX -----
    if (transporteCheckbox) {
        transporteCheckbox.addEventListener('change', function() {
            if (transporteDetalles) {
                if (this.checked) {
                    transporteDetalles.style.display = 'block';
                } else {
                    transporteDetalles.style.display = 'none';
                }
            }
        });
    }

    // ----- FORMULARIO DE RESERVA -----
    if (bookingForm) {
        // Establecer fecha mínima
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) checkinInput.setAttribute('min', today);
        
        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', function() {
                checkoutInput.setAttribute('min', this.value);
                if (checkoutInput.value && checkoutInput.value < this.value) {
                    checkoutInput.value = this.value;
                }
            });
        }

        // Enviar formulario
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar fechas
            const checkinVal = checkinInput ? checkinInput.value : '';
            const checkoutVal = checkoutInput ? checkoutInput.value : '';
            
            if (!checkinVal || !checkoutVal) {
                alert('Por favor selecciona las fechas de entrada y salida');
                return;
            }
            
            if (new Date(checkoutVal) <= new Date(checkinVal)) {
                alert('La fecha de salida debe ser posterior a la fecha de entrada');
                return;
            }
            
            // Recoger datos
            const formData = {
                nombre: document.getElementById('nombre')?.value || '',
                email: document.getElementById('email')?.value || '',
                telefono: document.getElementById('telefono')?.value || '',
                checkin: checkinVal,
                checkout: checkoutVal,
                habitacion: document.getElementById('habitacion')?.value || '',
                huespedes: document.getElementById('huespedes')?.value || '',
                transporte: transporteCheckbox?.checked || false,
                tipoTransporte: document.getElementById('tipoTransporte')?.value || '',
                detallesTransporte: document.getElementById('detallesTransporte')?.value || '',
                mensaje: document.getElementById('mensaje')?.value || ''
            };
            
            console.log('📩 Datos de reserva:', formData);
            
            // Simular envío
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(function() {
                bookingForm.style.display = 'none';
                if (successMessage) {
                    successMessage.style.display = 'block';
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                bookingForm.reset();
                if (transporteDetalles) transporteDetalles.style.display = 'none';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Enviar a WhatsApp (opcional)
                enviarWhatsApp(formData);
            }, 2000);
        });
    }

    // ----- NEWSLETTER -----
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput) {
                console.log('📧 Newsletter:', emailInput.value);
                const btn = this.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = '¡Gracias!';
                btn.style.background = '#27ae60';
                
                setTimeout(function() {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    newsletterForm.reset();
                }, 2500);
            }
        });
    }

    // ----- SCROLL SUAVE -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 90;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });

});

// ----- ENVIAR WHATSAPP -----
function enviarWhatsApp(data) {
    const phone = '535XXXXXXXX'; // Cambia por tu número
    const mensaje = encodeURIComponent(
        `🏨 *NUEVA RESERVA - Hostal Cienfuegos*\n\n` +
        `👤 *Nombre:* ${data.nombre}\n` +
        `📧 *Email:* ${data.email}\n` +
        `📱 *WhatsApp:* ${data.telefono}\n` +
        `📅 *Check-in:* ${data.checkin}\n` +
        `📅 *Check-out:* ${data.checkout}\n` +
        `🛏️ *Habitación:* ${data.habitacion}\n` +
        `👥 *Huéspedes:* ${data.huespedes}\n` +
        `🚗 *Transporte:* ${data.transporte ? 'Sí - ' + data.tipoTransporte : 'No'}\n` +
        `📝 *Mensaje:* ${data.mensaje || 'Ninguno'}`
    );
    
    console.log('📲 WhatsApp URL generada');
    // Descomenta para abrir WhatsApp automáticamente:
    // window.open(`https://wa.me/${phone}?text=${mensaje}`, '_blank');
}
// ============ DOM ELEMENTS ============
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const transporteCheckbox = document.getElementById('transporte');
const transporteDetalles = document.getElementById('transporteDetalles');
const newsletterForm = document.getElementById('newsletterForm');

// ============ NAVIGATION ============
// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============ TRANSPORTE CHECKBOX ============
transporteCheckbox.addEventListener('change', function() {
    if (this.checked) {
        transporteDetalles.style.display = 'block';
        transporteDetalles.style.animation = 'fadeInDown 0.3s ease';
    } else {
        transporteDetalles.style.display = 'none';
    }
});

// ============ BOOKING FORM ============
bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate dates
    const checkin = new Date(document.getElementById('checkin').value);
    const checkout = new Date(document.getElementById('checkout').value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkin < today) {
        showError('La fecha de entrada no puede ser anterior a hoy');
        return;
    }
    
    if (checkout <= checkin) {
        showError('La fecha de salida debe ser posterior a la fecha de entrada');
        return;
    }
    
    // Collect form data
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        habitacion: document.getElementById('habitacion').value,
        huespedes: document.getElementById('huespedes').value,
        transporte: transporteCheckbox.checked,
        tipoTransporte: document.getElementById('tipoTransporte').value,
        detallesTransporte: document.getElementById('detallesTransporte').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    // Here you would typically send this data to a server
    // For now, we'll simulate a successful submission
    console.log('Datos de reserva:', formData);
    
    // Simulate form submission
    simulateFormSubmission(formData);
});

function showError(message) {
    alert(message); // You can replace this with a more elegant error display
}

function simulateFormSubmission(formData) {
    // Show loading state
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Hide form, show success message
        bookingForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.style.animation = 'fadeInUp 0.5s ease';
        
        // Reset form
        bookingForm.reset();
        transporteDetalles.style.display = 'none';
        
        // Send WhatsApp notification (optional)
        sendWhatsAppNotification(formData);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function sendWhatsAppNotification(formData) {
    const phoneNumber = '535XXXXXXXX'; // Replace with actual WhatsApp number
    const message = encodeURIComponent(
        `*Nueva Reserva - Hostal Cienfuegos*\n\n` +
        `*Nombre:* ${formData.nombre}\n` +
        `*Email:* ${formData.email}\n` +
        `*Teléfono:* ${formData.telefono}\n` +
        `*Check-in:* ${formData.checkin}\n` +
        `*Check-out:* ${formData.checkout}\n` +
        `*Habitación:* ${formData.habitacion}\n` +
        `*Huéspedes:* ${formData.huespedes}\n` +
        `*Transporte:* ${formData.transporte ? 'Sí' : 'No'}\n` +
        (formData.transporte ? `*Tipo Transporte:* ${formData.tipoTransporte}\n` : '') +
        `*Mensaje:* ${formData.mensaje || 'Ninguno'}`
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    console.log('WhatsApp URL:', whatsappUrl);
    // Uncomment the line below to actually open WhatsApp
    // window.open(whatsappUrl, '_blank');
}

// ============ NEWSLETTER FORM ============
newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    // Here you would typically send this to your email marketing service
    console.log('Newsletter subscription:', email);
    
    // Show success feedback
    const submitBtn = this.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '¡Gracias!';
    submitBtn.style.backgroundColor = '#27ae60';
    submitBtn.style.borderColor = '#27ae60';
    submitBtn.style.color = '#ffffff';
    
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = '';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        this.reset();
    }, 2000);
});

// ============ IMAGE LAZY LOADING ============
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
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
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ============ SCROLL ANIMATIONS ============
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', revealOnScroll);

// ============ SET MINIMUM DATE FOR CHECK-IN ============
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').setAttribute('min', today);
    
    // Update check-out minimum date when check-in changes
    document.getElementById('checkin').addEventListener('change', function() {
        document.getElementById('checkout').setAttribute('min', this.value);
        if (document.getElementById('checkout').value < this.value) {
            document.getElementById('checkout').value = this.value;
        }
    });
});

// ============ UTILITY FUNCTIONS ============
function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function calculateNights(checkin, checkout) {
    const diffTime = Math.abs(new Date(checkout) - new Date(checkin));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============ ERROR HANDLING ============
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    // Aquí puedes agregar tu servicio de monitoreo de errores
});

// ============ PERFORMANCE OPTIMIZATIONS ============
// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
window.addEventListener('scroll', debounce(() => {
    // Any scroll-based operations
}, 10));
// script.js

// ------------------ Bloqueo de inspección básico (no infalible) ------------------

// Bloquear clic derecho
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});

document.addEventListener('keydown', (e) => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
    (e.ctrlKey && e.key === 'u')
  ) {
    e.preventDefault();
    e.stopPropagation();
  }
});

// Sobrescribir posibles reversiones mínimas
document.oncontextmenu = function () { return false; };
document.onkeydown = function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    return false;
  }
};

// ------------------ Funciones públicas ------------------

function setActiveNavFromPath() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const normalizedHref = href.split('/').pop();
    if (
      normalizedHref === path ||
      (normalizedHref === 'index.html' && (path === '' || path === 'index.html')) ||
      (normalizedHref === 'about.html' && path === 'about.html')
    ) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuToggle) return;

  const toggleMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', (!isExpanded).toString());
    navLinks?.classList.toggle('active');
    menuToggle.innerHTML = isExpanded
      ? '<i class="fas fa-bars"></i>'
      : '<i class="fas fa-times"></i>';
    document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
  };

  menuToggle.addEventListener('click', toggleMenu);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('active');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
      document.body.style.overflow = 'auto';
    });
  });
}

// ------------------ Comportamientos internos ------------------

function typewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;
  const phrases = [
    'Desarrollador Full Stack',
    'Especialista en .NET',
    'Entusiasta móvil',
    'Solucionador de problemas',
    'Apasionado por la tecnología',
    'Innovador',
    'Colaborador',
    'Aprendiz continuo',
    'Optimizador de procesos',
    'Experto en desarrollo web',
    'Experto en desarrollo móvil',
    'Desarrollador de aplicaciones móviles',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  const type = () => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  };

  setTimeout(type, 1000);
}

function scrollEffects() {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-link');
  const header = document.querySelector('.header');

  const handleScroll = () => {
    if (window.scrollY > 100) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.getAttribute('id') || '';
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSection}`) {
        item.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

function scrollAnimations() {
  const animateElements = document.querySelectorAll(
    '.fade-in, .project-card, .about-content, .contact-form, .contact-info'
  );

  const checkPosition = () => {
    animateElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  };

  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  window.addEventListener('scroll', checkPosition);
  window.addEventListener('load', checkPosition);
  checkPosition();
}

function contactForm() {
  const form = document.getElementById('contact-form');
  const formResponse = document.getElementById('form-response');
  const successMessage = document.getElementById('success-message');
  const closeSuccess = document.getElementById('close-success');

  if (!form) return;

  const showSuccessMessage = () => {
    if (successMessage) {
      successMessage.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const hideSuccessMessage = () => {
    if (successMessage) {
      successMessage.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  };

  if (closeSuccess) {
    closeSuccess.addEventListener('click', hideSuccessMessage);
  }

  if (successMessage) {
    successMessage.addEventListener('click', (e) => {
      if (e.target === successMessage) {
        hideSuccessMessage();
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    if (formResponse) {
      formResponse.textContent = 'Enviando mensaje...';
      formResponse.className = 'form-response loading';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        showSuccessMessage();
        form.reset();
        localStorage.setItem("formularioEnviado", "true");
        if (formResponse) {
          formResponse.textContent = '¡Mensaje enviado con éxito!';
          formResponse.className = 'form-response success';
        }
        setTimeout(() => {
          window.location.href = form.querySelector('[name="_next"]')?.value || window.location.href;
        }, 3000);
      } else {
        let errorMsg = 'Error al enviar el formulario';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (err) {
          const text = await response.text();
          if (text) errorMsg = text;
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error en el formulario:', error);
      let userMessage = 'El mensaje se envió, pero hubo un problema con la respuesta.';
      if (error.message.includes('Failed to fetch')) {
        userMessage = 'Problema de conexión. El mensaje podría haberse enviado.';
      }
      if (formResponse) {
        formResponse.textContent = userMessage;
        formResponse.className = 'form-response warning';
      }
    }

    setTimeout(() => {
      if (formResponse) {
        formResponse.textContent = '';
        formResponse.className = 'form-response';
      }
    }, 5000);
  });
}

function updateYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

function backToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('active', window.scrollY > 500);
  });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ------------------ Inicialización ------------------

function initAll() {
  setActiveNavFromPath();
  initMobileMenu();
  typewriter();
  scrollEffects();
  scrollAnimations();
  contactForm();
  updateYear();
  backToTop();
}

document.addEventListener('DOMContentLoaded', () => {
  initAll();
});
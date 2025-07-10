// script.js
document.addEventListener('DOMContentLoaded', function() {
  // 1. Efecto máquina de escribir
  const typewriter = () => {
    const typewriterElement = document.getElementById('typewriter');
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

      // Cambiar de frase
      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pausa al final
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pausa al inicio
      }

      setTimeout(type, typingSpeed);
    };

    // Iniciar después de 1s para permitir que la página cargue
    setTimeout(type, 1000);
  };

  // 2. Menú móvil con accesibilidad mejorada
  const mobileMenu = () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
      menuToggle.innerHTML = isExpanded 
        ? '<i class="fas fa-bars"></i>' 
        : '<i class="fas fa-times"></i>';
      
      // Bloquear scroll cuando el menú está abierto
      document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
      });
    });
  };

  // 3. Scroll effects (secciones activas, header)
  const scrollEffects = () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    const handleScroll = () => {
      // Header con efecto de scroll
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Resaltar enlace activo
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - sectionHeight / 3) {
          currentSection = section.getAttribute('id');
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${currentSection}`) {
          item.classList.add('active');
        }
      });
    };

    // Ejecutar al cargar y en scroll
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  };

  // 4. Animaciones al hacer scroll
  const scrollAnimations = () => {
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

    // Inicializar elementos
    animateElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', checkPosition);
    window.addEventListener('load', checkPosition);
    checkPosition(); // Ejecutar una vez al cargar
  };

  // 6. Formulario de contacto mejorado con manejo de errores
  const contactForm = () => {
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

      // Mostrar estado de carga
      formResponse.textContent = 'Enviando mensaje...';
      formResponse.className = 'form-response loading';

      try {
        // Enviar datos usando FormSubmit
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        // Aquí está el cambio clave para manejar FormSubmit correctamente
        if (response.ok) {
          // Mostrar mensaje de éxito aunque la respuesta no sea JSON
          showSuccessMessage();
          form.reset();
          localStorage.setItem("formularioEnviado", "true");
          
          formResponse.textContent = '¡Mensaje enviado con éxito!';
          formResponse.className = 'form-response success';
          
          // Redirigir después de 3 segundos (como respaldo)
          setTimeout(() => {
            window.location.href = form.querySelector('[name="_next"]').value || window.location.href;
          }, 3000);
        } else {
          // Intentar parsear el error como JSON o texto
          let errorMsg = 'Error al enviar el formulario';
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
          } catch (e) {
            const text = await response.text();
            if (text) errorMsg = text;
          }
          throw new Error(errorMsg);
        }
      } catch (error) {
        console.error('Error en el formulario:', error);
        
        // Mensaje de error mejorado
        let userMessage = 'El mensaje se envió, pero hubo un problema con la respuesta.';
        if (error.message.includes('Failed to fetch')) {
          userMessage = 'Problema de conexión. El mensaje podría haberse enviado.';
        }
        
        formResponse.textContent = userMessage;
        formResponse.className = 'form-response warning'; // Cambiado a "warning" en lugar de "error"
      }

      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        formResponse.textContent = '';
        formResponse.className = 'form-response';
      }, 5000);
    });
  };

  // 7. Actualizar año en el footer
  const updateYear = () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  // 8. Botón "Volver arriba"
  const backToTop = () => {
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
  };

  // Inicializar todas las funciones
  typewriter();
  mobileMenu();
  scrollEffects();
  scrollAnimations();
  contactForm();
  updateYear();
  backToTop();
});
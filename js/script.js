/* ============================================
   SORRISO PRIME — JavaScript Principal - By m4chado7.
   Clínica Odontológica Premium
   @m4chado7.web nas redes sociais - github.com/m4chado7
   Deus é fiel!
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     1. VARIÁVEIS GLOBAIS E SELETORES
     ============================================ */

  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const backToTop = document.getElementById('backToTop');
  const contactForm = document.getElementById('contactForm');
  const statsSection = document.getElementById('statsSection');

  /* ============================================
     2. HEADER — Scroll Effect
     Reduz o header e adiciona fundo ao rolar
     ============================================ */

  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;

    // Adiciona/remove classe de scroll

    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    lastScroll = currentScroll;
  }

  /* ============================================
     3. NAVEGAÇÃO ATIVA
     Destaca o link do menu conforme a seção visível
     ============================================ */

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ============================================
     4. MENU MOBILE
     Abre e fecha o menu em dispositivos móveis
     ============================================ */

  function openMobileMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', openMobileMenu);
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Fechar menu ao clicar em um link

  document.querySelectorAll('.mobile-menu__link').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Fechar menu ao clicar no CTA

  var mobileCta = document.querySelector('.mobile-menu__cta');
  if (mobileCta) {
    mobileCta.addEventListener('click', closeMobileMenu);
  }

  // Fechar ao clicar fora (no overlay)

  mobileMenu.addEventListener('click', function (e) {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  /* ============================================
     5. BOTÃO VOLTAR AO TOPO
     Exibe/esconde e realiza scroll suave ao topo
     ============================================ */

  function handleBackToTop() {
    if (window.pageYOffset > 500) {
      backToTop.classList.add('back-to-top--visible');
    } else {
      backToTop.classList.remove('back-to-top--visible');
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     6. SCROLL REVEAL
     Anima elementos quando entram na viewport
     ============================================ */

  function initScrollReveal() {
    var revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: mostra tudo
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }
  }

  /* ============================================
     7. CONTADORES ANIMADOS
     Anima os números das estatísticas
     ============================================ */

  let statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;

    var counters = document.querySelectorAll('.stat-item__number[data-target]');

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 2000; // 2 segundos
      var startTime = null;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function update(currentTime) {
        if (!startTime) startTime = currentTime;
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easedProgress = easeOutQuart(progress);
        var currentValue = Math.floor(easedProgress * target);

        counter.textContent = currentValue.toLocaleString('pt-BR');

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toLocaleString('pt-BR');
        }
      }

      requestAnimationFrame(update);
    });

    statsAnimated = true;
  }

  function initStatsObserver() {
    if (!statsSection) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounters();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(statsSection);
    }
  }

  /* ============================================
     8. GALERIA — Lightbox
     Exibe imagens em tela cheia com navegação
     ============================================ */

  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var galleryImages = [];
  var currentLightboxIndex = 0;

  function initLightbox() {
    var galleryItems = document.querySelectorAll('.gallery__item');

    // Coleta todas as imagens da galeria

    galleryItems.forEach(function (item, index) {
      var img = item.querySelector('.gallery__img');
      if (img) {
        galleryImages.push(img.src);
      }

      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    // Eventos do lightbox

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function () {
        navigateLightbox(-1);
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', function () {
        navigateLightbox(1);
      });
    }

    // Fechar com ESC

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('lightbox--open')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // Fechar ao clicar fora da imagem

    if (lightbox) {
      lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
  }

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentLightboxIndex += direction;

    if (currentLightboxIndex < 0) {
      currentLightboxIndex = galleryImages.length - 1;
    } else if (currentLightboxIndex >= galleryImages.length) {
      currentLightboxIndex = 0;
    }

    updateLightboxImage();
  }

  function updateLightboxImage() {
    if (lightboxImg && galleryImages.length > 0) {
      lightboxImg.src = galleryImages[currentLightboxIndex];
      lightboxImg.alt = 'Imagem ' + (currentLightboxIndex + 1) + ' de ' + galleryImages.length;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent =
        (currentLightboxIndex + 1) + ' / ' + galleryImages.length;
    }
  }

  /* ============================================
     9. ANTES E DEPOIS — Slider Interativo
     Permite arrastar para comparar imagens
     ============================================ */

  function initBeforeAfterSliders() {
    var sliders = document.querySelectorAll('.result-card__slider');

    sliders.forEach(function (slider) {
      var beforeDiv = slider.querySelector('.result-card__before');
      var handle = slider.querySelector('.result-card__handle');
      var isDragging = false;

      function updateSliderPosition(x) {
        var rect = slider.getBoundingClientRect();
        var position = ((x - rect.left) / rect.width) * 100;

        // Limita entre 5% e 95%

        position = Math.max(5, Math.min(95, position));

        beforeDiv.style.width = position + '%';
        handle.style.left = position + '%';
      }

      // Mouse events

      slider.addEventListener('mousedown', function (e) {
        isDragging = true;
        updateSliderPosition(e.clientX);
        e.preventDefault();
      });

      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        updateSliderPosition(e.clientX);
      });

      document.addEventListener('mouseup', function () {
        isDragging = false;
      });

      // Touch events

      slider.addEventListener('touchstart', function (e) {
        isDragging = true;
        updateSliderPosition(e.touches[0].clientX);
      });

      document.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        updateSliderPosition(e.touches[0].clientX);
      });

      document.addEventListener('touchend', function () {
        isDragging = false;
      });
    });
  }

   /* ============================================
     10. DEPOIMENTOS — Carrossel (CORRIGIDO)
     ============================================ */
  var testimonialsTrack = document.getElementById('testimonialsTrack');
  var testimonialsPrevBtn = document.getElementById('testimonialsPrev');
  var testimonialsNextBtn = document.getElementById('testimonialsNext');
  var testimonialsDotsContainer = document.getElementById('testimonialsDots');
  var currentSlide = 0;
  var slidesPerView = 3;
  var totalSlides = 0;
  var totalPages = 0;
  var autoplayInterval = null;
  var isTransitioning = false;

  function getSlidesPerView() {
    var w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  function initTestimonials() {
    if (!testimonialsTrack) return;
    var cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    totalSlides = cards.length;
    if (totalSlides === 0) return;

    updateSlidesPerView();
    createDots();
    goToSlide(0);
    startAutoplay();

    if (testimonialsPrevBtn) {
      testimonialsPrevBtn.addEventListener('click', function () {
        stopAutoplay();
        prevSlide();
        startAutoplay();
      });
    }

    if (testimonialsNextBtn) {
      testimonialsNextBtn.addEventListener('click', function () {
        stopAutoplay();
        nextSlide();
        startAutoplay();
      });
    }

    // Pausar ao passar o mouse
    testimonialsTrack.addEventListener('mouseenter', stopAutoplay);
    testimonialsTrack.addEventListener('mouseleave', startAutoplay);
  }

  function updateSlidesPerView() {
    slidesPerView = getSlidesPerView();
    totalPages = Math.ceil(totalSlides / slidesPerView);
    if (currentSlide >= totalPages) currentSlide = totalPages - 1;
    if (currentSlide < 0) currentSlide = 0;
  }

  function createDots() {
    if (!testimonialsDotsContainer) return;
    testimonialsDotsContainer.innerHTML = '';
    for (var i = 0; i < totalPages; i++) {
      var dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      if (i === currentSlide) dot.classList.add('testimonials__dot--active');
      dot.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      dot.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('aria-label').replace('Ir para slide ', ''), 10) - 1;
        stopAutoplay();
        goToSlide(index);
        startAutoplay();
      });
      testimonialsDotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;

    currentSlide = Math.max(0, Math.min(index, totalPages - 1));

    var cards = testimonialsTrack.querySelectorAll('.testimonial-card');
    if (cards.length === 0) { isTransitioning = false; return; }

    var cardWidth = cards[0].offsetWidth;
    var gap = 28; // Deve ser idêntico ao gap do CSS
    var offset = currentSlide * slidesPerView * (cardWidth + gap);

    // Impede que o carrossel arraste para o vazio
    var trackWidth = testimonialsTrack.scrollWidth;
    var containerWidth = testimonialsTrack.parentElement.offsetWidth;
    var maxOffset = trackWidth - containerWidth;
    offset = Math.min(offset, maxOffset);
    offset = Math.max(0, offset);

    testimonialsTrack.style.transform = 'translateX(-' + offset + 'px)';

    // Sincroniza dots
    var dots = testimonialsDotsContainer.querySelectorAll('.testimonials__dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('testimonials__dot--active', i === currentSlide);
    });

    // Libera cliques após a animação
    setTimeout(function () { isTransitioning = false; }, 500);
  }

  function nextSlide() {
    var next = currentSlide + 1;
    if (next >= totalPages) next = 0;
    goToSlide(next);
  }

  function prevSlide() {
    var prev = currentSlide - 1;
    if (prev < 0) prev = totalPages - 1;
    goToSlide(prev);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  // Recalcula ao redimensionar (com debounce para performance)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateSlidesPerView();
      createDots();
      goToSlide(currentSlide);
    }, 250);
  });

  /* ============================================
     11. FAQ — Accordion
     Abre e fecha perguntas frequentes
     ============================================ */

  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq__question');

      if (question) {
        question.addEventListener('click', function () {
          var isActive = item.classList.contains('faq__item--active');

          // Fecha todos

          faqItems.forEach(function (otherItem) {
            otherItem.classList.remove('faq__item--active');
            var otherQuestion = otherItem.querySelector('.faq__question');
            if (otherQuestion) {
              otherQuestion.setAttribute('aria-expanded', 'false');
            }
          });

          // Abre o clicado (se não estava ativo)

          if (!isActive) {
            item.classList.add('faq__item--active');
            question.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  /* ============================================
     12. FORMULÁRIO DE CONTATO
     Validação e envio simulado
     ============================================ */

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var isValid = validateForm();

      if (isValid) {
        // Simula envio

        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
        submitBtn.disabled = true;

        setTimeout(function () {
          // Mostra mensagem de sucesso

          var formSuccess = document.getElementById('formSuccess');
          if (formSuccess) {
            formSuccess.classList.add('form__success--show');
          }

          // Reseta formulário

          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;

          // Esconde mensagem após 5s

          setTimeout(function () {
            if (formSuccess) {
              formSuccess.classList.remove('form__success--show');
            }
          }, 5000);
        }, 1500);
      }
    });

    // Validação em tempo real

    var inputs = contactForm.querySelectorAll('.form__input');
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(input);
      });

      input.addEventListener('input', function () {
        var group = input.closest('.form__group');
        if (group && group.classList.contains('form__group--error')) {
          validateField(input);
        }
      });
    });
  }

  function validateForm() {
    var name = document.getElementById('name');
    var phone = document.getElementById('phone');
    var email = document.getElementById('email');
    var isValid = true;

    if (!validateField(name)) isValid = false;
    if (!validateField(phone)) isValid = false;
    if (!validateField(email)) isValid = false;

    return isValid;
  }

  function validateField(field) {
    if (!field) return true;

    var group = field.closest('.form__group');
    var value = field.value.trim();
    var isValid = true;

    // Verifica required

    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }

    // Validação específica por tipo

    if (field.type === 'email' && value) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    if (field.type === 'tel' && value) {
      var phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
      }
    }

    if (group) {
      if (!isValid) {
        group.classList.add('form__group--error');
        field.classList.add('form__input--error');
      } else {
        group.classList.remove('form__group--error');
        field.classList.remove('form__input--error');
      }
    }

    return isValid;
  }

  /* ============================================
     13. MÁSCARA DE TELEFONE
     Formata o campo de telefone automaticamente
     ============================================ */

  function initPhoneMask() {
    var phoneInput = document.getElementById('phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', function (e) {
      var value = e.target.value.replace(/\D/g, '');
      var formatted = '';

      if (value.length > 0) {
        formatted = '(' + value.substring(0, 2);
      }
      if (value.length > 2) {
        formatted += ') ' + value.substring(2, 7);
      }
      if (value.length > 7) {
        formatted += '-' + value.substring(7, 11);
      }

      e.target.value = formatted;
    });
  }

  /* ============================================
     14. SCROLL SUAVE PARA LINKS INTERNOS
     ============================================ */

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();

          var headerHeight = header ? header.offsetHeight : 0;
          var targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  }

  /* ============================================
     15. ANO ATUAL NO FOOTER
     ============================================ */

  function updateCurrentYear() {
    var yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     16. IMAGENS — Fade In ao carregar
     ============================================ */

  function initImageLoader() {
    var images = document.querySelectorAll('img');
    images.forEach(function (img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function () {
          img.classList.add('loaded');
        });
        img.addEventListener('error', function () {

          // Mostra placeholder em caso de erro

          img.style.background = 'var(--color-gray-100)';
          img.style.minHeight = '200px';
          img.classList.add('loaded');
        });
      }
    });
  }

  /* ============================================
     17. EVENT LISTENERS GLOBAIS
     ============================================ */

  window.addEventListener('scroll', function () {
    handleHeaderScroll();
    handleBackToTop();
    updateActiveNav();
  }, { passive: true });

  // Recalcular carrossel ao redimensionar

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      updateSlidesPerView();
      createDots();
      goToSlide(Math.min(currentSlide, totalPages - 1));
    }, 250);
  });

  /* ============================================
     18. INICIALIZAÇÃO
     Executa tudo quando o DOM estiver pronto
     ============================================ */

  function init() {
    initScrollReveal();
    initStatsObserver();
    initLightbox();
    initBeforeAfterSliders();
    initTestimonials();
    initFAQ();
    initContactForm();
    initPhoneMask();
    initSmoothScroll();
    updateCurrentYear();
    initImageLoader();

    // Trigger inicial do header

    handleHeaderScroll();
  }

  // Executa quando o DOM estiver pronto

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
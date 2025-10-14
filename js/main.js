// Main JavaScript file for Kemi Landing Page

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initScrollAnimations();
  initContactForm();
  initSmoothScrolling();
  initHeaderScroll();
  initLanguageToggle();
  initParticleSystem();
  initAdvancedAnimations();
  initCounterAnimation();
});

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav__link");

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    });
  }

  // Close mobile menu
  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = ""; // Restore scrolling
    });
  }

  // Close menu when clicking on nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = ""; // Restore scrolling
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "";
    }
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("show-menu")) {
      navMenu.classList.remove("show-menu");
      document.body.style.overflow = "";
    }
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById("header");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add scrolled class for styling
    if (scrollTop > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScrollTop = scrollTop;
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(`
        .hero__content,
        .hero__image,
        .expertise__card,
        .about__content,
        .about__image,
        .convictions__content,
        .clients__grid,
        .contact__content,
        .contact__form
    `);

  animateElements.forEach((el) => {
    observer.observe(el);
  });
}

// Contact form functionality
function initContactForm() {
  const form = document.getElementById("contact-form");

  if (!form) return;

  // Form validation
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearError(input));
  });

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateForm()) {
      submitForm(form);
    }
  });
}

// Field validation
function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  let isValid = true;
  let errorMessage = "";

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    isValid = false;
    errorMessage = `${getFieldLabel(field)} est requis`;
  }

  // Email validation
  if (fieldName === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = "Veuillez entrer une adresse email valide";
    }
  }

  // Phone validation (if needed)
  if (fieldName === "phone" && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      isValid = false;
      errorMessage = "Veuillez entrer un numéro de téléphone valide";
    }
  }

  // Show/hide error
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    clearError(field);
  }

  return isValid;
}

// Form validation
function validateForm() {
  const form = document.getElementById("contact-form");
  const inputs = form.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );
  let isFormValid = true;

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isFormValid = false;
    }
  });

  return isFormValid;
}

// Show field error
function showFieldError(field, message) {
  field.classList.add("error");

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".form__error");
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorElement = document.createElement("span");
  errorElement.className = "form__error";
  errorElement.textContent = message;
  errorElement.style.color = "var(--error-color)";
  errorElement.style.fontSize = "var(--font-size-sm)";
  errorElement.style.marginTop = "var(--spacing-xs)";
  errorElement.style.display = "block";

  field.parentNode.appendChild(errorElement);
}

// Clear field error
function clearError(field) {
  field.classList.remove("error");
  const errorElement = field.parentNode.querySelector(".form__error");
  if (errorElement) {
    errorElement.remove();
  }
}

// Get field label
function getFieldLabel(field) {
  const label = field.parentNode.querySelector(".form__label");
  return label ? label.textContent : field.name;
}

// Submit form
function submitForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.textContent = "Envoi en cours...";
  submitButton.disabled = true;

  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    // Reset form
    form.reset();

    // Show success message
    showSuccessMessage();

    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;

    // Clear all errors
    const errorElements = form.querySelectorAll(".form__error");
    errorElements.forEach((error) => error.remove());

    const errorFields = form.querySelectorAll(".error");
    errorFields.forEach((field) => field.classList.remove("error"));
  }, 2000);
}

// Show success message
function showSuccessMessage() {
  const form = document.getElementById("contact-form");
  const successMessage = document.createElement("div");

  successMessage.className = "form__success";
  successMessage.innerHTML = `
        <div style="
            background-color: var(--success-color);
            color: white;
            padding: var(--spacing-md);
            border-radius: var(--border-radius-md);
            margin-bottom: var(--spacing-lg);
            text-align: center;
        ">
            <strong>Merci !</strong> Votre message a été envoyé avec succès. Nous vous contacterons bientôt.
        </div>
    `;

  form.insertBefore(successMessage, form.firstChild);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

// Utility functions
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

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add loading animation for images
function initImageLoading() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });

    // If image is already loaded
    if (img.complete) {
      img.classList.add("loaded");
    }
  });
}

// Initialize image loading
initImageLoading();

// Add CSS for image loading animation
const style = document.createElement("style");
style.textContent = `
    img {
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
    }
    
    img.loaded {
        opacity: 1;
    }
    
    .form__error {
        color: var(--error-color);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-xs);
        display: block;
    }
`;
document.head.appendChild(style);

// Performance optimization: Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // Skip to main content
  if (e.key === "Tab" && e.target === document.body) {
    const main = document.querySelector("main");
    if (main) {
      main.focus();
    }
  }
});

// Add focus management for mobile menu
function manageFocus() {
  const navMenu = document.getElementById("nav-menu");
  const focusableElements = navMenu.querySelectorAll(
    "a, button, input, select, textarea"
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  navMenu.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Initialize focus management
manageFocus();

// Add ARIA labels and roles for accessibility
function enhanceAccessibility() {
  // Add ARIA labels to buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    if (!button.getAttribute("aria-label") && !button.textContent.trim()) {
      button.setAttribute("aria-label", "Button");
    }
  });

  // Add ARIA labels to navigation
  const nav = document.querySelector(".nav");
  if (nav) {
    nav.setAttribute("role", "navigation");
    nav.setAttribute("aria-label", "Main navigation");
  }

  // Add ARIA labels to sections
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    const heading = section.querySelector("h1, h2, h3");
    if (heading && !section.getAttribute("aria-labelledby")) {
      const id =
        heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
      heading.id = id;
      section.setAttribute("aria-labelledby", id);
    }
  });
}

// Initialize accessibility enhancements
enhanceAccessibility();

// Language Toggle Functionality
function initLanguageToggle() {
  const languageToggle = document.getElementById("language-toggle");
  const languageCurrent = languageToggle?.querySelector(".language-current");
  const navMenuTaglineText = document.querySelector(".nav__menu-tagline-text");

  if (!languageToggle || !languageCurrent) return;

  let currentLanguage = "fr";

  // Language data
  const translations = {
    fr: {
      "conseil & partners": "conseil & partners",
      "Expertise en gouvernance et performance durable":
        "Expertise en gouvernance et performance durable",
      "Accompagnement stratégique pour un avenir résilient":
        "Accompagnement stratégique pour un avenir résilient",
      "« Guidé par mes valeurs et le désir d'être utile à la société, je m'engage aux côtés de mes clients pour construire ensemble un avenir résilient et durable. »":
        "« Guidé par mes valeurs et le désir d'être utile à la société, je m'engage aux côtés de mes clients pour construire ensemble un avenir résilient et durable. »",
      "Nos domaines d'expertise": "Nos domaines d'expertise",
      "Contactez-nous": "Contactez-nous",
      "Collaborateurs supervisés": "Collaborateurs supervisés",
      "Grands comptes": "Grands comptes",
      "Missions réalisées": "Missions réalisées",
      Accueil: "Accueil",
      "Domaines d'expertise": "Domaines d'expertise",
      "À propos": "À propos",
      "Mes convictions": "Mes convictions",
      "Ils m'ont fait confiance": "Ils m'ont fait confiance",
      Contact: "Contact",
    },
    en: {
      "conseil & partners": "consulting & partners",
      "Expertise en gouvernance et performance durable":
        "Expertise in governance and sustainable performance",
      "Accompagnement stratégique pour un avenir résilient":
        "Strategic support for a resilient future",
      "« Guidé par mes valeurs et le désir d'être utile à la société, je m'engage aux côtés de mes clients pour construire ensemble un avenir résilient et durable. »":
        "« Guided by my values and the desire to be useful to society, I commit alongside my clients to build together a resilient and sustainable future. »",
      "Nos domaines d'expertise": "Our Areas of Expertise",
      "Contactez-nous": "Contact Us",
      "Collaborateurs supervisés": "Supervised Collaborators",
      "Grands comptes": "Key Accounts",
      "Missions réalisées": "Completed Missions",
      Accueil: "Home",
      "Domaines d'expertise": "Areas of Expertise",
      "À propos": "About",
      "Mes convictions": "My Convictions",
      "Ils m'ont fait confiance": "They Trusted Me",
      Contact: "Contact",
    },
  };

  function updateLanguage(lang) {
    currentLanguage = lang;
    languageCurrent.textContent = lang.toUpperCase();

    // Update mobile menu tagline text
    if (navMenuTaglineText) {
      const text = navMenuTaglineText.getAttribute(`data-${lang}`);
      if (text) {
        navMenuTaglineText.textContent = text;
      }
    }

    // Update all elements with data attributes
    const elementsToUpdate = document.querySelectorAll("[data-fr][data-en]");
    elementsToUpdate.forEach((element) => {
      const text = element.getAttribute(`data-${lang}`);
      if (text) {
        element.textContent = text;
      }
    });

    // Store language preference
    localStorage.setItem("sabeni-language", lang);
  }

  // Load saved language preference
  const savedLanguage = localStorage.getItem("sabeni-language") || "fr";
  updateLanguage(savedLanguage);

  // Toggle language on click
  // Add event listeners
  languageToggle.addEventListener("click", () => {
    const newLanguage = currentLanguage === "fr" ? "en" : "fr";
    updateLanguage(newLanguage);

    // Add animation effect
    languageToggle.style.transform = "scale(0.95)";
    setTimeout(() => {
      languageToggle.style.transform = "scale(1)";
    }, 150);
  });
}

// Particle System
function initParticleSystem() {
  const particlesContainer = document.getElementById("particles");
  if (!particlesContainer) return;

  const particleCount = 50;
  const particles = [];

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: rgba(46, 125, 50, ${Math.random() * 0.6 + 0.2});
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * 10}s;
    `;
    particlesContainer.appendChild(particle);
    particles.push(particle);
  }

  // Add mouse interaction
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    particles.forEach((particle, index) => {
      const speed = ((index % 3) + 1) * 0.5;
      const x = mouseX * speed * 20;
      const y = mouseY * speed * 20;

      particle.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Advanced Animations
function initAdvancedAnimations() {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Add staggered animation for cards
        if (entry.target.classList.contains("expertise__card")) {
          const cards = document.querySelectorAll(".expertise__card");
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.animation = `slideInUp 0.6s ease-out ${
                index * 0.1
              }s both`;
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements for advanced animations
  const animateElements = document.querySelectorAll(`
    .expertise__card,
    .convictions__content,
    .clients__grid,
    .about__profile,
    .contact__form
  `);

  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Add parallax effect to hero elements
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(
      ".hero__logo, .hero__quote"
    );

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + index * 0.1;
      element.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });

  // Add magnetic effect to buttons
  const buttons = document.querySelectorAll(".button");
  buttons.forEach((button) => {
    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.1}px, ${
        y * 0.1
      }px) scale(1.05)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0px, 0px) scale(1)";
    });
  });
}

// Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll(".stats__number, .stat__number");

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-count"));
        animateCounter(counter, target);
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach((counter) => {
    observer.observe(counter);
  });
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const duration = 2000; // 2 seconds
  const stepTime = duration / 100;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, stepTime);
}

// Initialize GSAP & Plugins
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. Preloader Animation
  initPreloader();

  // 2. Custom Glowing Magnetic Cursor
  initCustomCursor();

  // 3. Three.js Interactive 3D Canvas Background
  initThreeCanvas();

  // 4. GSAP ScrollTrigger Animations
  initScrollAnimations();

  // 5. Navigation & Header Logic
  initNavigation();

  // 6. Portfolio Filter & Lightbox
  initPortfolio();

  // 7. Initialize VanillaTilt Cards
  initTilt();

  // 8. Footer Year
  initFooterYear();
});

/* ----------------------------------------------------
   1. Preloader Animation
---------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById("preloader");
  const loaderFill = document.getElementById("loader-fill");

  if (!preloader || !loaderFill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 10;
    if (progress > 100) progress = 100;
    loaderFill.style.width = progress + "%";

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        gsap.to(preloader, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            preloader.classList.add("loaded");
            triggerHeroEntrance();
          }
        });
      }, 300);
    }
  }, 60);
}

function triggerHeroEntrance() {
  const heroTl = gsap.timeline();
  heroTl.from(".home .block", {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  })
  .from(".hero-visual-3d", {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)"
  }, "-=0.8");
}

/* ----------------------------------------------------
   2. Custom Glowing Cursor
---------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".cursor-follower");

  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";

    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  // Hover Effect for interactive elements
  const hoverTargets = document.querySelectorAll("a, button, .hamburger, .filter-btn li, .item, .box");
  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => document.body.classList.add("hovered"));
    target.addEventListener("mouseleave", () => document.body.classList.remove("hovered"));
  });
}

/* ----------------------------------------------------
   3. Three.js Interactive 3D Particle Background
---------------------------------------------------- */
function initThreeCanvas() {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles
  const particleCount = 120;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorAccent = new THREE.Color(0x5f88e0);
  const colorLight = new THREE.Color(0xecf1fa);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 800;
    positions[i + 1] = (Math.random() - 0.5) * 800;
    positions[i + 2] = (Math.random() - 0.5) * 800;

    const mixedColor = Math.random() > 0.5 ? colorAccent : colorLight;
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Mouse Parallax Interaction
  let targetX = 0, targetY = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.05;
    targetY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;

    particleSystem.position.x += (targetX - particleSystem.position.x) * 0.05;
    particleSystem.position.y += (-targetY - particleSystem.position.y) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ----------------------------------------------------
   4. GSAP ScrollTrigger Animations
---------------------------------------------------- */
function initScrollAnimations() {
  // Reveal Up Elements
  gsap.utils.toArray(".reveal-up").forEach((element) => {
    gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Parallax Effect on Titles
  gsap.utils.toArray(".title").forEach((title) => {
    gsap.to(title, {
      yPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: title,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  });
}

/* ----------------------------------------------------
   5. Navigation & Sticky Header
---------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector("header");
  const hamBurger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navbar ul li a");
  const sections = document.querySelectorAll("section[id]");

  // Header Fixed Class on Scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 80) {
      header.classList.add("fixed");
    } else {
      header.classList.remove("fixed");
    }

    // Active Section Scroll Spy
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamBurger && navbar) {
    hamBurger.addEventListener("click", () => {
      navbar.classList.toggle("show");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("show");
      });
    });
  }
}

/* ----------------------------------------------------
   6. Portfolio Filter & Lightbox
---------------------------------------------------- */
function initPortfolio() {
  const filterBtn = document.querySelectorAll("#filterBtn li");
  const items = document.querySelectorAll(".gallery .item");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  const closeLightbox = document.querySelector(".close-lightbox");

  // Category Filter
  filterBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtn.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const target = this.getAttribute("data-target");

      items.forEach((item) => {
        if (target === "all" || item.getAttribute("data-id") === target) {
          gsap.to(item, { scale: 1, opacity: 1, duration: 0.4, display: "block" });
        } else {
          gsap.to(item, { scale: 0.8, opacity: 0, duration: 0.4, display: "none" });
        }
      });
    });
  });

  // Lightbox Modal Functionality
  if (lightbox && lightboxImg) {
    closeLightbox.addEventListener("click", () => {
      lightbox.classList.remove("show");
      lightbox.classList.add("hide");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("show");
        lightbox.classList.add("hide");
      }
    });
  }
}

/* ----------------------------------------------------
   7. VanillaTilt 3D Tilt Initialization
---------------------------------------------------- */
function initTilt() {
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.15
    });
  }
}

/* ----------------------------------------------------
   8. Dynamic Footer Copyright Year
---------------------------------------------------- */
function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
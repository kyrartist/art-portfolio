// fade-in on scroll
const revealItems = (items) => {
  if (!items?.length) return;

  gsap.killTweensOf(items);
  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 17 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    },
  );
};

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  document
    .querySelectorAll("#books-grid .masonry-item.process-item")
    .forEach((item) => {
      const star = document.createElement("img");
      star.className = "process-item-star";
      star.src = "assets/Star.png";
      star.alt = "";
      star.setAttribute("aria-hidden", "true");
      item.prepend(star);
    });

  ScrollTrigger.batch(".masonry-item", {
    once: true,
    onEnter: (batch) => revealItems(batch),
  });

  ScrollTrigger.batch(".project-card", {
    once: true,
    onEnter: (batch) => revealItems(batch),
  });

  if (sessionStorage.getItem("scrollToWork")) {
    sessionStorage.removeItem("scrollToWork");

    window.addEventListener("load", () => {
      requestAnimationFrame(() => {
        document.getElementById("work")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }
});

// nav menu toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

function openProcessPage(item) {
  const page = item.dataset.processPage || "process.html";
  window.location.href = page;
}

document.addEventListener("click", (event) => {
  const processItem = event.target.closest(".masonry-item.process-item");

  if (processItem) {
    openProcessPage(processItem);
  }
});

document.addEventListener("keydown", (event) => {
  const processItem = event.target.closest(".masonry-item.process-item");

  if (processItem && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openProcessPage(processItem);
  }
});

function openLightbox(src, alt, caption = "") {
  if (!lightbox || !lightboxImage) return;

  lightboxImage.src = src;
  lightboxImage.alt = alt;
  if (lightboxCaption) {
    lightboxCaption.textContent = caption;
  }
  lightbox.classList.add("active");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
}

document.addEventListener("click", (event) => {
  const clickedImage = event.target.closest(
    ".masonry-item img, .project-image img",
  );

  if (clickedImage && !clickedImage.closest(".process-item")) {
    event.preventDefault();
    openLightbox(
      clickedImage.currentSrc || clickedImage.src,
      clickedImage.alt,
      clickedImage.dataset.caption || "",
    );
  }
});

document
  .querySelectorAll(
    ".personal-concepts-grid img[data-hover-src]:not([data-hover-disabled])",
  )
  .forEach((image) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const defaultSrc = image.getAttribute("src");
    const defaultAlt = image.alt;
    const hoverSrc = image.dataset.hoverSrc;
    const hoverAlt = image.dataset.hoverAlt || defaultAlt;
    const preload = new Image();
    const item = image.closest(".masonry-item");
    let swapTimeout;

    preload.src = hoverSrc;
    item.style.backgroundImage = `url("${hoverSrc}")`;

    image.addEventListener("mouseenter", () => {
      clearTimeout(swapTimeout);
      image.style.objectPosition = "50% center";
      item.style.backgroundPosition = "50% center";
      item.classList.add("is-swapping");
      swapTimeout = setTimeout(() => {
        image.src = hoverSrc;
        image.alt = hoverAlt;
        item.classList.remove("is-swapping");
      }, 200);
    });

    image.addEventListener("mousemove", (event) => {
      const bounds = item.getBoundingClientRect();
      const edgeInset = 0.2;
      const pointerRatio = (event.clientX - bounds.left) / bounds.width;
      const position = Math.min(
        100,
        Math.max(0, ((pointerRatio - edgeInset) / (1 - edgeInset * 2)) * 100),
      );

      const objectPosition = `${position}% center`;
      image.style.objectPosition = objectPosition;
      item.style.backgroundPosition = objectPosition;
    });

    image.addEventListener("mouseleave", () => {
      clearTimeout(swapTimeout);
      image.style.objectPosition = "50% center";
      item.style.backgroundPosition = "50% center";
      item.classList.add("is-swapping");
      swapTimeout = setTimeout(() => {
        image.src = defaultSrc;
        image.alt = defaultAlt;
        item.classList.remove("is-swapping");
      }, 200);
    });
  });

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const categories = document.querySelectorAll(".category");
const categoryGrids = {
  Books: document.getElementById("books-grid"),
  Illustration: document.getElementById("illustration-grid"),
  Design: document.getElementById("design-grid"),
};

categories.forEach((category) => {
  category.addEventListener("click", () => {
    const selectedCategory = category.textContent.trim();

    categories.forEach((item) => item.classList.remove("active"));
    category.classList.add("active");

    Object.entries(categoryGrids).forEach(([name, grid]) => {
      if (grid) {
        grid.hidden = name !== selectedCategory;

        if (name === selectedCategory) {
          const items = Array.from(
            grid.querySelectorAll(".masonry-item, .project-card"),
          );

          requestAnimationFrame(() => revealItems(items));
          ScrollTrigger.refresh();
        }
      }
    });
  });
});

// hide/show navbar when scrolling up/down
const header = document.querySelector("header");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (window.scrollY < 150) {
    header.classList.remove("header-hidden");
    return;
  }

  if (lastScrollY < window.scrollY) {
    header.classList.add("header-hidden");
  } else {
    header.classList.remove("header-hidden");
  }

  lastScrollY = window.scrollY;
});

document.querySelectorAll(".project-card").forEach((card) => {
  const slider = card.querySelector(".project-slider");

  if (!slider) return;

  const slides = slider.children;

  let index = 0;
  let interval;

  card.addEventListener("mouseenter", () => {
    interval = setInterval(() => {
      index = (index + 1) % slides.length;

      slider.style.transform = `translateX(-${index * 100}%)`;
    }, 1200);
  });

  card.addEventListener("mouseleave", () => {
    clearInterval(interval);

    index = 0;

    slider.style.transform = "translateX(0)";
  });
});

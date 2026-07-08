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

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");

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

  if (clickedImage) {
    event.preventDefault();
    openLightbox(
      clickedImage.currentSrc || clickedImage.src,
      clickedImage.alt,
      clickedImage.dataset.caption || "",
    );
  }
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
      }
    });
  });
});

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

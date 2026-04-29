// ================= LOAD COMPONENTS =================
async function loadComponent(id, file) {
  const res = await fetch(file);
  const data = await res.text();
  document.getElementById(id).innerHTML = data;
}

// Load Navbar + attach events AFTER load
loadComponent("navbar", "/components/navbar.html").then(() => {

  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    link.addEventListener("click", function () {
      links.forEach(l => l.classList.remove("active"));
      this.classList.add("active");

      // Auto-close navbar on mobile after clicking a link (but NOT for dropdown toggles)
      if (window.innerWidth < 991 && !this.classList.contains('dropdown-toggle')) {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navMenu) || new bootstrap.Collapse(navMenu);
          bsCollapse.hide();
        }
      }
    });
  });

  // MOBILE DROPDOWN + MEGA MENU FIX
  document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', function (e) {
      if (window.innerWidth < 991) {
        e.preventDefault();
        let parent = this.parentElement;
        // Close others
        document.querySelectorAll('.nav-item.dropdown').forEach(el => {
          if (el !== parent) {
            el.classList.remove('show');
          }
        });
        // Toggle current
        parent.classList.toggle('show');
      }
    });
  });

});

// Load Footer
loadComponent("footer", "/components/footer.html");

// ================= BOOKING MODAL LOGIC =================
// 1. Inject Placeholder for Modal
const modalContainer = document.createElement("div");
modalContainer.id = "booking-modal-holder";
document.body.appendChild(modalContainer);

// 2. Load Modal CSS Dynamically
const modalStyles = document.createElement("link");
modalStyles.rel = "stylesheet";
modalStyles.href = "/css/booking-modal.css";
document.head.appendChild(modalStyles);

// 3. Load Modal HTML
loadComponent("booking-modal-holder", "/components/booking-modal.html").then(() => {
  const modalOverlay = document.getElementById("bookingModalOverlay");
  const closeBtn = document.getElementById("closeBookingModal");

  if (modalOverlay && closeBtn) {
    // Open Modal Function
    window.openBookingModal = function () {
      modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scroll
    };

    // Close Modal Function
    window.closeBookingModal = function () {
      modalOverlay.classList.remove("active");
      document.body.style.overflow = "auto";
    };

    closeBtn.addEventListener("click", closeBookingModal);

    // Close on click outside
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeBookingModal();
    });
  }
});

// 4. Attach Global Click Listener for Booking Triggers
document.addEventListener("click", (e) => {
  if (e.target.closest(".booking-trigger")) {
    e.preventDefault();
    if (window.openBookingModal) {
      window.openBookingModal();
    }
  }
});

// MOBILE DROPDOWN + MEGA MENU FIX - MOVED INSIDE loadComponent.then

// SCROLL ANIMATION
const elements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.2
});

elements.forEach(el => observer.observe(el));

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".custom-navbar");
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 100);
  }
});


// ================= CITY ANIMATION =================
const cityCards = document.querySelectorAll('.city-card');

const cityObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

cityCards.forEach(card => cityObserver.observe(card));

// Scroll reveal remains active via the .animate classes in HTML

// reviews
if (typeof Swiper !== 'undefined' && document.querySelector(".reviewSwiper")) {
  const reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 4000,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    }
  });
}

// gallery
const allImages = document.querySelectorAll('.gallery-item img');
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImg');
const openBtn = document.getElementById('openGallery');

if (modal && modalImg) {
  let currentIndex = 0;
  let activeImages = allImages;

  function openModal(images, index) {
    activeImages = images;
    currentIndex = index;
    modal.style.display = 'flex';
    modalImg.src = activeImages[currentIndex].src;
  }

  function showImage(index) {
    currentIndex = (index + activeImages.length) % activeImages.length;
    modalImg.src = activeImages[currentIndex].src;
  }

  // OPEN FROM GRID (click on image or overlay)
  allImages.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => {
      openModal(allImages, index);
    });
  });

  // VIEW MORE → OPEN FULL GALLERY
  if (openBtn) {
    openBtn.onclick = () => {
      openModal(allImages, 0);
    };
  }

  // CLOSE
  const closeBtn = modal.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.onclick = () => { modal.style.display = 'none'; };
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // NEXT
  const nextBtn = modal.querySelector('.next');
  if (nextBtn) {
    nextBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex + 1); };
  }

  // PREV
  const prevBtn = modal.querySelector('.prev');
  if (prevBtn) {
    prevBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex - 1); };
  }

  // KEYBOARD NAVIGATION
  document.addEventListener('keydown', (e) => {
    if (modal.style.display !== 'flex') return;
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1);
    if (e.key === 'Escape')     modal.style.display = 'none';
  });
}

// ================= PREMIUM FAQ ACCORDION =================
document.addEventListener("click", (e) => {
  const question = e.target.closest(".faq-question");
  if (!question) return;

  const item = question.parentElement;
  const isActive = item.classList.contains("active");

  // Close all other FAQ items on the page
  document.querySelectorAll(".faq-item").forEach((el) => {
    if (el !== item) el.classList.remove("active");
  });

  // Toggle active class on current item
  item.classList.toggle("active");
});


const scrollTopBtn = document.getElementById("scrollTopBtn");

// SHOW BUTTON ON SCROLL
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

// SCROLL TO TOP
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
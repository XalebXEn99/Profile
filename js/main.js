// ===== Theme System =====
let chartInstance = null;

function getTimeTheme() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

function applyTheme() {
  const saved = localStorage.getItem('theme-mode') || 'auto';
  const theme = saved === 'auto' ? getTimeTheme() : saved;
  document.documentElement.setAttribute('data-theme', theme);
  updateThemeMenu(saved);
  updateChartColors();
}

function setTheme(mode) {
  localStorage.setItem('theme-mode', mode);
  applyTheme();
  closeThemeMenu();
}

function toggleThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.classList.toggle('open');
}

function closeThemeMenu() {
  const menu = document.getElementById('theme-menu');
  if (menu) menu.classList.remove('open');
}

function updateThemeMenu(activeMode) {
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === activeMode);
  });
}

// Close theme menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.theme-toggle')) {
    closeThemeMenu();
  }
});

applyTheme();
setInterval(applyTheme, 60000);

// ===== Smooth Scroll =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// ===== Scroll Animations =====
function revealOnScroll() {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// ===== Contact Form Toggle (Genie Animation) =====
function toggleContactForm() {
  const formWrapper = document.getElementById('contact-form-wrapper');
  const btn = document.getElementById('contact-btn');
  if (formWrapper) {
    const isOpen = formWrapper.classList.contains('open');
    if (isOpen) {
      formWrapper.classList.remove('open');
      setTimeout(() => { if (btn) btn.style.display = 'inline-block'; }, 350);
    } else {
      if (btn) btn.style.display = 'none';
      formWrapper.classList.add('open');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          const y = contactSection.getBoundingClientRect().top + window.scrollY + contactSection.offsetHeight - window.innerHeight + 60;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 500);
    }
  }
}

function closeContactForm() {
  const formWrapper = document.getElementById('contact-form-wrapper');
  const btn = document.getElementById('contact-btn');
  if (formWrapper) {
    formWrapper.classList.remove('open');
    setTimeout(() => { if (btn) btn.style.display = 'inline-block'; }, 350);
  }
}

// ===== Contact Form AJAX Submit =====
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        submitBtn.textContent = 'Sent!';
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          closeContactForm();
        }, 1500);
      } else {
        submitBtn.textContent = 'Error';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    } catch (err) {
      submitBtn.textContent = 'Error';
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }
  });
}

// ===== Projects Carousel =====
const projects = [
  {
    title: 'Xencode Internship',
    description: '*Very minor contributions during my internship at Xencode.',
    iframe: 'https://www.xencode.co.za/home',
    type: 'iframe'
  },
  {
    title: 'Municipal Reporting Portal',
    description: 'One of three major group projects in 2026. A web-based platform for municipal service reporting.',
    iframe: 'https://municipal-reporting-portal-aja5cscdapgregar.brazilsouth-01.azurewebsites.net/',
    github: 'https://github.com/sudoers1/municipal-reporting-portal',
    type: 'iframe'
  },
  {
    title: 'Pathfinding Snake Game (2024 Competition)',
    description: 'My personal implementation for the 2024 Wits Snake Competition.',
    media: 'assets/snake.mp4',
    link: 'https://snake.wits.ai/',
    linkLabel: 'Competition Website',
    github: 'https://github.com/XalebXEn99/MY-SNAKE-BOY',
    type: 'video'
  },
  {
    title: 'Godot Games',
    description: 'Actively developing 2D games in Godot.',
    type: 'godot',
    listLinks: [
      { label: 'Xenzen2D (Top-down game)', url: 'https://github.com/xenzenok/xenzen2D', mp4: 'assets/xenzen2d.mp4' },
      { label: 'Xenzen SideScroller', url: 'https://github.com/xenzenok/xenzensidescroller', gif: 'assets/Spectrum.gif' }
    ]
  },
  {
    title: 'Turing Machine Simulator',
    description: 'One of three major group projects in 2026. A Turing machine simulator for formal languages and automata theory. Currently hosted privately on the Wits Gitea server.',
    iframe: 'https://fla-three.vercel.app/',
    type: 'iframe'
  },
  {
    title: '404',
    description: "NOT FOUND\n\nThe resource you are looking for is already being viewed.\n\nError code: PROFILE_ALREADY_OPEN\n\nYou're already here silly ^-^",
    type: 'profile'
  }
];

let currentSlide = 0;
let autoplayTimer;

function buildCarousel() {
  const track = document.getElementById('carousel-track');
  const dotsContainer = document.getElementById('carousel-dots');
  if (!track || !dotsContainer) return;

  track.innerHTML = '';
  dotsContainer.innerHTML = '';

  projects.forEach((project, idx) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';

    if (project.type === 'iframe') {
      slide.innerHTML = `
        <iframe src="${project.iframe}" title="${project.title} Preview" style="scrollbar-width:none;"></iframe>
        <h2 class="slide-title">${project.title}</h2>
        ${project.description ? `<p class="slide-desc">${project.description}</p>` : ''}
        ${project.github ? `<div class="slide-links"><a href="${project.github}" target="_blank" rel="noopener noreferrer" class="slide-link">View on GitHub</a></div>` : ''}
      `;
    } else if (project.type === 'video') {
      slide.innerHTML = `
        <video src="${project.media}" autoplay loop muted playsinline></video>
        <h2 class="slide-title">${project.title}</h2>
        ${project.description ? `<p class="slide-desc">${project.description}</p>` : ''}
        <div class="slide-links">
          ${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer" class="slide-link">${project.linkLabel || 'View on GitHub'}</a>` : ''}
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="slide-link">View on GitHub</a>` : ''}
        </div>
      `;
    } else if (project.type === 'godot') {
      let gridHTML = '<div class="godot-grid">';
      project.listLinks.forEach(item => {
        gridHTML += `
          <div class="godot-item" onclick="window.open('${item.url}', '_blank')">
            <p>${item.label}</p>
            ${item.gif ? `<img src="${item.gif}" alt="${item.label}">` : ''}
            ${item.mp4 ? `<video src="${item.mp4}" autoplay loop muted playsinline></video>` : ''}
            <span class="godot-hint">Click to view on GitHub</span>
          </div>
        `;
      });
      gridHTML += '</div>';
      slide.innerHTML = `
        <h2 class="slide-title">${project.title}</h2>
        ${project.description ? `<p class="slide-desc">${project.description}</p>` : ''}
        ${gridHTML}
      `;
    } else if (project.type === 'profile') {
      slide.innerHTML = `
        <div class="slide-error-box">
          <h2 class="slide-error-title">${project.title}</h2>
          <p class="slide-error-text">${project.description.replace(/\n/g, '<br>')}</p>
        </div>
      `;
    }

    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  goToSlide(0);
  startAutoplay();
}

function goToSlide(index) {
  const track = document.getElementById('carousel-track');
  if (!track) return;
  currentSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;

  document.querySelectorAll('#carousel-dots .carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  goToSlide((currentSlide + 1) % projects.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + projects.length) % projects.length);
}

function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(nextSlide, 6000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
}

// ===== About Carousel (manual only, no autoplay) =====
let currentAboutSlide = 0;
const aboutSlideCount = 2;

function initAboutCarousel() {
  const dotsContainer = document.getElementById('about-dots');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < aboutSlideCount; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goToAboutSlide(i));
    dotsContainer.appendChild(dot);
  }
  goToAboutSlide(0);
}

function goToAboutSlide(index) {
  const track = document.getElementById('about-track');
  if (!track) return;
  currentAboutSlide = index;
  track.style.transform = `translateX(-${index * 100}%)`;
  document.querySelectorAll('#about-dots .carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextAboutSlide() {
  goToAboutSlide((currentAboutSlide + 1) % aboutSlideCount);
}

function prevAboutSlide() {
  goToAboutSlide((currentAboutSlide - 1 + aboutSlideCount) % aboutSlideCount);
}

// ===== Progress Chart =====
function buildChart() {
  const ctx = document.getElementById('progress-chart');
  if (!ctx) return;

  const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color').trim();
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();

  const data = {
    labels: [2017, 2021, 2022, 2023, 2024, 2025, 2026],
    datasets: [{
      label: 'Progress',
      data: [20, 35, 40, 50, 55, 60, 65],
      borderColor: lineColor,
      backgroundColor: lineColor + '33',
      borderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 9,
      pointBackgroundColor: lineColor,
      fill: true,
      tension: 0.3
    }]
  };

  const milestones = [
    'Top Achiever',
    'Runner-Up Dux Scholar',
    'Started BSc Computer Science',
    'Xencode Internship',
    'Began Personal Development Projects',
    'Tutor Doctor Employment',
    '3 Major Group Projects + Game Development'
  ];

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: function(context) {
              return milestones[context.dataIndex];
            }
          },
          backgroundColor: 'rgba(255,255,255,0.95)',
          titleColor: '#000',
          bodyColor: '#333',
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 12,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: textColor, font: { family: "'Press Start 2P'", size: 8 } }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { color: textColor, font: { family: "'Press Start 2P'", size: 8 } },
          beginAtZero: true,
          max: 100
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  };

  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, config);
}

function updateChartColors() {
  if (!chartInstance) return;
  const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--line-color').trim();
  const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();

  chartInstance.data.datasets[0].borderColor = lineColor;
  chartInstance.data.datasets[0].backgroundColor = lineColor + '33';
  chartInstance.data.datasets[0].pointBackgroundColor = lineColor;
  chartInstance.options.scales.x.ticks.color = textColor;
  chartInstance.options.scales.y.ticks.color = textColor;
  chartInstance.update();
}

// ===== Touch Swipe Support =====
function addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
  let startX = 0;
  let startY = 0;
  const threshold = 50;

  element.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  element.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  }, { passive: true });
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initAboutCarousel();
  buildCarousel();
  buildChart();
  initContactForm();

  // Add swipe to carousels
  const aboutWrapper = document.querySelector('.about-carousel');
  if (aboutWrapper) {
    addSwipeSupport(aboutWrapper, nextAboutSlide, prevAboutSlide);
  }

  const projectsWrapper = document.querySelector('#projects .carousel-wrapper');
  if (projectsWrapper) {
    addSwipeSupport(projectsWrapper, nextSlide, prevSlide);
  }
});

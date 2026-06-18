/**
 * PREMIUM DIGITAL ANNIVERSARY SITE ARCHITECTURE
 * Core Modular Controller Architecture
 */

const CONFIG = {
  relationshipStartDate: "2024-07-01", // Production start parameter
  photoPath: "assets/images/memories/",
  chatPath: "assets/images/chats/",
  fallbackPhoto: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23f4e7c5' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' fill='%238a8a8a'%3EMemory Photo Frame%3C/text%3E%3C/svg%3E",
  fallbackChat: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'%3E%3Crect width='100%25' height='100%25' fill='%23bfdfff' opacity='0.3'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' fill='%238a8a8a'%3EChat Screenshot Frame%3C/text%3E%3C/svg%3E"
};

// Global Game State Engine
let currentGameScore = 0;
let currentQuestionIndex = 0;
const totalGameQuestions = 5;
let generatedQuestions = [];

document.addEventListener("DOMContentLoaded", () => {
  initAmbientBackground();
  runSimulatedLoading();
  initCountdownAndClocks();
  setupEventListeners();
});

/* Ambient Canvas System */
function initAmbientBackground() {
  const canvas = document.getElementById("ambientCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let particles = [];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Create subtle floating glowing blurred circle orbs
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 30 + 20,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.15 + 0.05
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -p.radius) p.x = canvas.width + p.radius;
      if (p.x > canvas.width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = canvas.height + p.radius;
      if (p.y > canvas.height + p.radius) p.y = -p.radius;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(248, 180, 200, ${p.alpha})`;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(248, 180, 200, 0.2)";
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

/* Loading Automation Engine */
function runSimulatedLoading() {
  const progressBar = document.querySelector('[data-element="loading-bar"]');
  const quoteEl = document.querySelector('[data-element="loading-quote"]');
  const loaderSection = document.querySelector('[data-section="loading"]');
  const heroSection = document.querySelector('[data-section="hero"]');
  
  if (typeof ROMANTIC_QUOTES !== 'undefined' && ROMANTIC_QUOTES.length > 0) {
    quoteEl.textContent = ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)];
  }

  let width = 0;
  const interval = setInterval(() => {
    width += Math.floor(Math.random() * 12) + 5;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        loaderSection.style.opacity = "0";
        setTimeout(() => {
          loaderSection.classList.add("hidden");
          heroSection.classList.remove("hidden");
          initTypedSubtitle();
          if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true });
        }, 1200);
      }, 400);
    }
    if (progressBar) progressBar.style.width = width + "%";
  }, 100);
}

/* Hero Typing Presentation */
function initTypedSubtitle() {
  if (typeof Typed !== 'undefined') {
    new Typed('#typedSubtitle', {
      strings: [
        "Hampir dua tahun mengukir tawa bersama...",
        "Setiap detiknya bersamamu berharga.",
        "Ini adalah ruang memori khusus kita berdua."
      ],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true,
      backDelay: 2000
    });
  }
}

/* Time & Milestone Mathematical Counter Engine */
function initCountdownAndClocks() {
  const liveClock = document.querySelector('[data-element="live-clock"]');
  
  function updateClocks() {
    const now = new Date();
    if (liveClock) liveClock.textContent = now.toLocaleTimeString('id-ID');

    const startDate = new Date(CONFIG.relationshipStartDate);
    const diffTime = Math.abs(now - startDate);
    
    const totalSeconds = Math.floor(diffTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const remHours = totalHours % 24;
    const remMinutes = totalMinutes % 60;
    const remSeconds = totalSeconds % 60;

    const dEl = document.querySelector('[data-countdown="days"]');
    const hEl = document.querySelector('[data-countdown="hours"]');
    const mEl = document.querySelector('[data-countdown="minutes"]');
    const sEl = document.querySelector('[data-countdown="seconds"]');

    if (dEl) dEl.textContent = String(days).padStart(2, '0');
    if (hEl) hEl.textContent = String(remHours).padStart(2, '0');
    if (mEl) mEl.textContent = String(remMinutes).padStart(2, '0');
    if (sEl) sEl.textContent = String(remSeconds).padStart(2, '0');
  }
  
  setInterval(updateClocks, 1000);
  updateClocks();
}

/* Core Interface Listeners */
function setupEventListeners() {
  document.querySelector('[data-action="start-journey"]')?.addEventListener("click", () => {
    document.querySelector('[data-section="hero"]').classList.add("hidden");
    document.querySelector('[data-section="game"]').classList.remove("hidden");
    generateGameQuiz();
  });

  // Modal Closure Triggers
  document.querySelector('[data-action="close-modal"]')?.addEventListener("click", closeModal);
  document.querySelector('[data-element="modal"]')?.addEventListener("click", (e) => {
    if (e.target.matches('[data-element="modal"]')) closeModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Interactive Letter Envelope Mechanism
  document.querySelector('[data-action="open-envelope"]')?.addEventListener("click", function() {
    this.classList.toggle("open");
    if (this.classList.contains("open")) {
      triggerEnvelopeLetterText();
    }
  });

  // Gift Interaction Card Mechanism
  document.querySelector('[data-action="unwrap-gift"]')?.addEventListener("click", function() {
    const container = document.querySelector('[data-element="gift-box-container"]');
    container.classList.add("unwrapped");
    document.querySelector('[data-element="gift-card-reveal"]').classList.remove("hidden");
    if (typeof confetti !== 'undefined') confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  });

  // Final Emotional Trigger Mechanism
  document.querySelector('[data-action="make-wish"]')?.addEventListener("click", () => {
    triggerMeteorShowerEffect();
    document.querySelector('[data-element="wish-overlay"]').classList.remove("hidden");
    fadeAudioOutAndEnd();
  });

  // Music Engine Playback Sync
  document.querySelector('[data-action="toggle-play"]')?.addEventListener("click", toggleAudioPlayback);
}

/* Mathematics Dynamic Challenge Logic */
function generateGameQuiz() {
  generatedQuestions = [
    { q: "Jika tanggal jadian kita dijumlahkan, 1 + 7?", a: ["6", "8", "9", "10"], c: 1 },
    { q: "Berapa banyak ruang di hatiku untuk orang lain selain kamu?", a: ["100", "50", "0", "10"], c: 2 },
    { q: "12 + 12 = ?", a: ["22", "24", "26", "28"], c: 1 },
    { q: "Hampir berapa tahunkah perjalanan asmara premium kita?", a: ["1 Tahun", "2 Kerja", "2 Tahu", "2 Kapal"], c: 2 },
    { q: "Sempurnakan rumus ini: Kamu + Aku = ...", a: ["Biasa saja", "Bahagia Selamanya", "Rumit", "Teman"], c: 1 }
  ];
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  if (currentQuestionIndex >= totalGameQuestions) {
    completeGameUnlock();
    return;
  }
  
  const progFill = document.querySelector('[data-element="game-progress"]');
  if (progFill) progFill.style.width = ((currentQuestionIndex + 1) / totalGameQuestions * 100) + "%";

  const numEl = document.querySelector('[data-element="game-num"]');
  const qEl = document.querySelector('[data-element="game-question"]');
  const data = generatedQuestions[currentQuestionIndex];

  if (numEl) numEl.textContent = `Tantangan ${currentQuestionIndex + 1} / ${totalGameQuestions}`;
  if (qEl) qEl.textContent = data.q;

  const buttons = document.querySelectorAll(".btn-answer");
  buttons.forEach((btn, idx) => {
    btn.textContent = data.a[idx];
    btn.className = "btn-answer"; // reset color structures safely
    btn.onclick = () => handleGameAnswerSelection(idx, btn);
  });
}

function handleGameAnswerSelection(selectedIdx, buttonEl) {
  const currentCorrect = generatedQuestions[currentQuestionIndex].c;
  if (selectedIdx === currentCorrect) {
    buttonEl.style.backgroundColor = "#BFDFFF"; // Elegant validation styling
    if (typeof confetti !== 'undefined') confetti({ particleCount: 30, spread: 40 });
    setTimeout(() => {
      currentQuestionIndex++;
      renderCurrentQuestion();
    }, 600);
  } else {
    buttonEl.style.backgroundColor = "#FFD6E7";
    buttonEl.classList.add("shake-animation");
    setTimeout(() => buttonEl.classList.remove("shake-animation"), 500);
  }
}

function completeGameUnlock() {
  document.querySelector('[data-section="game"]').classList.add("hidden");
  document.querySelector('[data-container="story"]').classList.remove("hidden");
  document.querySelector('[data-element="audio-player-widget"]').classList.remove("hidden");
  
  // Safe execution sequence activation
  startAudioPlaybackEngine();
  populatePhotoDynamicGrid();
  populateTimelineDynamicContent();
  populateChatDynamicSwiper();
  initFinalSkyBackgroundCanvas();
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* Dynamic Render Architecture for Polaroid Layout */
function populatePhotoDynamicGrid() {
  const grid = document.querySelector('[data-element="photo-grid"]');
  if (!grid) return;

  const photoCaptions = [
    "Awal Cerita Manis", "Tawa Lepas Bersamamu", "Kencan Sore Itu", 
    "Sinar Matamu", "Langkah Bersama", "Momen Terfavorit", 
    "Pelukan Hangat Dunia", "Menatap Masa Depan"
  ];

  for (let i = 1; i <= 8; i++) {
    const frame = document.createElement("div");
    frame.className = "polaroid-frame";
    frame.setAttribute("data-aos", "fade-up");
    
    // Custom dynamic slow rotations to look authentic
    const randomRotate = (Math.random() * 4 - 2).toFixed(2);
    frame.style.transform = `rotate(${randomRotate}deg)`;

    frame.innerHTML = `
      <div class="polaroid-tape"></div>
      <div class="polaroid-image-container">
        <img src="${CONFIG.photoPath}photo${i}.jpg" alt="Memory ${i}" onerror="this.src='${CONFIG.fallbackPhoto}'" loading="lazy">
      </div>
      <div class="polaroid-caption">${photoCaptions[i-1]}</div>
    `;

    frame.addEventListener("click", () => {
      openLightboxModal(`${CONFIG.photoPath}photo${i}.jpg`, CONFIG.fallbackPhoto);
    });

    grid.appendChild(frame);
  }
}

/* Dynamic Letter Typewriter Automation */
function triggerEnvelopeLetterText() {
  const container = document.querySelector('[data-element="letter-text"]');
  if (!container || container.innerHTML.trim() !== "") return;

  const letterParagraphs = "Sayangku,\n\nHampir dua tahun telah berlalu sejak kita memilih untuk menyatukan langkah. Melewati setiap hari bersamamu adalah berkah terbaik yang pernah ada di hidupku. Terima kasih telah bersabar, menjadi pendengar setenang malam, dan menjadi alasan utama di balik senyumku.\n\nSitus ini adalah rangkuman kecil dari dekap memori kita yang abadi. Aku mencintaimu, hari ini, esok, dan selamanya.";
  
  let idx = 0;
  function type() {
    if (idx < letterParagraphs.length) {
      container.innerHTML += letterParagraphs.charAt(idx);
      idx++;
      setTimeout(type, 35);
    }
  }
  type();
}

/* Dynamic Timeline Injection Layer */
function populateTimelineDynamicContent() {
  const container = document.querySelector('[data-element="timeline-container"]');
  if (!container) return;

  const milestones = [
    { date: "Juli 2024", title: "Percakapan Pertama", desc: "Awal getaran rasa yang tak disangka melangkah sejauh ini." },
    { date: "Oktober 2024", title: "Panggilan Suara Pertama", desc: "Mendengar suaramu melunturkan segala kecanggungan di antara kita." },
    { date: "Desember 2024", title: "Foto Bersama Pertama", desc: "Potret fisik pertama saksi bisu dua hati mulai bertaut utuh." },
    { date: "Agustus 2025", title: "Momen Terfavorit Kita", desc: "Kencan sederhana penuh tawa yang ingin selalu kuulang kembali." },
    { date: "Kini & Esok", title: "Hampir Dua Tahun Kebersamaan", desc: "Menjaga komitmen premium penuh kasih sayang menyambut masa depan." }
  ];

  milestones.forEach((m, idx) => {
    const side = idx % 2 === 0 ? "left" : "right";
    const item = document.createElement("div");
    item.className = `timeline-item ${side}`;
    item.setAttribute("data-aos", side === "left" ? "fade-right" : "fade-left");

    item.innerHTML = `
      <div class="timeline-card">
        <span class="timeline-date">${m.date}</span>
        <h3 class="timeline-title">${m.title}</h3>
        <p class="timeline-desc">${m.desc}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

/* Chat Component Initialization */
function populateChatDynamicSwiper() {
  const wrapper = document.querySelector('[data-element="chat-wrapper"]');
  if (!wrapper) return;

  for (let i = 1; i <= 4; i++) {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="chat-slide-card">
        <div class="chat-img-container">
          <img src="${CONFIG.chatPath}chat${i}.jpg" alt="Chat Screenshot ${i}" onerror="this.src='${CONFIG.fallbackChat}'" loading="lazy">
        </div>
      </div>
    `;
    
    slide.querySelector('.chat-img-container').addEventListener("click", () => {
      openLightboxModal(`${CONFIG.chatPath}chat${i}.jpg`, CONFIG.fallbackChat);
    });

    wrapper.appendChild(slide);
  }

  if (typeof Swiper !== 'undefined') {
    new Swiper('.chatSwiper', {
      effect: 'cards',
      grabCursor: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
  }
}

/* Final Celestial Presentation Canvas */
function initFinalSkyBackgroundCanvas() {
  const canvas = document.getElementById("skyCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();

  for (let i = 0; i < 60; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      twinkle: Math.random() * 0.02
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    stars.forEach(s => {
      s.r += s.twinkle;
      if (s.r > 2 || s.r < 0.5) s.twinkle = -s.twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.abs(s.r), 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function triggerMeteorShowerEffect() {
  if (typeof confetti !== 'undefined') {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.4 } });
  }
}

/* Lightbox Premium Modal Interactivity */
function openLightboxModal(imgSrc, fallbackSrc) {
  const modal = document.querySelector('[data-element="modal"]');
  const modalImg = document.querySelector('[data-element="modal-img"]');
  const modalQuote = document.querySelector('[data-element="modal-quote"]');

  if (!modal || !modalImg) return;

  modalImg.src = imgSrc;
  modalImg.onerror = () => { modalImg.src = fallbackSrc; };

  if (typeof ROMANTIC_QUOTES !== 'undefined' && ROMANTIC_QUOTES.length > 0) {
    modalQuote.textContent = ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)];
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.querySelector('[data-element="modal"]');
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/* Audio Player Playback Control Loop Engine */
const audioEl = document.getElementById("mainAppAudio");

function startAudioPlaybackEngine() {
  if (!audioEl) return;
  audioEl.play().then(() => {
    updateAudioWidgetState(true);
  }).catch(() => {
    updateAudioWidgetState(false);
  });

  audioEl.addEventListener("timeupdate", () => {
    const fill = document.querySelector('[data-element="player-progress-fill"]');
    if (fill && audioEl.duration) {
      fill.style.width = (audioEl.currentTime / audioEl.duration * 100) + "%";
    }
  });
}

function toggleAudioPlayback() {
  if (!audioEl) return;
  if (audioEl.paused) {
    audioEl.play();
    updateAudioWidgetState(true);
  } else {
    audioEl.pause();
    updateAudioWidgetState(false);
  }
}

function updateAudioWidgetState(isPlaying) {
  const disk = document.querySelector('[data-element="vinyl-disk"]');
  const icon = document.querySelector('[data-element="play-icon"]');
  
  if (isPlaying) {
    disk?.classList.add("playing");
    icon?.setAttribute("data-lucide", "pause");
  } else {
    disk?.classList.remove("playing");
    icon?.setAttribute("data-lucide", "play");
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function fadeAudioOutAndEnd() {
  if (!audioEl) return;
  let volume = audioEl.volume;
  const fadeInterval = setInterval(() => {
    if (volume > 0.05) {
      volume -= 0.05;
      audioEl.volume = volume;
    } else {
      audioEl.pause();
      clearInterval(fadeInterval);
    }
  }, 150);
}
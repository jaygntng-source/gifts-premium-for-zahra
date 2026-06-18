document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup & Animation Libraries
    AOS.init({ once: true, offset: 50 });

    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-pause-btn');
    const vinyl = document.getElementById('vinyl-disc');
    const musicPlayer = document.getElementById('music-player');

    // 2. Loading Screen Logic
    let progress = 0;
    const progressEl = document.getElementById('loading-progress');
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    const loadInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if(progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    mainContent.style.display = 'block';
                    gsap.to(mainContent, {opacity: 1, duration: 1.5});
                }, 1200);
            }, 500);
        }
        progressEl.style.width = `${progress}%`;
    }, 200);

    // 3. Audio & Music Player
    let isPlaying = false;
    const toggleMusic = () => {
        if(isPlaying) {
            audio.pause();
            vinyl.classList.remove('spin');
            playBtn.innerHTML = '<i class="ph ph-play-circle text-2xl"></i>';
        } else {
            audio.play().catch(e => console.log("Audio play blocked", e));
            vinyl.classList.add('spin');
            playBtn.innerHTML = '<i class="ph ph-pause-circle text-2xl"></i>';
        }
        isPlaying = !isPlaying;
    };
    playBtn.addEventListener('click', toggleMusic);

    // 4. Hero & Start Button
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', () => {
        if(!isPlaying) toggleMusic();
        musicPlayer.classList.add('show');
        document.getElementById('hero').classList.add('hidden');
        const gameSec = document.getElementById('game');
        gameSec.classList.remove('hidden');
        gsap.from(gameSec, {opacity: 0, y: 50, duration: 1});
    });

    // 5. Countdown Realtime (Targeting 2 Years)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    
    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        document.getElementById('c-days').innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
        document.getElementById('c-hours').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
        document.getElementById('c-mins').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        document.getElementById('c-secs').innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
    }, 1000);

    // 6. Math Game Logic (Unlock Memories)
    const questions = [
        { q: "Berapa 10 + 14?", a: "24" },
        { q: "Jika cinta diukur dari 50 dikali 2, berapa nilainya?", a: "100" },
        { q: "Berapa hasil dari 300 dibagi 3?", a: "100" },
        { q: "Selesaikan ini: 75 - 25 = ?", a: "50" },
        { q: "Kamu + Aku = ?", a: "2" }
    ];
    let currentQ = 0;
    
    const progressContainer = document.getElementById('game-progress');
    questions.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `dot ${i===0?'active':''}`;
        dot.id = `dot-${i}`;
        progressContainer.appendChild(dot);
    });

    const qText = document.getElementById('math-question');
    const qInput = document.getElementById('math-answer');
    const submitBtn = document.getElementById('submit-answer');

    qText.innerText = questions[0].q;

    submitBtn.addEventListener('click', () => {
        if(qInput.value === questions[currentQ].a || (currentQ === 4 && qInput.value !== "")) {
            // Correct
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, colors: ['#FFD6E7', '#F8B4C8'] });
            currentQ++;
            qInput.value = "";
            if(currentQ < questions.length) {
                document.getElementById(`dot-${currentQ}`).classList.add('active');
                qText.innerText = questions[currentQ].q;
            } else {
                // Game Completed, unlock rest
                document.getElementById('game').classList.add('hidden');
                ['memories', 'chats', 'letter', 'gift', 'wishes'].forEach(id => {
                    document.getElementById(id).classList.remove('hidden');
                });
                AOS.refresh();
                window.scrollTo({ top: document.getElementById('memories').offsetTop, behavior: 'smooth' });
            }
        } else {
            // Wrong
            qInput.classList.add('shake');
            setTimeout(() => qInput.classList.remove('shake'), 400);
            qInput.value = "";
            qInput.placeholder = "Coba lagi sayang...";
        }
    });

    // 7. Inject Photos & Chats
    const photoGrid = document.getElementById('photo-grid');
    for(let i=1; i<=8; i++) {
        const div = document.createElement('div');
        div.className = 'polaroid';
        div.innerHTML = `<img src="assets/images/memories/photo${i}.jpg" alt="Memory ${i}" loading="lazy">`;
        div.addEventListener('click', () => openModal(`assets/images/memories/photo${i}.jpg`));
        photoGrid.appendChild(div);
    }

    const chatTimeline = document.getElementById('chat-timeline');
    for(let i=1; i<=4; i++) {
        const div = document.createElement('div');
        div.className = 'chat-card';
        div.setAttribute('data-aos', 'fade-right');
        div.innerHTML = `<div class="chat-img-wrap"><img src="assets/images/chats/chat${i}.jpg" alt="Chat ${i}" loading="lazy"></div>`;
        div.addEventListener('click', () => openModal(`assets/images/chats/chat${i}.jpg`));
        chatTimeline.appendChild(div);
    }

    // 8. Fullscreen Modal Logic
    const modal = document.getElementById('media-modal');
    const modalImg = document.getElementById('modal-img');
    const modalQuote = document.getElementById('modal-quote');
    const closeModal = document.getElementById('close-modal');

    function openModal(src) {
        modalImg.src = src;
        modalQuote.innerText = `"${romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)]}"`;
        modal.classList.add('active');
    }
    closeModal.addEventListener('click', () => modal.classList.remove('active'));

    // 9. Love Letter Interaction
    const envelope = document.getElementById('envelope');
    const openLetterBtn = document.getElementById('open-letter-btn');
    let typed = null;

    openLetterBtn.addEventListener('click', () => {
        envelope.classList.toggle('open');
        if(envelope.classList.contains('open') && !typed) {
            setTimeout(() => {
                typed = new Typed('#typed-letter', {
                    strings: ["Hai Zahra manisku,<br><br>Hampir dua tahun kita bersama. Waktu terasa begitu cepat kalau aku sedang bersamamu. Terima kasih karena selalu menerima segala kekuranganku dan selalu tertawa bersamaku.<br><br>Website ini Fikri buat khusus untuk menyimpan sebagian kecil kenangan kita. Maaf kalau tidak sempurna, tapi percayalah cintaku padamu sangat sempurna.<br><br>Selamanya milikmu,<br>Fikri"],
                    typeSpeed: 40,
                    showCursor: false
                });
            }, 800);
            openLetterBtn.innerText = "Tutup Surat";
        } else {
            openLetterBtn.innerText = "Buka Surat";
        }
    });

    // 10. Gift Card 3D Tilt Effect
    const tiltCard = document.getElementById('tilt-card');
    tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // 11. Final Section Canvas (Night Sky & Make a Wish)
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = [];
    for(let i=0; i<150; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5,
            o: Math.random(),
            d: Math.random() * 0.02
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#FFF';
        stars.forEach(s => {
            ctx.globalAlpha = s.o;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
            ctx.fill();
            s.o += s.d;
            if(s.o > 1 || s.o < 0) s.d = -s.d;
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    document.getElementById('wish-btn').addEventListener('click', () => {
        confetti({
            particleCount: 150, spread: 100, origin: { y: 0.6 },
            colors: ['#FFFFFF', '#FFD6E7', '#F4E7C5']
        });
        document.getElementById('wish-btn').innerText = "I Love You More, Zahra!";
    });

    // Add Keyframe for shake
    const style = document.createElement('style');
    style.innerHTML = `@keyframes shake { 0%, 100% {transform: translateX(0);} 25% {transform: translateX(-10px);} 75% {transform: translateX(10px);} } .shake { animation: shake 0.4s; }`;
    document.head.appendChild(style);
});
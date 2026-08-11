/* ==========================================================================
   BIRTHDAY SURPRISE WEBSITE - PRODUCTION READY JAVASCRIPT
   Features: Single IIFE Initialization, Null-Safe DOM Access, Timer Cleanup,
   Responsive Navigation, Keyboard Accessibility, Passcode Lock & Full Interactive Logic.
   ========================================================================== */

(() => {
  "use strict";

  /**
   * DOM Helper Functions
   */
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  /**
   * Centralized Timer & Lifecycle Manager
   */
  const timerManager = {
    intervals: new Set(),
    timeouts: new Set(),

    trackInterval(id) {
      this.intervals.add(id);
      return id;
    },

    trackTimeout(id) {
      this.timeouts.add(id);
      return id;
    },

    clearAll() {
      for (const id of this.intervals) clearInterval(id);
      for (const id of this.timeouts) clearTimeout(id);
      this.intervals.clear();
      this.timeouts.clear();
    }
  };

  /** ==========================================================================
   * 1. NAVIGATION & SCROLL SYSTEM
   * ========================================================================== */
  function initNavigation() {
    const navToggle = $("#navToggle");
    const navLinks = $("#navLinks");
    const links = $$(".nav-link");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        navToggle.classList.toggle("active");
      });

      // Close mobile menu when a link is clicked
      links.forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          navToggle.classList.remove("active");
        });
      });
    }

    // Scroll Spy: Highlight active nav link on scroll
    const sections = $$("section[id]");
    if (sections.length && links.length) {
      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY + 120;

        sections.forEach((section) => {
          const sectionHeight = section.offsetHeight;
          const sectionTop = section.offsetTop;
          const sectionId = section.getAttribute("id");

          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            links.forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${sectionId}`) {
                link.classList.add("active");
              }
            });
          }
        });
      }, { passive: true });
    }
  }

  /** ==========================================================================
   * 2. HERO SECTION BUTTONS
   * ========================================================================== */
  function initHero() {
    const startBtn = $("#startCelebration");
    const openBtn = $("#openSurprise");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        const cakeSection = $("#cake");
        cakeSection?.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (openBtn) {
      openBtn.addEventListener("click", () => {
        const giftSection = $("#gift");
        giftSection?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  /** ==========================================================================
   * 3. CAKE CUTTING SECTION
   * ========================================================================== */
  function initCake() {
    const cutBtn = $("#cutCake");
    const resetBtn = $("#resetCake");
    const cake = $("#cakeBody");
    const knife = $("#knife");
    const result = $("#cakeResult");
    const wish = $("#wishMessage");
    const music = $("#birthdaySong");
    const flames = $$(".flame");

    if (!cutBtn || !cake) return;

    let isCakeCut = false;

    const cleanupParticles = () => {
      $$(".cake-balloon, .cake-heart, .smoke").forEach((el) => el.remove());
      cake.classList.remove("cut");
      knife?.classList.remove("cut");
      result?.classList.remove("show");
      if (wish) wish.textContent = "🎂 Ready To Cut The Cake ❤️";

      flames.forEach((f) => {
        f.style.opacity = "1";
        f.style.transform = "scale(1)";
      });
    };

    const blowOutCandles = () => {
      flames.forEach((flame) => {
        flame.style.transition = "0.6s ease";
        flame.style.opacity = "0";
        flame.style.transform = "scale(0.2)";
      });
    };

    const createSmoke = () => {
      flames.forEach((flame) => {
        const smoke = document.createElement("div");
        smoke.className = "smoke";
        smoke.textContent = "💨";
        smoke.style.position = "absolute";
        smoke.style.left = `${flame.offsetLeft}px`;
        smoke.style.top = "-15px";
        smoke.style.fontSize = "22px";
        smoke.style.pointerEvents = "none";
        smoke.style.animation = "smokeUp 3s linear forwards";
        flame.parentElement?.appendChild(smoke);

        const t = setTimeout(() => smoke.remove(), 3200);
        timerManager.trackTimeout(t);
      });
    };

    const triggerConfetti = () => {
      if (typeof confetti === "function") {
        confetti({ particleCount: 180, spread: 140, origin: { y: 0.6 } });
      }

      // Rain balloons
      for (let i = 0; i < 15; i++) {
        const balloon = document.createElement("div");
        balloon.className = "cake-balloon";
        balloon.textContent = "🎈";
        balloon.style.position = "fixed";
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.bottom = "-60px";
        balloon.style.fontSize = `${24 + Math.random() * 20}px`;
        balloon.style.zIndex = "9999";
        balloon.style.pointerEvents = "none";
        document.body.appendChild(balloon);

        requestAnimationFrame(() => {
          balloon.style.transition = "transform 7s linear";
          balloon.style.transform = "translateY(-120vh)";
        });

        const t = setTimeout(() => balloon.remove(), 7000);
        timerManager.trackTimeout(t);
      }
    };

    const cutCake = () => {
      if (isCakeCut) return;
      isCakeCut = true;

      knife?.classList.add("cut");

      timerManager.trackTimeout(setTimeout(() => cake.classList.add("cut"), 500));
      timerManager.trackTimeout(setTimeout(() => blowOutCandles(), 900));
      timerManager.trackTimeout(setTimeout(() => createSmoke(), 1200));
      timerManager.trackTimeout(setTimeout(() => triggerConfetti(), 1700));

      timerManager.trackTimeout(setTimeout(() => {
        result?.classList.add("show");
        if (wish) wish.textContent = "🎉 Make A Wish! Happy Birthday! ❤️";
      }, 2100));

      if (music) {
        music.volume = 0.8;
        music.play().catch(() => { });
      }
    };

    const resetCake = () => {
      isCakeCut = false;
      cleanupParticles();
    };

    cutBtn.addEventListener("click", cutCake);
    resetBtn?.addEventListener("click", resetCake);
  }

  /** ==========================================================================
   * 4. MUSIC PLAYER SECTION
   * ========================================================================== */
  function initMusic() {
    const audio = $("#birthdaySong");
    if (!audio) return;

    const playBtn = $("#playSong");
    const pauseBtn = $("#pauseSong");
    const nextBtn = $("#nextSong");
    const prevBtn = $("#prevSong");
    const progressBar = $("#progressBar");
    const volumeBar = $("#volumeBar");
    const currentTimeDisplay = $("#currentTime");
    const durationDisplay = $("#duration");
    const albumCover = $(".album-cover");
    const albumRing = $(".album-ring");
    const equalizer = $(".equalizer");

    let isPlaying = false;
    let noteInterval = null;

    const formatTime = (seconds) => {
      if (!Number.isFinite(seconds) || isNaN(seconds)) return "0:00";
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const spawnMusicNotes = () => {
      if (noteInterval) return;
      noteInterval = timerManager.trackInterval(setInterval(() => {
        if (!isPlaying) return;
        const note = document.createElement("div");
        note.className = "music-note";
        note.textContent = Math.random() > 0.5 ? "🎵" : "🎶";
        note.style.position = "fixed";
        note.style.left = `${Math.random() * 100}vw`;
        note.style.bottom = "-20px";
        note.style.fontSize = `${20 + Math.random() * 18}px`;
        note.style.pointerEvents = "none";
        note.style.zIndex = "9999";
        note.style.animation = "float 5s linear forwards";
        document.body.appendChild(note);

        const t = setTimeout(() => note.remove(), 5000);
        timerManager.trackTimeout(t);
      }, 800));
    };

    const stopMusicNotes = () => {
      if (noteInterval) {
        clearInterval(noteInterval);
        noteInterval = null;
      }
    };

    const playAudio = () => {
      audio.play().then(() => {
        isPlaying = true;
        if (playBtn) playBtn.textContent = "⏸";
        albumCover?.classList.add("playing");
        albumRing?.classList.add("playing");
        equalizer?.classList.add("playing");
        spawnMusicNotes();
      }).catch(() => { });
    };

    const pauseAudio = () => {
      audio.pause();
      isPlaying = false;
      if (playBtn) playBtn.textContent = "▶";
      albumCover?.classList.remove("playing");
      albumRing?.classList.remove("playing");
      equalizer?.classList.remove("playing");
      stopMusicNotes();
    };

    playBtn?.addEventListener("click", () => isPlaying ? pauseAudio() : playAudio());
    pauseBtn?.addEventListener("click", pauseAudio);

    nextBtn?.addEventListener("click", () => {
      audio.currentTime = 0;
      playAudio();
    });

    prevBtn?.addEventListener("click", () => {
      audio.currentTime = 0;
      playAudio();
    });

    volumeBar?.addEventListener("input", () => {
      const val = parseFloat(volumeBar.value);
      if (Number.isFinite(val)) audio.volume = val;
    });

    progressBar?.addEventListener("input", () => {
      if (!audio.duration) return;
      const pct = parseFloat(progressBar.value);
      audio.currentTime = (pct / 100) * audio.duration;
    });

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration || !progressBar || !currentTimeDisplay) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      progressBar.value = String(pct);
      currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", () => {
      pauseAudio();
      if (progressBar) progressBar.value = "0";
      if (currentTimeDisplay) currentTimeDisplay.textContent = "0:00";
    });
  }

  /** ==========================================================================
   * 5. BIRTHDAY ROAST ZONE
   * ========================================================================== */
  function initRoast() {
    const generateBtn = $("#generateRoast");
    const anotherBtn = $("#anotherRoast");
    const roastText = $("#roastText");
    const roastCount = $("#roastCount");

    if (!generateBtn || !roastText) return;

    const roasts = [
      "You’re proof that motivation can be completely accidental 😂",
      "Happy Birthday! If jokes were candles, you’d need a backup generator 🎂😄",
      "You age like fine cake—sweet, risky, and impossible to resist 😂",
      "You’re like Wi-Fi… sometimes you connect late, but when you do—everyone celebrates ❤️",
      "Birthday roast: you’re so iconic even your silly decisions deserve confetti 🎉😂",
      "Don't worry about getting older. You're still younger than you will be next year! 🎂",
      "I was going to make an age joke, but I was afraid it would hurt your hips 😂",
      "Another year older, but definitely not another year wiser! 🤪"
    ];

    let count = 0;

    const getRoast = () => {
      const randomIdx = Math.floor(Math.random() * roasts.length);
      roastText.style.opacity = "0";
      roastText.style.transform = "translateY(10px)";

      setTimeout(() => {
        roastText.textContent = roasts[randomIdx];
        roastText.style.transition = "all 0.3s ease";
        roastText.style.opacity = "1";
        roastText.style.transform = "translateY(0)";
      }, 200);

      count += 1;
      if (roastCount) roastCount.textContent = String(count);
    };

    generateBtn.addEventListener("click", getRoast);
    anotherBtn?.addEventListener("click", getRoast);
  }

  /** ==========================================================================
   * 6. MEMORY GALLERY & LIGHTBOX MODAL
   * ========================================================================== */
  function initGallery() {
    const modal = $("#memoryModal");
    const popupImg = $("#popupImage");
    const popupTitle = $("#popupTitle");
    const popupDesc = $("#popupDescription");
    const closeBtn = $("#closeMemory");
    const prevBtn = $("#prevMemory");
    const nextBtn = $("#nextMemory");
    const cards = $$(".memory-btn");

    if (!modal || !cards.length) return;

    const memories = [
      {
        title: "🎂 Birthday Together",
        description: "Tum meri coding ki semicolon ho, Jo na ho toh error hi error aata hai. Tum saath ho toh, Har program successful compile ho jaata hai. ❤️",
        src: "image/memory1.jpeg"
      },
      {
        title: "🦋 Butterfly Vibes",
        description: "A little craziness, a lot of smiles, and a moment worth keeping forever. 💗",
        src: "image/memory2.jpeg"
      },
      {
        title: "🌸 Quietly Beautiful",
        description: "Some moments don't need words, they simply become beautiful memories. ✨",
        src: "image/memory3.jpeg"
      },
      {
        title: "✨ Grace & Confidence",
        description: "Confident, graceful, and carrying a beautiful dream in every step. 🌟",
        src: "image/memory4.jpeg"
      },
      {
        title: "❤️ Togetherness",
        description: "Two smiles, one frame, and a memory that will always bring a smile back. 🥰",
        src: "image/memory5.jpeg"
      },
      {
        title: "🎂 Sweetest Moment",
        description: "A little cake, a little happiness, and a moment made even sweeter. 💕",
        src: "image/memory6.jpeg"
      },
      {
        title: "🌙 Lost In The Moment",
        description: "Sometimes the most beautiful memories are the ones captured without trying. ✨",
        src: "image/memory7.jpeg"
      },
      {
        title: "🌃 Under The Lights",
        description: "A beautiful night, sparkling lights, and a memory worth holding onto. 💫",
        src: "image/memory8.jpeg"
      }
    ];

    let currentIndex = 0;

    const openMemory = (index) => {
      currentIndex = (index + memories.length) % memories.length;
      const m = memories[currentIndex];

      if (popupImg) {
        popupImg.style.display = "block";
        popupImg.removeAttribute("data-tried-fallback");
        popupImg.src = m.src;
        popupImg.alt = m.title;
        popupImg.onerror = function () {
          if (!this.getAttribute("data-tried-fallback")) {
            this.setAttribute("data-tried-fallback", "true");
            if (this.src.includes('image/')) {
              this.src = this.src.replace('image/', 'assets/image/');
            }
          }
        };
      }
      if (popupTitle) popupTitle.textContent = m.title;
      if (popupDesc) popupDesc.textContent = m.description;

      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    };

    const closeMemory = () => {
      modal.style.display = "none";
      document.body.style.overflow = "";
    };

    cards.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.getAttribute("data-id") || "0", 10);
        openMemory(id);
      });
    });

    closeBtn?.addEventListener("click", closeMemory);
    prevBtn?.addEventListener("click", () => openMemory(currentIndex - 1));
    nextBtn?.addEventListener("click", () => openMemory(currentIndex + 1));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeMemory();
    });
  }

  /** ==========================================================================
   * 7. MYSTERY GIFT BOX SECTION
   * ========================================================================== */
  function initGift() {
    const giftBox = $("#giftBox");
    const openBtn = $("#openGift");
    const giftModal = $("#giftModal");
    const closeBtn = $("#closeGift");
    const nextBtn = $("#nextGift");
    const giftMsg = $("#giftMessage");
    const giftCountDisplay = $("#giftCount");

    if (!giftBox || !giftModal) return;

    const gifts = [
      "A huge surprise hug and unlimited happiness! 💖",
      "You’ve unlocked extra birthday magic and confetti! 🎉",
      "A secret wish: May all your dreams come true this year! ✨",
      "Endless laughs, joy, and good vibes delivered directly to you! ❤️",
      "VIP Pass to the best birthday celebration ever! 🌟"
    ];

    let openedCount = 0;
    let giftIdx = 0;

    const openGiftBox = () => {
      const lid = giftBox.querySelector(".gift-lid");
      lid?.classList.add("open");

      setTimeout(() => {
        giftModal.style.display = "flex";
        document.body.style.overflow = "hidden";
        if (giftMsg) giftMsg.textContent = gifts[giftIdx % gifts.length];

        openedCount += 1;
        giftIdx += 1;
        if (giftCountDisplay) giftCountDisplay.textContent = String(openedCount);

        if (typeof confetti === "function") {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }
      }, 500);
    };

    const closeGiftBox = () => {
      giftModal.style.display = "none";
      document.body.style.overflow = "";
      const lid = giftBox.querySelector(".gift-lid");
      lid?.classList.remove("open");
    };

    giftBox.addEventListener("click", openGiftBox);
    openBtn?.addEventListener("click", openGiftBox);
    closeBtn?.addEventListener("click", closeGiftBox);

    nextBtn?.addEventListener("click", () => {
      giftMsg.textContent = gifts[giftIdx % gifts.length];
      giftIdx += 1;
      openedCount += 1;
      if (giftCountDisplay) giftCountDisplay.textContent = String(openedCount);
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    });

    giftModal.addEventListener("click", (e) => {
      if (e.target === giftModal) closeGiftBox();
    });

    // ==========================================
    // SECOND GIFT BOX (BIRTHDAY SURPRISE GIFT) LOGIC
    // ==========================================
    const surpriseGiftBox = $("#surpriseGiftBox");
    const openSurpriseBtn = $("#openSurpriseGift");
    const surpriseGiftModal = $("#surpriseGiftModal");
    const closeSurpriseBtn = $("#closeSurpriseGift");
    const surpriseGiftImg = $("#surpriseGiftImg");
    const surpriseGiftFallback = $("#surpriseGiftFallback");

    if (surpriseGiftBox && surpriseGiftModal) {
      const openSurpriseGiftBox = () => {
        const lid = surpriseGiftBox.querySelector(".gift-lid");
        lid?.classList.add("open");

        setTimeout(() => {
          surpriseGiftModal.style.display = "flex";
          const popup = surpriseGiftModal.querySelector(".surprise-gift-popup");
          if (popup) {
            popup.classList.remove("closing");
          }
          document.body.style.overflow = "hidden";

          if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
          }
        }, 500);
      };

      const closeSurpriseGiftBox = () => {
        const popup = surpriseGiftModal.querySelector(".surprise-gift-popup");
        if (popup) {
          popup.classList.add("closing");
          setTimeout(() => {
            surpriseGiftModal.style.display = "none";
            popup.classList.remove("closing");
            document.body.style.overflow = "";
            const lid = surpriseGiftBox.querySelector(".gift-lid");
            lid?.classList.remove("open");
          }, 280);
        } else {
          surpriseGiftModal.style.display = "none";
          document.body.style.overflow = "";
          const lid = surpriseGiftBox.querySelector(".gift-lid");
          lid?.classList.remove("open");
        }
      };

      surpriseGiftBox.addEventListener("click", openSurpriseGiftBox);
      openSurpriseBtn?.addEventListener("click", openSurpriseGiftBox);
      closeSurpriseBtn?.addEventListener("click", closeSurpriseGiftBox);

      surpriseGiftModal.addEventListener("click", (e) => {
        if (e.target === surpriseGiftModal) closeSurpriseGiftBox();
      });

      // Handle image load error to display stylish fallback placeholder box
      if (surpriseGiftImg && surpriseGiftFallback) {
        surpriseGiftImg.addEventListener("error", () => {
          surpriseGiftImg.style.display = "none";
          surpriseGiftFallback.style.display = "flex";
        });
        surpriseGiftImg.addEventListener("load", () => {
          surpriseGiftImg.style.display = "block";
          surpriseGiftFallback.style.display = "none";
        });
      }
    }
  }

  /** ==========================================================================
   * 8. BIRTHDAY ARCADE MINI GAMES
   * ========================================================================== */
  function initGames() {
    const gameModal = $("#gameModal");
    const closeBtn = $("#closeGame");
    const gameArea = $("#gameArea");
    const gameTitle = $("#gameTitle");
    const liveScoreDisplay = $("#liveScore");
    const liveTimeDisplay = $("#liveTime");
    const mainScoreDisplay = $("#gameScore");
    const gameBtns = $$(".game-btn[data-game]");

    if (!gameModal || !gameArea || !gameBtns.length) return;

    let gameState = {
      score: 0,
      timeLeft: 30,
      isPlaying: false,
      timerId: null,
      spawnId: null,
      gameType: "cake"
    };

    // Load top score from localStorage
    let topScore = parseInt(localStorage.getItem("hbd_top_score") || "0", 10);
    if (mainScoreDisplay) mainScoreDisplay.textContent = String(topScore);

    const resetGame = () => {
      gameState.isPlaying = false;
      gameState.score = 0;
      if (gameState.timerId) clearInterval(gameState.timerId);
      if (gameState.spawnId) clearInterval(gameState.spawnId);
      gameState.timerId = null;
      gameState.spawnId = null;
      gameArea.innerHTML = "";
      if (liveScoreDisplay) liveScoreDisplay.textContent = "0";
      if (liveTimeDisplay) liveTimeDisplay.textContent = "30";
    };

    const endGame = () => {
      gameState.isPlaying = false;
      if (gameState.timerId) clearInterval(gameState.timerId);
      if (gameState.spawnId) clearInterval(gameState.spawnId);

      if (gameState.score > topScore) {
        topScore = gameState.score;
        localStorage.setItem("hbd_top_score", String(topScore));
        if (mainScoreDisplay) mainScoreDisplay.textContent = String(topScore);
      }

      const overlay = document.createElement("div");
      overlay.className = "game-win";
      overlay.innerHTML = `
        <h2>🎉 Time's Up! 🎉</h2>
        <p>Your Final Score: <strong>${gameState.score}</strong></p>
        <button type="button" id="restartGameBtn">Play Again 🔄</button>
      `;
      gameArea.appendChild(overlay);

      overlay.querySelector("#restartGameBtn")?.addEventListener("click", () => {
        startGame(gameState.gameType);
      });
    };

    const spawnTarget = () => {
      if (!gameState.isPlaying) return;
      const target = document.createElement("div");

      let emoji = "🎂";
      let points = 1;

      if (gameState.gameType === "balloon") {
        emoji = "🎈";
      } else if (gameState.gameType === "heart") {
        const isGold = Math.random() < 0.2;
        emoji = isGold ? "💛" : "❤️";
        points = isGold ? 5 : 1;
        if (isGold) target.classList.add("gold-heart");
      }

      target.className = `${gameState.gameType}-item`;
      target.textContent = emoji;

      const areaWidth = gameArea.clientWidth;
      const x = Math.random() * (areaWidth - 50);
      target.style.left = `${Math.max(10, x)}px`;
      target.style.top = "0px";

      target.addEventListener("click", (e) => {
        if (!gameState.isPlaying) return;
        gameState.score += points;
        if (liveScoreDisplay) liveScoreDisplay.textContent = String(gameState.score);

        // Spawn Floating Score Text
        const pop = document.createElement("div");
        pop.className = "score-pop";
        pop.textContent = `+${points}`;
        pop.style.left = `${e.clientX - gameArea.getBoundingClientRect().left}px`;
        pop.style.top = `${e.clientY - gameArea.getBoundingClientRect().top}px`;
        gameArea.appendChild(pop);

        setTimeout(() => pop.remove(), 800);
        target.remove();
      });

      gameArea.appendChild(target);

      // Animate Target Falling
      const speed = 2500 + Math.random() * 1000;
      target.animate([
        { transform: "translateY(0px)" },
        { transform: "translateY(360px)" }
      ], { duration: speed, easing: "linear" }).onfinish = () => {
        target.remove();
      };
    };

    const startGame = (type) => {
      resetGame();
      gameState.gameType = type;
      gameState.isPlaying = true;
      gameState.timeLeft = 30;

      if (gameTitle) {
        gameTitle.textContent = type === "cake" ? "🎂 Catch The Cake" : type === "balloon" ? "🎈 Pop The Balloons" : "❤️ Heart Collector";
      }

      gameModal.style.display = "flex";
      document.body.style.overflow = "hidden";

      // Timer Loop
      gameState.timerId = timerManager.trackInterval(setInterval(() => {
        gameState.timeLeft -= 1;
        if (liveTimeDisplay) liveTimeDisplay.textContent = String(gameState.timeLeft);
        if (gameState.timeLeft <= 0) endGame();
      }, 1000));

      // Spawner Loop
      gameState.spawnId = timerManager.trackInterval(setInterval(spawnTarget, 600));
    };

    const closeGame = () => {
      resetGame();
      gameModal.style.display = "none";
      document.body.style.overflow = "";
    };

    gameBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const game = btn.getAttribute("data-game") || "cake";
        startGame(game);
      });
    });

    closeBtn?.addEventListener("click", closeGame);

    gameModal.addEventListener("click", (e) => {
      if (e.target === gameModal) closeGame();
    });
  }

  /** ==========================================================================
   * 9. CREDITS & FOOTER ACTIONS
   * ========================================================================== */
  function initCredits() {
    const backToTopBtn = $("#backToTop");
    const restartBtn = $("#restartJourney");

    backToTopBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    restartBtn?.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const wishMessage = $("#wishMessage");
      if (wishMessage) wishMessage.textContent = "🎂 Ready To Cut The Cake ❤️";
      $("#cakeResult")?.classList.remove("show");
      $("#cakeBody")?.classList.remove("cut");
      $("#knife")?.classList.remove("cut");
    });
  }

  /** ==========================================================================
   * 10. GLOBAL ACCESSIBILITY & ESCAPE LISTENER
   * ========================================================================== */
  function initGlobalEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        $$(".memory-modal, .gift-modal, .game-modal").forEach((m) => {
          m.style.display = "none";
        });
        document.body.style.overflow = "";
      }
    });

    window.addEventListener("beforeunload", () => {
      timerManager.clearAll();
    });
  }

  /** ==========================================================================
   * 11. PASSCODE LOCK SYSTEM
   * ========================================================================== */
  function initPasscode() {
    const CORRECT_PASSWORD = "1920";
    let enteredCode = "";
    let isVerifying = false;

    if (sessionStorage.getItem("birthdayUnlocked") === "true") {
      document.body.classList.remove("passcode-locked");
      document.body.classList.add("passcode-unlocked");

      const passcodePage = document.querySelector("#passcode");
      if (passcodePage) {
        passcodePage.style.display = "none";
      }
    } else {
      document.body.classList.add("passcode-locked");
    }

    const boxes = $$(".passcode-box");
    const messageEl = $("#passcodeMessage");
    const boxesContainer = $("#passcodeBoxes");
    const keypadBtns = $$(".keypad-btn");
    const backspaceBtn = $("#passcodeBackspace");

    if (!boxesContainer || !boxes.length) return;

    // Helper: update display boxes UI
    const updateBoxes = () => {
      boxes.forEach((box, i) => {
        if (i < enteredCode.length) {
          box.classList.add("filled");
        } else {
          box.classList.remove("filled");
        }
      });
    };

    // Helper: show message
    const showMessage = (msg, type = "") => {
      if (!messageEl) return;
      messageEl.textContent = msg;
      messageEl.className = `passcode-message ${type}`;
    };

    // Handle digit input
    const addDigit = (digit) => {
      if (isVerifying || enteredCode.length >= 4) return;
      enteredCode += digit;
      updateBoxes();
      showMessage("");

      if (enteredCode.length === 4) {
        checkPasscode();
      }
    };

    // Handle backspace (delete last digit)
    const deleteDigit = () => {
      if (isVerifying || enteredCode.length === 0) return;
      enteredCode = enteredCode.slice(0, -1);
      updateBoxes();
      showMessage("");
    };

    // Handle clear / reset
    const clearPasscode = () => {
      if (isVerifying) return;
      enteredCode = "";
      updateBoxes();
      showMessage("");
    };

    // Check passcode
    const checkPasscode = () => {
      if (isVerifying) return;
      isVerifying = true;

      if (enteredCode === CORRECT_PASSWORD) {
        // Success
        sessionStorage.setItem("birthdayUnlocked", "true");
        boxesContainer.classList.add("success");
        showMessage("Yay! Surprise unlocked 💗", "success");

        if (typeof confetti === "function") {
          confetti({ particleCount: 160, spread: 120, origin: { y: 0.55 } });
        }

        timerManager.trackTimeout(setTimeout(() => {
          document.body.classList.remove("passcode-locked");
          document.body.classList.add("passcode-unlocked");

          // Navigate to home section smoothly
          const heroSection = $("#home");
          heroSection?.scrollIntoView({ behavior: "smooth" });

          // Hide passcode page after fade animation finishes
          timerManager.trackTimeout(setTimeout(() => {
            const passcodePage = $("#passcode");
            if (passcodePage) {
              passcodePage.style.display = "none";
            }
          }, 800));
        }, 1000));
      } else {
        // Wrong passcode
        boxesContainer.classList.add("shake");
        showMessage("😓 Better luck next time!", "wrong");

        timerManager.trackTimeout(setTimeout(() => {
          boxesContainer.classList.remove("shake");
          enteredCode = "";
          updateBoxes();
          showMessage("");
          isVerifying = false;
        }, 1200));
      }
    };

    // Click event listeners for keypad
    keypadBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        if (!key) return;

        if (key === "*") {
          clearPasscode();
        } else if (key === "#") {
          if (enteredCode.length < 4) {
            boxesContainer.classList.add("shake");
            showMessage("Please enter 4 digits 💗", "wrong");
            timerManager.trackTimeout(setTimeout(() => {
              boxesContainer.classList.remove("shake");
            }, 600));
          } else {
            checkPasscode();
          }
        } else {
          addDigit(key);
        }
      });
    });

    backspaceBtn?.addEventListener("click", deleteDigit);

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (!document.body.classList.contains("passcode-locked")) return;
      if (e.key >= "0" && e.key <= "9") {
        addDigit(e.key);
      } else if (e.key === "Backspace") {
        deleteDigit();
      } else if (e.key === "Escape") {
        clearPasscode();
      } else if (e.key === "Enter") {
        if (enteredCode.length === 4) {
          checkPasscode();
        }
      }
    });
  }

  /** ==========================================================================
   * INITIALIZE ALL MODULES
   * ========================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    try {
      initPasscode();
      initNavigation();
      initHero();
      initCake();
      initMusic();
      initRoast();
      initGallery();
      initGift();
      initGames();
      initCredits();
      initGlobalEvents();
      console.log("🎂 Birthday Surprise Website fully loaded & production ready!");
    } catch (err) {
      console.error("❌ Website initialization error:", err);
    }
  });
})();

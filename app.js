/**
 * 🎁 50 MYSTERY BOXES — MASTER GAME ENGINE
 * Live 50-Vault Matrix with Direct Sponsor Link & Return-To-Reveal Flow
 */

// ============================================================================
// 00. MASTER CONFIGURATION AREA (Edit all game settings here)
// ============================================================================
const GAME_CONFIG = {
  // Total Vaults
  totalBoxes: 50,
  winningBoxes: 10,

  // Destination URL on Win
  paidSiteUrl: "https://paid.sghome.space/",

  // Direct Ad / Sponsor Link Target on Box Click
  sponsorUnlockUrl: "https://omg10.com/4/11587014",

  // Partner & Sponsor Links
  sponsorLinksEnabled: true,
  sponsorLinks: [
    {
      title: "VIP Fast Pass Access",
      desc: "Instant direct sponsor bypass & high-tier reward access",
      url: "https://omg10.com/4/11587014"
    },
    {
      title: "Exclusive Bonus Booster",
      desc: "Claim supplementary promo perks & tier upgrades",
      url: "https://omg10.com/4/11587014"
    },
    {
      title: "High-Tier Vault Deals",
      desc: "Limited-edition partner discount tokens",
      url: "https://omg10.com/4/11587014"
    }
  ],

  // Sound Engine
  soundEnabled: true,

  // 10 Official Winning Promo Codes
  promoCodes: [
    { code: "SGHOME2007", discount: "10% Off",  link: "https://paid.sghome.space/" },
    { code: "SGVIP25",    discount: "50% Off",  link: "https://paid.sghome.space/" },
    { code: "SGHOME88",   discount: "88% Off",  link: "https://paid.sghome.space/" },
    { code: "GOLD99X",    discount: "40% Off",  link: "https://paid.sghome.space/" },
    { code: "VAULT10",    discount: "10% Off",  link: "https://paid.sghome.space/" },
    { code: "ALPHA77",    discount: "5% Off",   link: "https://paid.sghome.space/" },
    { code: "PRIME50",    discount: "14% Off",  link: "https://paid.sghome.space/" },
    { code: "NEXUS30",    discount: "30% Off",  link: "https://paid.sghome.space/" },
    { code: "SECRET20",   discount: "15% Off",  link: "https://paid.sghome.space/" },
    { code: "LUCKY100",   discount: "100% Off", link: "https://paid.sghome.space/" }
  ]
};

// ============================================================================
// 01. 50-VAULT GAME ENGINE
// ============================================================================
class MysteryBoxGame50 {
  constructor(config) {
    this.config = config;
    this.vaultBoxes = [];
    this.pendingUnlockIndex = null;
    this.isUnlockingAnimation = false;
    this.soundMuted = !config.soundEnabled;

    this.audioEngine = new CyberAudioEngine();
    this.particleEngine = new AmbientParticleEngine('ambientCanvas');
    this.confettiEngine = null;

    this.initElements();
    this.bindEvents();
    this.startPreloader();
  }

  initElements() {
    this.screenLoader = document.getElementById('screenLoader');
    this.screenGame = document.getElementById('screenGame');
    this.screenWinModal = document.getElementById('screenWinModal');
    this.screenEmptyModal = document.getElementById('screenEmptyModal');

    this.hudTotalBoxes = document.getElementById('hudTotalBoxes');
    this.hudRewardsCount = document.getElementById('hudRewardsCount');
    this.hudOpenedCount = document.getElementById('hudOpenedCount');
    this.hudStatus = document.getElementById('hudStatus');

    this.unlockPendingBanner = document.getElementById('unlockPendingBanner');
    this.pendingBannerTitle = document.getElementById('pendingBannerTitle');
    this.boxesGrid50 = document.getElementById('boxesGrid50');
    this.vaultProgressCount = document.getElementById('vaultProgressCount');
    this.vaultProgressFill = document.getElementById('vaultProgressFill');

    this.cinematicStatus = document.getElementById('cinematicStatus');
    this.cinematicText = document.getElementById('cinematicText');

    this.winPromoCode = document.getElementById('winPromoCode');
    this.winDiscountBadge = document.getElementById('winDiscountBadge');
    this.winVaultDesc = document.getElementById('winVaultDesc');
    this.btnCopyCode = document.getElementById('btnCopyCode');
    this.copyBtnText = document.getElementById('copyBtnText');
    this.btnUseCode = document.getElementById('btnUseCode');
    this.btnPlayAgainWin = document.getElementById('btnPlayAgainWin');

    this.emptyVaultDesc = document.getElementById('emptyVaultDesc');
    this.emptyRemainingCount = document.getElementById('emptyRemainingCount');
    this.emptyWinningCount = document.getElementById('emptyWinningCount');
    this.btnTryAnotherBox = document.getElementById('btnTryAnotherBox');
    this.btnEmptyBonusLink = document.getElementById('btnEmptyBonusLink');

    this.btnSoundToggle = document.getElementById('btnSoundToggle');
    this.iconSoundOn = this.btnSoundToggle?.querySelector('.icon-sound-on');
    this.iconSoundOff = this.btnSoundToggle?.querySelector('.icon-sound-off');
    this.modalHowToPlay = document.getElementById('modalHowToPlay');
    this.modalRewardInfo = document.getElementById('modalRewardInfo');
    this.toastContainer = document.getElementById('toastContainer');
    this.partnerLinksGrid = document.getElementById('partnerLinksGrid');

    if (this.btnUseCode) this.btnUseCode.href = this.config.paidSiteUrl;
    if (this.btnEmptyBonusLink) this.btnEmptyBonusLink.href = this.config.paidSiteUrl;

    this.renderPartnerOffers();
  }

  bindEvents() {
    this.btnSoundToggle?.addEventListener('click', () => this.toggleSound());

    document.getElementById('btnHowToPlay')?.addEventListener('click', () => this.openModal(this.modalHowToPlay));
    document.getElementById('btnRewardInfo')?.addEventListener('click', () => this.openModal(this.modalRewardInfo));
    document.getElementById('btnCloseHowToPlay')?.addEventListener('click', () => this.closeModal(this.modalHowToPlay));
    document.getElementById('btnGotIt')?.addEventListener('click', () => this.closeModal(this.modalHowToPlay));
    document.getElementById('btnCloseRewardInfo')?.addEventListener('click', () => this.closeModal(this.modalRewardInfo));
    document.getElementById('btnCloseRewardInfoBtn')?.addEventListener('click', () => this.closeModal(this.modalRewardInfo));

    this.btnCopyCode?.addEventListener('click', () => this.handleCopyPromoCode());
    this.btnPlayAgainWin?.addEventListener('click', () => this.closeResultModals());
    this.btnTryAnotherBox?.addEventListener('click', () => this.closeResultModals());

    document.getElementById('btnResetAllBoxes')?.addEventListener('click', () => {
      this.resetAllVaults();
      this.showToast('All 50 vaults have been re-calibrated & reset!');
    });
    document.getElementById('btnFooterTerms')?.addEventListener('click', () => this.showToast('Promotional game: 10 promo prizes hidden across 50 vaults.'));
    document.getElementById('btnFooterPrivacy')?.addEventListener('click', () => this.showToast('Privacy Policy: No personal user information stored.'));
    document.getElementById('btnFooterRules')?.addEventListener('click', () => this.openModal(this.modalRewardInfo));

    window.addEventListener('focus', () => this.handleTabReturn());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handleTabReturn();
      }
    });
  }

  startPreloader() {
    const progressBar = document.getElementById('loaderProgressBar');
    const percentLabel = document.getElementById('loaderPercent');
    const textLabel = document.getElementById('loaderText');

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 18) + 12;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (progressBar) progressBar.style.width = '100%';
        if (percentLabel) percentLabel.textContent = '100%';
        if (textLabel) textLabel.textContent = '50 LIVE VAULTS ARMED & READY';
        
        setTimeout(() => {
          if (this.screenLoader) this.screenLoader.style.display = 'none';
          if (this.screenGame) this.screenGame.style.display = 'flex';
          this.initialize50Vaults();
        }, 500);
      } else {
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (percentLabel) percentLabel.textContent = `${progress}%`;
      }
    }, 70);
  }

  initialize50Vaults() {
    this.vaultBoxes = [];
    this.pendingUnlockIndex = null;
    this.isUnlockingAnimation = false;

    for (let i = 0; i < this.config.winningBoxes; i++) {
      const reward = this.config.promoCodes[i % this.config.promoCodes.length];
      this.vaultBoxes.push({
        id: 0,
        isWin: true,
        reward: reward,
        opened: false,
        pending: false
      });
    }

    for (let i = 0; i < (this.config.totalBoxes - this.config.winningBoxes); i++) {
      this.vaultBoxes.push({
        id: 0,
        isWin: false,
        reward: null,
        opened: false,
        pending: false
      });
    }

    this.shuffleArray(this.vaultBoxes);

    this.vaultBoxes.forEach((box, index) => {
      box.id = index + 1;
    });

    this.render50BoxesGrid();
    this.updateHUD();
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  render50BoxesGrid() {
    if (!this.boxesGrid50) return;
    this.boxesGrid50.innerHTML = '';

    this.vaultBoxes.forEach((box, index) => {
      const boxCard = document.createElement('button');
      boxCard.className = 'grid-box-card';
      boxCard.id = `gridBox_${index}`;
      boxCard.setAttribute('data-index', index);
      boxCard.setAttribute('aria-label', `Mystery Vault #${box.id.toString().padStart(2, '0')}`);

      const numFormatted = box.id.toString().padStart(2, '0');

      let symbolHtml = '🔒';
      let statusHtml = 'LOCKED';

      if (box.opened) {
        if (box.isWin) {
          boxCard.classList.add('box-opened-won');
          symbolHtml = '💎';
          statusHtml = 'WIN!';
        } else {
          boxCard.classList.add('box-opened-empty');
          symbolHtml = '✕';
          statusHtml = 'EMPTY';
        }
      } else if (box.pending) {
        boxCard.classList.add('box-pending');
        symbolHtml = '⚡';
        statusHtml = 'OPENING';
      }

      boxCard.innerHTML = `
        <span class="grid-box-num">#${numFormatted}</span>
        <div class="grid-box-icon-wrap">
          <span class="grid-box-symbol">${symbolHtml}</span>
        </div>
        <span class="grid-box-status">${statusHtml}</span>
      `;

      boxCard.addEventListener('click', () => this.handleBoxClick(index));
      boxCard.addEventListener('mouseenter', () => {
        if (!box.opened && !this.isUnlockingAnimation) {
          this.audioEngine.play('hover');
        }
      });

      this.boxesGrid50.appendChild(boxCard);
    });
  }

  handleBoxClick(boxIndex) {
    const box = this.vaultBoxes[boxIndex];
    if (box.opened || this.isUnlockingAnimation) return;

    if (this.pendingUnlockIndex !== null && this.pendingUnlockIndex !== boxIndex) {
      this.vaultBoxes[this.pendingUnlockIndex].pending = false;
      const prevEl = document.getElementById(`gridBox_${this.pendingUnlockIndex}`);
      if (prevEl) prevEl.classList.remove('box-pending');
    }

    this.pendingUnlockIndex = boxIndex;
    box.pending = true;
    this.audioEngine.play('click');

    const boxEl = document.getElementById(`gridBox_${boxIndex}`);
    if (boxEl) {
      boxEl.classList.add('box-pending');
      const statusEl = boxEl.querySelector('.grid-box-status');
      if (statusEl) statusEl.textContent = 'OPENING';
      const symEl = boxEl.querySelector('.grid-box-symbol');
      if (symEl) symEl.textContent = '⚡';
    }

    const numFormatted = box.id.toString().padStart(2, '0');
    if (this.pendingBannerTitle) {
      this.pendingBannerTitle.textContent = `VAULT #${numFormatted} UNLOCKING IN PROGRESS...`;
    }
    if (this.unlockPendingBanner) {
      this.unlockPendingBanner.style.display = 'flex';
    }
    if (this.hudStatus) {
      this.hudStatus.textContent = `● UNLOCKING #${numFormatted}`;
    }

    this.showToast(`Vault #${numFormatted} initiated! Opening sponsor link...`);
    window.open(this.config.sponsorUnlockUrl, '_blank');
  }

  async handleTabReturn() {
    if (this.pendingUnlockIndex === null || this.isUnlockingAnimation) return;

    const boxIndex = this.pendingUnlockIndex;
    const box = this.vaultBoxes[boxIndex];
    if (!box || box.opened) return;

    this.isUnlockingAnimation = true;
    this.pendingUnlockIndex = null;
    box.pending = false;

    const boxEl = document.getElementById(`gridBox_${boxIndex}`);
    const numFormatted = box.id.toString().padStart(2, '0');

    if (this.unlockPendingBanner) this.unlockPendingBanner.style.display = 'none';
    if (this.cinematicStatus) this.cinematicStatus.style.display = 'flex';
    if (this.cinematicText) this.cinematicText.textContent = `DECRYPTING VAULT #${numFormatted}...`;

    this.audioEngine.play('unlock');

    await this.delay(700);
    if (this.cinematicText) this.cinematicText.textContent = `UNSEALING VAULT #${numFormatted}...`;
    this.audioEngine.play('open');

    await this.delay(600);

    box.opened = true;
    if (this.cinematicStatus) this.cinematicStatus.style.display = 'none';
    this.isUnlockingAnimation = false;

    if (boxEl) {
      boxEl.classList.remove('box-pending');
      const symEl = boxEl.querySelector('.grid-box-symbol');
      const statEl = boxEl.querySelector('.grid-box-status');

      if (box.isWin) {
        boxEl.classList.add('box-opened-won');
        if (symEl) symEl.textContent = '💎';
        if (statEl) statEl.textContent = 'WIN!';
      } else {
        boxEl.classList.add('box-opened-empty');
        if (symEl) symEl.textContent = '✕';
        if (statEl) statEl.textContent = 'EMPTY';
      }
    }

    this.updateHUD();
    this.showRevealOutcome(box);
  }

  showRevealOutcome(box) {
    const numFormatted = box.id.toString().padStart(2, '0');

    if (box.isWin && box.reward) {
      this.currentWinningCode = box.reward;
      if (this.winVaultDesc) this.winVaultDesc.textContent = `You cracked Vault #${numFormatted} and discovered an exclusive promo reward!`;
      if (this.winPromoCode) this.winPromoCode.textContent = box.reward.code;
      if (this.winDiscountBadge) this.winDiscountBadge.textContent = box.reward.discount || "VIP PROMO DISCOUNT";
      if (this.btnUseCode && box.reward.link) {
        this.btnUseCode.href = box.reward.link;
      }

      if (this.screenWinModal) this.screenWinModal.style.display = 'flex';
      this.audioEngine.play('win');

      if (!this.confettiEngine) {
        this.confettiEngine = new ConfettiExplosionEngine('confettiCanvas');
      }
      this.confettiEngine.burst();

    } else {
      const remainingUnopened = this.vaultBoxes.filter(b => !b.opened).length;
      const remainingWins = this.vaultBoxes.filter(b => !b.opened && b.isWin).length;

      if (this.emptyVaultDesc) this.emptyVaultDesc.textContent = `Vault #${numFormatted} was empty... but there are still ${remainingWins} active promo codes hidden in the remaining vaults!`;
      if (this.emptyRemainingCount) this.emptyRemainingCount.textContent = `${remainingUnopened} Vaults`;
      if (this.emptyWinningCount) this.emptyWinningCount.textContent = `${remainingWins} Rewards`;

      if (this.screenEmptyModal) this.screenEmptyModal.style.display = 'flex';
      this.audioEngine.play('empty');
    }
  }

  closeResultModals() {
    if (this.screenWinModal) this.screenWinModal.style.display = 'none';
    if (this.screenEmptyModal) this.screenEmptyModal.style.display = 'none';
    if (this.hudStatus) this.hudStatus.textContent = '● ONLINE';
  }

  updateHUD() {
    const openedCount = this.vaultBoxes.filter(b => b.opened).length;
    const remainingWins = this.vaultBoxes.filter(b => !b.opened && b.isWin).length;

    if (this.hudOpenedCount) {
      this.hudOpenedCount.textContent = `${openedCount} / ${this.config.totalBoxes}`;
    }
    if (this.hudRewardsCount) {
      this.hudRewardsCount.textContent = `${remainingWins} HIDDEN`;
    }
    if (this.vaultProgressCount) {
      this.vaultProgressCount.textContent = `${remainingWins} REWARDS REMAINING`;
    }
    if (this.vaultProgressFill) {
      const pct = (remainingWins / this.config.winningBoxes) * 100;
      this.vaultProgressFill.style.width = `${Math.max(pct, 5)}%`;
    }
  }

  resetAllVaults() {
    this.closeResultModals();
    this.initialize50Vaults();
  }

  handleCopyPromoCode() {
    if (!this.currentWinningCode) return;
    const codeToCopy = this.currentWinningCode.code;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(codeToCopy).then(() => {
        this.showCopyFeedback();
      }).catch(() => {
        this.fallbackCopy(codeToCopy);
      });
    } else {
      this.fallbackCopy(codeToCopy);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      this.showCopyFeedback();
    } catch (err) {
      this.showToast('Select code to copy: ' + text);
    }
    document.body.removeChild(textArea);
  }

  showCopyFeedback() {
    this.audioEngine.play('copy');
    this.btnCopyCode?.classList.add('copied');
    if (this.copyBtnText) this.copyBtnText.textContent = '✓ COPIED!';
    this.showToast(`Promo code "${this.currentWinningCode.code}" copied to clipboard!`);

    setTimeout(() => {
      this.btnCopyCode?.classList.remove('copied');
      if (this.copyBtnText) this.copyBtnText.textContent = 'COPY CODE';
    }, 2200);
  }

  showToast(message) {
    if (!this.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'cyber-toast';
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }

  renderPartnerOffers() {
    if (!this.partnerLinksGrid) return;
    this.partnerLinksGrid.innerHTML = '';

    if (!this.config.sponsorLinksEnabled || !this.config.sponsorLinks.length) {
      const section = document.getElementById('partnerOffersSection');
      if (section) section.style.display = 'none';
      return;
    }

    this.config.sponsorLinks.forEach(link => {
      const card = document.createElement('a');
      card.className = 'partner-card-link';
      card.href = link.url || this.config.paidSiteUrl;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.innerHTML = `
        <div class="partner-card-info">
          <span class="partner-link-name">${link.title}</span>
          <span class="partner-link-desc">${link.desc}</span>
        </div>
        <span class="partner-link-arrow">↗</span>
      `;
      this.partnerLinksGrid.appendChild(card);
    });
  }

  openModal(modalEl) {
    if (modalEl) modalEl.style.display = 'flex';
  }

  closeModal(modalEl) {
    if (modalEl) modalEl.style.display = 'none';
  }

  toggleSound() {
    this.soundMuted = !this.soundMuted;
    this.audioEngine.setMuted(this.soundMuted);
    if (this.soundMuted) {
      if (this.iconSoundOn) this.iconSoundOn.style.display = 'none';
      if (this.iconSoundOff) this.iconSoundOff.style.display = 'inline';
      this.showToast('Sound Muted');
    } else {
      if (this.iconSoundOn) this.iconSoundOn.style.display = 'inline';
      if (this.iconSoundOff) this.iconSoundOff.style.display = 'none';
      this.showToast('Sound Enabled');
      this.audioEngine.play('hover');
    }
  }

  delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
}

class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(isMuted) {
    this.muted = isMuted;
  }

  play(soundType) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      switch (soundType) {
        case 'hover': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(820, now + 0.06);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }
        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }
        case 'unlock': {
          const osc1 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          osc1.type = 'sawtooth';
          osc1.frequency.setValueAtTime(160, now);
          osc1.frequency.exponentialRampToValueAtTime(620, now + 0.5);
          gain1.gain.setValueAtTime(0.12, now);
          gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc1.connect(gain1);
          gain1.connect(this.ctx.destination);
          osc1.start(now);
          osc1.stop(now + 0.52);
          break;
        }
        case 'open': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, now);
          osc.frequency.exponentialRampToValueAtTime(240, now + 0.35);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.38);
          break;
        }
        case 'win': {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(0.2, now + index * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.45);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.48);
          });
          break;
        }
        case 'empty': {
          const notes = [440, 370, 311];
          notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.1, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.32);
          });
          break;
        }
        case 'copy': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(1320, now + 0.06);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }
      }
    } catch (e) {
      // Audio fallback
    }
  }
}

class AmbientParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 30;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.4 ? '#FF6A00' : '#FFA54A'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = this.height + 5;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#FF6A00';
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

class ConfettiExplosionEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.active = false;
  }

  burst() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    this.particles = [];
    const colors = ['#FF6A00', '#FFA54A', '#FFD166', '#FFFFFF', '#FF8C00'];
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 3;

    for (let i = 0; i < 85; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1,
        gravity: 0.18
      });
    }

    this.active = true;
    this.animate();
  }

  animate() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let living = 0;
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        living++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        this.ctx.restore();
      }
    });

    if (living > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.active = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('boxesGrid50')) {
    window.mysteryGame = new MysteryBoxGame50(GAME_CONFIG);
  }
});

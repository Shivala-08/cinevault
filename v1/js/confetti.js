const confettiCanvas = document.getElementById('confetti-canvas');
const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];
let confettiRAF = null;

const CONFETTI_COLORS = [
  '#E50914', '#FF6B6B', '#FFD700', '#4CAF50',
  '#52b7ff', '#FF79C6', '#BD93F9', '#FFFFFF'
];

class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    this.size = Math.random() * 7 + 4;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = -(Math.random() * 8 + 4);
    this.gravity = 0.35;
    this.drag = 0.97;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.012;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  update() {
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2 * 0.4, this.size, this.size * 0.4);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

const resizeConfettiCanvas = () => {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
};

const runConfetti = (originX, originY) => {
  if (!confettiCtx || !confettiCanvas) return;
  resizeConfettiCanvas();

  for (let i = 0; i < 55; i++) {
    confettiParticles.push(new ConfettiParticle(originX, originY));
  }

  if (confettiRAF) return;

  const animate = () => {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles = confettiParticles.filter(p => p.alpha > 0);
    confettiParticles.forEach(p => { p.update(); p.draw(confettiCtx); });
    if (confettiParticles.length > 0) {
      confettiRAF = requestAnimationFrame(animate);
    } else {
      confettiRAF = null;
    }
  };

  confettiRAF = requestAnimationFrame(animate);
};

window.addEventListener('resize', resizeConfettiCanvas);
resizeConfettiCanvas();

/**
 * Galaxy Background — Animated Star Field
 *
 * Ribuan bintang kecil bergerak pelan (drift) dengan efek twinkle.
 * Dirender di canvas fixed di belakang semua konten.
 */

(function () {
  // Buat canvas dan pasang ke belakang halaman
  var canvas = document.createElement("canvas");
  canvas.id = "galaxy-canvas";
  canvas.style.cssText = [
    "position: fixed",
    "top: 0",
    "left: 0",
    "width: 100%",
    "height: 100%",
    "z-index: 0",
    "pointer-events: none",
  ].join(";");
  document.body.insertBefore(canvas, document.body.firstChild);

  // Pastikan form container tampil di atas canvas
  var formContainer = document.querySelector(".form-container");
  if (formContainer) {
    formContainer.style.position = "relative";
    formContainer.style.zIndex = "1";
  }

  var ctx = canvas.getContext("2d");
  var stars = [];
  var W, H;

  // Konfigurasi bintang
  var STAR_COUNT = 280;
  var MAX_SPEED = 0.08;   // drift sangat pelan
  var MAX_SIZE = 1.6;

  // Resize canvas saat window berubah ukuran
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Buat satu bintang dengan properti acak
  function createStar(randomY) {
    var size = Math.random() * MAX_SIZE + 0.3;
    return {
      x: Math.random() * W,
      y: randomY ? Math.random() * H : Math.random() * H,
      size: size,
      // Kecepatan drift — bintang kecil lebih lambat (parallax feel)
      vx: (Math.random() - 0.5) * MAX_SPEED * (size / MAX_SIZE),
      vy: (Math.random() - 0.5) * MAX_SPEED * (size / MAX_SIZE),
      // Twinkle: fase dan kecepatan berbeda tiap bintang
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.012,
      // Opacity dasar — bintang lebih kecil lebih redup
      baseOpacity: 0.15 + Math.random() * 0.55 * (size / MAX_SIZE),
      // Warna: mayoritas putih-biru, sedikit kekuningan
      hue: Math.random() < 0.15 ? 45 : (Math.random() < 0.3 ? 210 : 0),
      saturation: Math.random() < 0.45 ? Math.floor(Math.random() * 30) : 0,
    };
  }

  // Inisialisasi semua bintang
  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push(createStar(true));
    }
  }

  // Loop animasi
  var frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    frame++;

    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Update posisi drift
      s.x += s.vx;
      s.y += s.vy;

      // Wrap around jika keluar layar
      if (s.x < -2) s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
      if (s.y < -2) s.y = H + 2;
      if (s.y > H + 2) s.y = -2;

      // Update fase twinkle
      s.twinklePhase += s.twinkleSpeed;

      // Hitung opacity dengan twinkle (sinusoidal)
      var twinkle = 0.5 + 0.5 * Math.sin(s.twinklePhase);
      var opacity = s.baseOpacity * (0.6 + 0.4 * twinkle);

      // Gambar bintang
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

      if (s.saturation > 0) {
        ctx.fillStyle = "hsla(" + s.hue + ", " + s.saturation + "%, 95%, " + opacity + ")";
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
      }

      ctx.fill();

      // Tambah glow lembut untuk bintang yang lebih besar
      if (s.size > 1.1 && twinkle > 0.7) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI * 2);
        var glowOpacity = opacity * 0.12 * (twinkle - 0.5);
        ctx.fillStyle = "rgba(200, 220, 255, " + glowOpacity + ")";
        ctx.fill();
      }
    }
  }

  // Mulai
  resize();
  initStars();
  animate();

  window.addEventListener("resize", function () {
    resize();
    initStars();
  });
})();

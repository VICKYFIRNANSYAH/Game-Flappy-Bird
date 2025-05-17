let move_speed = 3,
  gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');

let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let bgm = new Audio('sounds effect/bgm.mp3');
bgm.loop = true;
sound_point.volume = 1.0;
sound_die.volume = 1.0;
bgm.volume = 0.7; // sesuaikan agar tidak terlalu mengganggu


// Mendapatkan properti bird dan background
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';

img.style.display = 'none';
score_title.innerHTML = '';
score_val.innerHTML = '';
message.classList.add('messageStyle');

let bird_dy = 0;
let pipe_separation = 0;
let pipe_gap = 35;
let pipe_distance_threshold = 140; // jarak antar rintangan lebih lebar

// Fungsi tampilkan tombol start/start again
function showStartMessage(isGameOver = false) {
  message.classList.add('messageStyle');
  message.innerHTML = `<button id="startBtn">${isGameOver ? 'Start Again' : 'Start'}</button>`;
}

// Fungsi mulai game
function startGame() {
  // Reset semua rintangan
  document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
  img.style.display = 'block';
  bird.style.top = '40vh';
  bird_dy = 0;
  game_state = 'Play';
  score_title.innerHTML = 'Score : ';
  score_val.innerHTML = '0';
  message.innerHTML = '';
  bird_props = bird.getBoundingClientRect();
  bgm.currentTime = 0;
  bgm.play();

  play();
}

// Event tombol Start klik
document.addEventListener('click', (e) => {
  if (
    e.target &&
    e.target.id === 'startBtn' &&
    (game_state === 'Start' || game_state === 'End')
  ) {
    startGame();
  }
});

// Event keyboard
document.addEventListener('keydown', (e) => {
  if (
    (e.key === 'Enter' && (game_state === 'Start' || game_state === 'End'))
  ) {
    startGame();
  }

  if (game_state === 'Play' && (e.key === 'ArrowUp' || e.key === ' ')) {
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
  }
});

document.addEventListener('keyup', (e) => {
  if (game_state === 'Play' && (e.key === 'ArrowUp' || e.key === ' ')) {
    img.src = 'images/Bird.png';
  }
});

// Event layar sentuh untuk naikkan burung dan start game
document.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (game_state === 'Start' || game_state === 'End') {
    startGame();
  } else if (game_state === 'Play') {
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
  }
});
document.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (game_state === 'Play') {
    img.src = 'images/Bird.png';
  }
});

// Fungsi game over
function gameOver() {
  game_state = 'End';
  img.style.display = 'none';
  bgm.pause();
  sound_die.play();
  showStartMessage(true);
}

// Fungsi play game (main loop)
function play() {
  function move() {
    if (game_state !== 'Play') return;

    let pipe_sprites = document.querySelectorAll('.pipe_sprite');
    pipe_sprites.forEach((element) => {
      let pipe_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // Hapus rintangan yang sudah keluar layar
      if (pipe_props.right <= 0) {
        element.remove();
      } else {
        // Deteksi tabrakan burung dengan pipa
        if (
          bird_props.left < pipe_props.left + pipe_props.width &&
          bird_props.left + bird_props.width > pipe_props.left &&
          bird_props.top < pipe_props.top + pipe_props.height &&
          bird_props.top + bird_props.height > pipe_props.top
        ) {
          gameOver();
          return;
        } else {
          // Hitung skor jika berhasil lewati pipa
          if (
            pipe_props.right < bird_props.left &&
            pipe_props.right + move_speed >= bird_props.left &&
            element.increase_score === '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            element.increase_score = '0';
            sound_point.play();
          }
          element.style.left = pipe_props.left - move_speed + 'px';
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  // Fungsi gravitasi dan kontrol burung
  function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity;
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      gameOver();
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  // Fungsi buat pipa
  function create_pipe() {
    if (game_state !== 'Play') return;

    if (pipe_separation > pipe_distance_threshold) {
      pipe_separation = 0;
      let pipe_pos = Math.floor(Math.random() * 43) + 8;

      // Pipa atas terbalik
      let pipe_top = document.createElement('div');
      pipe_top.className = 'pipe_sprite';
      pipe_top.style.top = pipe_pos - 70 + 'vh';
      pipe_top.style.left = '100vw';
      document.body.appendChild(pipe_top);

      // Pipa bawah
      let pipe_bottom = document.createElement('div');
      pipe_bottom.className = 'pipe_sprite';
      pipe_bottom.style.top = pipe_pos + pipe_gap + 'vh';
      pipe_bottom.style.left = '100vw';
      pipe_bottom.increase_score = '1';
      document.body.appendChild(pipe_bottom);
    }
    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

// Tampilkan tombol Start pertama kali
showStartMessage(false);

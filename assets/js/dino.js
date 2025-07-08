/* ---------------------------------------------------------
   dino заметка коротко 
   1.  2-D-канвас 900×250 и рисование спрт динозавра.
   2. Динозавр ходит/прыгает по кадрам анимации, прыжок  пробел
  или клик (прыгает только если уже на земле).
   3. Каждые X кадров справа выезжает колесо-препятствие.
  Скорость движения и частота препятствий растут,
  когда счёт кратен 100 играть становится всё сложней.
   4. Столкновение динозавра с колёсом = Game Over.
  Появляется тёмный экран и текст Press Space or Click.
   5. Очки (score) растут за каждый кадр выживания.
   6. Весь цикл update → draw → requestAnimationFrame(loop)
      крутится бесконечно пока игрок не проиграет
      или не перезапустит игру.
   --------------------------------------------------------- */


const canvas = document.getElementById("dinoCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 250;

// Игровой персонаж
let dino = {
  x: 50,
  y: 180,
  size: 75,
  vy: 0,
  gravity: 0.7,
  jumpStrength: -12
};

let obstacles = [];
let score = 0, gameOver = false;

// Загрузка кадров анимации
const dinoFrames = [];
const totalFrames = 10; // Walk (1) to Walk (10)
for (let i = 1; i <= totalFrames; i++) {
  const img = new Image();
  img.src = `assets/freedinosprite/png/Walk (${i}).png`;
  dinoFrames.push(img);
}

const jumpFrames = [];
const totalJumpFrames = 6;
for (let i = 1; i <= totalJumpFrames; i++) {
  const img = new Image();
  img.src = `assets/freedinosprite/png/Jump (${i}).png`;
  jumpFrames.push(img);
}


const wheelImg = new Image();
wheelImg.src = 'assets/img/axe6bg.png';

let currentFrame = 0;
let frameCounter = 0;

//const wheelImg = new Image();
//  fillRectwheelImg.src = 'assets/img/tires.gif';

function drawDino(x, y, size) {
  const isJumping = dino.y < 180;

  const frames = isJumping ? jumpFrames : dinoFrames;
  const total = isJumping ? totalJumpFrames : totalFrames;
  const frame = frames[currentFrame % total];

  if (frame.complete) {
    ctx.drawImage(frame, x, y - size, size, size);
  }

  // Ускорение прыжка (меньше число — быстрее)
  const jumpSpeed = 8;
  const walkSpeed = 6;

  frameCounter++;
  const speed = isJumping ? jumpSpeed : walkSpeed;

  if (frameCounter % speed === 0) {
    currentFrame = (currentFrame + 1) % total;
  }
}


function spawnObstacle() {
  obstacles.push({ x: canvas.width, y: 180, width: 45, height: 40 });
}


let obstacleTimer = 1;
let obstacleInterval = 200; // кадры между препятствиями

 const initialSpeed = 6.5; // добавляем вверху
let speed = initialSpeed; // используем переменную

function reset() {
  dino.y = 180;
  dino.vy = 0;
  obstacles = [];
  score = 0;
  speed = initialSpeed;
  obstacleInterval = 200; //  сбрасывание частоту 
  obstacleTimer = 0;
  gameOver = false;
}


function update() {
  dino.vy += dino.gravity;
  dino.y += dino.vy;
  if (dino.y > 180) { dino.y = 180; dino.vy = 0; }

 if (gameOver) return; // Остановка всей логики
  
    
  obstacleTimer++;
  if (obstacleTimer > obstacleInterval) {
    spawnObstacle();
    obstacleTimer = 0;
  }

  obstacles = obstacles.map(obs => {
    obs.x -= speed;
    return obs;
  }).filter(obs => obs.x + obs.width > 0);

  obstacles.forEach(obs => {
    const margin = 25;
    if (
  obs.x + margin < dino.x + dino.size - margin &&
  obs.x + obs.width - margin > dino.x + margin &&
  obs.y < dino.y + dino.size - margin &&
  obs.y + obs.height > dino.y + margin
) {
  gameOver = true;
}
  });

  if (!gameOver) {
    score += 1;
    if (score % 100 === 0) {
      speed += 0.5;
      obstacleInterval = Math.max(40, obstacleInterval - 8); // увеличиваем сложность
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //  Если игра окончена — заморозить динозавра
  if (!gameOver) {
    drawDino(dino.x, dino.y, dino.size);
  } else {
    ctx.drawImage(dinoFrames[0], dino.x, dino.y - dino.size, dino.size, dino.size);
  }

  //  Отрисовка препятствий (вращение только если не gameOver)
  ctx.fillStyle = "#333";
  obstacles.forEach(obs => {
    ctx.save();
    ctx.translate(obs.x + obs.width / 2, obs.y - obs.height / 2);

    let angle = gameOver ? 0 : (Date.now() / 100) % (2 * Math.PI);
    ctx.rotate(angle);

    if (wheelImg.complete) {
      ctx.drawImage(wheelImg, -obs.width / 2, -obs.height / 2, obs.width, obs.height);
    }

    ctx.restore();
  });

  // Счёт
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, 30);

  // Сообщение Game Over
  if (gameOver) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over — Press Space or Click", canvas.width / 2 - 120, 100);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    if (gameOver) reset();
    else if (dino.y === 180) dino.vy = dino.jumpStrength;
  }
});

canvas.addEventListener("click", () => {
  if (gameOver) {
    reset();
  } else if (dino.y === 180) {
    dino.vy = dino.jumpStrength;
  }
});


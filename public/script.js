const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 148,
  },
  imageSrc: "./img/shop.png",
  scale: 2.6,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/IdlePlayer.png",
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 154 },
  sprites: {
    idle: {
      imageSrc: "./img/IdlePlayer.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/RunPlayer.png",
      framesMax: 8,
    },
    runReverse: {
      imageSrc: "./img/RunPlayerReverse.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/JumpPlayer.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/FallPlayer.png",
      framesMax: 2,
    },
    Attack1Player: {
      imageSrc: "./img/Attack1Player.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/TakeHitPlayer.png",
      framesMax: 4
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },

  imageSrc: "./img/IdleEnemy.png",
  framesMax: 4,
  scale: 2.5,
  offset: { x: 215, y: 169 },
  sprites: {
    idle: {
      imageSrc: "./img/IdleEnemy.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/RunEnemy.png",
      framesMax: 8,
    },
    runReverse: {
      imageSrc: "./img/RunEnemyReverse.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/JumpEnemy.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/FallEnemy.png",
      framesMax: 2,
    },
    Attack1Player: {
      imageSrc: "./img/Attack1Enemy.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/TakehitEnemy.png",
      framesMax: 3
    },
  },

  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // Player Movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("runReverse");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  // Jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // Enemy Movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("runReverse");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // Detect for Collision and gets hit

  if (
    rectangularCollision({
      renctangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemy-health").style.width = enemy.health + "%";
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // WHERE PLAYER GETS HIT

  if (
    rectangularCollision({
      renctangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    document.querySelector("#player-health").style.width = player.health + "%";
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // End game based on health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  // Player Keys
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  // Enemy Keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

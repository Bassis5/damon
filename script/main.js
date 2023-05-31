let player = {
  x: 100,
  y: 400,
  w: 50,
  h: 100,
  xVel: 0,
  yVel: 0,
  jumping: 0,
  jumpCooldown: 0,
  shootCooldown: 0,
  ultCooldown: 0,
  lookDirection: 1,
  health: 100,
};
let player2 = {
  x: 500,
  y: 400,
  w: 50,
  h: 100,
  xVel: 0,
  yVel: 0,
  jumping: 0,
  jumpCooldown: 0,
  shootCooldown: 0,
  ultCooldown: 0,
  lookDirection: 1,
  health: 100,
};
let platform = {
  x: 50,
  y: screen.height - 200,
  w: screen.width - 100,
  h: 20,
};
let bullets = [];
let ults = [];

function movement(object) {
  object.x += object.xVel;
  object.y += object.yVel;
}

function floors(entity, object) {
  if (entity.y + entity.h >= object.y && entity.jumping === 0) {
    entity.y = object.y - entity.h;
  }
}

function shoot(object, key) {
  if (key && object.shootCooldown === 0) {
    if (object.lookDirection === 1) {
      bullets.push({
        x: object.x + object.w,
        y: object.y + object.h / 2 - 10,
        r: 5,
        xVel: object.lookDirection * 8,
        yVel: 0,
        damage: 5,
      });
      object.shootCooldown = 90;
    }
    if (object.lookDirection === -1) {
      bullets.push({
        x: object.x - 10,
        y: object.y + object.h / 2 - 10,
        r: 5,
        xVel: object.lookDirection * 8,
        yVel: 0,
        damage: 5,
      });
      object.shootCooldown = 90;
    }
  }
  if (object.shootCooldown > 0) {
    object.shootCooldown--;
  }
}

function bulletDetection(object, object2, bullet, bulletlist, iValue) {
  if (
    bullet.x < object.x + object.w &&
    bullet.x + bullet.r > object.x &&
    bullet.y < object.y + object.h &&
    bullet.r + bullet.y > object.y
  ) {
    object.health -= bullet.damage;
    bulletlist.splice(iValue, 1);
  } else if (
    bullet.x < object2.x + object2.w &&
    bullet.x + bullet.r > object2.x &&
    bullet.y < object2.y + object2.h &&
    bullet.r + bullet.y > object2.y
  ) {
    object2.health -= bullet.damage;
    bulletlist.splice(iValue, 1);
  }
}

function ultimate(object, key) {
  if (key && object.ultCooldown === 0) {
    if (object.lookDirection === 1) {
      ults.push({
        x: object.x + object.w,
        y: object.y + object.h / 2 - 10,
        r: 25,
        xVel: object.lookDirection * 4,
        yVel: 0,
        damage: 20,
      });
      object.ultCooldown = 200;
    }
    if (object.lookDirection === -1) {
      ults.push({
        x: object.x - 10,
        y: object.y + object.h / 2 - 10,
        r: 25,
        xVel: object.lookDirection * 4,
        yVel: 0,
        damage: 20,
      });
      object.ultCooldown = 200;
    }
  }
  if (object.ultCooldown > 0) {
    object.ultCooldown--;
  }
}

function update() {
  clearScreen();

  if (player.health <= 0) {
    text(
      screen.width / 2 - 200,
      screen.height / 2 - 50,
      40,
      "Player 2 win",
      "red"
    );
    setTimeout(() => {
      window.open("./index.html", "_self");
    }, 3000);
    stopUpdate();
  }
  else if (player2.health <= 0) {
    text(
      screen.width / 2 - 200,
      screen.height / 2 - 50,
      40,
      "Player 1 win",
      "red"
    );
    setTimeout(() => {
      window.open("./index.html", "_self");
    }, 3000);
    stopUpdate();
  }

  with (player) {
    picture(x, y,"./image/player1.png", w, h);
    rectangle(x, y - 15, w, 5, "gray");
    rectangle(x, y - 15, (w * health) / 100, 5, "red");
    xVel = 0;
    if (jumping === 0) {
      yVel = 5;
    }
    if (keyboard.d) {
      xVel = 3;
      lookDirection = 1;
    }
    if (keyboard.a) {
      xVel = -3;
      lookDirection = -1;
    }
    if (keyboard.w === true && jumping === 0 && jumpCooldown === 0) {
      console.log(jumping);
      yVel = -6;
      jumpCooldown = 85;
      jumping = 35;
    }
    if (jumping > 0) {
      jumping--;
    }
    if (jumpCooldown > 0) {
      jumpCooldown--;
    }
  }
  with (player2) {
    picture(x, y,"./image/player2.png", w, h);
    rectangle(x, y - 15, w, 5, "gray");
    rectangle(x, y - 15, (w * health) / 100, 5, "red");

    xVel = 0;
    if (jumping === 0) {
      yVel = 5;
    }
    if (keyboard.right) {
      xVel = 3;
      lookDirection = 1;
    }
    if (keyboard.left) {
      xVel = -3;
      lookDirection = -1;
    }
    if (keyboard.up === true && jumping === 0 && jumpCooldown === 0) {
      yVel = -6;
      jumpCooldown = 85;
      jumping = 35;
    }
    if (jumping > 0) {
      jumping--;
    }
    if (jumpCooldown > 0) {
      jumpCooldown--;
    }
  }

  with (platform) {
    rectangle(x, y, w, h, "red");
  }

  for (var i = 0; i < bullets.length; i++) {
    with (bullets[i]) {
      rectangle(x, y, r, r, "orange");
    }
    movement(bullets[i]);
    bulletDetection(player, player2, bullets[i], bullets, i);
  }
  for (var i = 0; i < ults.length; i++) {
    with (ults[i]) {
      rectangle(x, y, r, r, "blue");
    }
    movement(ults[i]);
    bulletDetection(player, player2, ults[i], ults, i);
  }

  movement(player);
  shoot(player, keyboard.s);
  shoot(player2, keyboard.down);
  ultimate(player, keyboard.f);
  ultimate(player2, keyboard.space)
  movement(player2);
  floors(player, platform);
  floors(player2, platform);
}

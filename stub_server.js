(function() {
  var generateChanges, initializeHell, newBullet;
  newBullet = function() {
    var bullet;
    bullet = {
      id: window.bulletCount,
      x: parseInt(Math.random() * 800),
      y: parseInt(Math.random() * 600),
      vel: {
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150
      },
      action: 'new',
      type: 'bullet'
    };
    window.bulletCount += 1;
    return bullet;
  };
  generateChanges = function() {
    var b, bullet, message;
    for (b = 0; b <= 10; b++) {
      bullet = window.bullets[b];
      bullet['x'] = bullet['x'] + bullet['vel']['x'] * 1/10;
      bullet['y'] = bullet['y'] + bullet['vel']['y'] * 1/10;
      bullet['action'] = 'update';
      while (bullet['x'] > 800 || bullet['x'] < 0 || bullet['y'] > 600 || bullet['y'] < 0) {
        bullet = newBullet();
        window.bullets[b] = bullet;
      }
    }
    message = window.bullets;
    return handleMessage(message);
  };
  initializeHell = function() {
    var b;
    window.bullets = [];
    window.bulletCount = 2;
    for (b = 0; b <= 10; b++) {
      window.bullets.push(newBullet());
    }
    return setInterval(generateChanges, 100);
  };
  initializeHell();
}).call(this);

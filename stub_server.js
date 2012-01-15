(function() {
  var generateChanges, initializeHell, newBullet;
  newBullet = function() {
    var bullet;
    bullet = {
      id: window.bulletCount,
      x: parseInt(Math.random() * 800),
      y: parseInt(Math.random() * 600),
      velocity: {
        x: Math.random() * 3 - 1.5,
        y: Math.random() * 3 - 1.5
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
      bullet['x'] = bullet['x'] + bullet['velocity']['x'];
      bullet['y'] = bullet['y'] + bullet['velocity']['y'];
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

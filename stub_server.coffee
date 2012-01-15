newBullet = () ->
  bullet =
    id: window.bulletCount
    x:  parseInt(Math.random() * 800)
    y:  parseInt(Math.random() * 600)
    velocity:
      x: Math.random() * 3 - 1.5
      y: Math.random() * 3 - 1.5
    action: 'new'
    type: 'bullet'
  window.bulletCount += 1
  bullet
generateChanges = () ->
  for b in [0..10]
    bullet = window.bullets[b]
    bullet['x'] = bullet['x'] + bullet['velocity']['x']
    bullet['y'] = bullet['y'] + bullet['velocity']['y']
    bullet['type'] = 'update'
    while bullet['x'] > 800 or bullet['x'] < 0 or bullet['y'] > 600 or bullet['y'] < 0
      bullet = newBullet()
      window.bullets[b] = bullet

  message = window.bullets

  handleMessage(message)

initializeHell = () ->
  window.bullets = []
  window.bulletCount = 2
  for b in [0..10]
    window.bullets.push(newBullet())
  setInterval(generateChanges, 100)

initializeHell()

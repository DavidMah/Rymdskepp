connectToServer = (data) ->
  data['action'] = 'new_player'

  socket = new WebSocket("ws://#{data['server']}:9001")

  socket.onopen = (evt) ->
    addToOutbox(data)

  socket.onmessage = (evt) ->
    handleMessage(JSON.parse(evt.data))

  socket.onclose = (evt) ->

  window.outbox = []
  setInterval(prepareServerSending(socket), 100)

addToOutbox = (message) ->
  window.outbox.push(message)

prepareServerSending = (socket) ->
  sendToServer = () ->
    socket.send(JSON.stringify(window.outbox))
    window.outbox = []

window.connectToServer = connectToServer
window.addToOutbox = addToOutbox

connectToServer = (data) ->
  data['action'] = 'new_player'

  socket = new WebSocket("ws://#{data['server']}:9001")

  socket.onopen = (evt) ->
    socket.send(JSON.stringify(data))

  socket.onmessage = (evt) ->

  socket.onclose = (evt) ->

window.connectToServer = connectToServer

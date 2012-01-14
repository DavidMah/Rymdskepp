player =
  action: "new_player"
  name:   "default"
  code:   parseInt(Math.random() * 1000)


socket = new WebSocket('ws://127.0.0.1:9001')

socket.onopen = (evt) ->
  console.log("Opened Socket!")
  socket.send(JSON.stringify(player))

socket.onmessage = (evt) ->
  console.log("message: #{evt.data}")

socket.onclose = (evt) ->
  console.log("close")

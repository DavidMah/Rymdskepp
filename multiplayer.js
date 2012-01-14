(function() {
  var player, socket;
  player = {
    action: "new_player",
    name: "default",
    code: parseInt(Math.random() * 1000)
  };
  socket = new WebSocket('ws://127.0.0.1:9001');
  socket.onopen = function(evt) {
    console.log("Opened Socket!");
    return socket.send(JSON.stringify(player));
  };
  socket.onmessage = function(evt) {
    return console.log("message: " + evt.data);
  };
  socket.onclose = function(evt) {
    return console.log("close");
  };
}).call(this);

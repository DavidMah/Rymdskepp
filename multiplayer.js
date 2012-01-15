(function() {
  var connectToServer;
  connectToServer = function(data) {
    var socket;
    data['action'] = 'new_player';
    socket = new WebSocket("ws://" + data['server'] + ":9001");
    socket.onopen = function(evt) {
      return socket.send(JSON.stringify(data));
    };
    socket.onmessage = function(evt) {
      return handleMessage(JSON.parse(evt.data));
    };
    return socket.onclose = function(evt) {};
  };
  window.connectToServer = connectToServer;
}).call(this);

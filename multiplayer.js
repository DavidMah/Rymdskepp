(function() {
  var addToOutbox, connectToServer, prepareServerSending;
  connectToServer = function(data) {
    var socket;
    data['action'] = 'new_player';
    socket = new WebSocket("ws://" + data['server'] + ":9001");
    socket.onopen = function(evt) {
      return addToOutbox(data);
    };
    socket.onmessage = function(evt) {
      console.log("message received " + evt.data);
      return handleMessage(JSON.parse(evt.data));
    };
    socket.onclose = function(evt) {};
    window.outbox = [];
    return setInterval(prepareServerSending(socket), 100);
  };
  addToOutbox = function(message) {
    return window.outbox.push(message);
  };
  prepareServerSending = function(socket) {
    var sendToServer;
    return sendToServer = function() {
      socket.send(JSON.stringify(window.outbox));
      return window.outbox = [];
    };
  };
  window.connectToServer = connectToServer;
  window.addToOutbox = addToOutbox;
}).call(this);

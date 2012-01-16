(function() {
  var beginGame, joinLobby, rememberCookieDetails, writeCookieDetails;
  $(document).ready(function() {
    $('#opener_play').click(beginGame);
    window.code = $.md5(Math.random());
    return rememberCookieDetails();
  });
  joinLobby = function() {
    var socket;
    return socket = new WebSocket("ws://davidpmah.com:9002");
  };
  beginGame = function() {
    var data;
    $('#opener').hide();
    data = writeCookieDetails();
    window.connectToServer(data);
    Crafty.init(800, 600);
    return Crafty.scene("menu");
  };
  writeCookieDetails = function() {
    var data;
    data = {
      server: $('#opener_server').val(),
      name: $('#opener_name').val(),
      code: window.code
    };
    $.cookie('has_played', true);
    $.cookie('server', data['server']);
    $.cookie('name', data['name']);
    $.cookie('code', data['code']);
    return data;
  };
  rememberCookieDetails = function() {
    if ($.cookie('has_played')) {
      $('#opener_server').val($.cookie('server'));
      return $('#opener_name').val($.cookie('name'));
    }
  };
}).call(this);

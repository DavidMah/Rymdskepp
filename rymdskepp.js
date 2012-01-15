(function() {
  var beginGame, rememberCookieDetails, writeCookieDetails;
  $(document).ready(function() {
    $('#opener_play').click(beginGame);
    return rememberCookieDetails();
  });
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
      code: $('#opener_code').val()
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
      $('#opener_name').val($.cookie('name'));
      return $('#opener_code').val($.cookie('code'));
    }
  };
}).call(this);

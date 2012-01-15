(function() {
  var beginGame;
  $(document).ready(function() {
    return $('#opener_play').click(beginGame);
  });
  beginGame = function() {
    $('#opener').hide();
    Crafty.init(800, 600);
    return Crafty.scene("menu");
  };
}).call(this);

$(document).ready(() ->
  $('#opener_play').click(beginGame)
)

beginGame = () ->
  $('#opener').hide()
  name = $('#opener_name').text()
  code = $('#opener_code').text()

  Crafty.init(800, 600)
  Crafty.scene("menu")

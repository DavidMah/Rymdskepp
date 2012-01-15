$(document).ready(() ->
  $('#opener_play').click(beginGame)
  rememberCookieDetails()
)

beginGame = () ->
  $('#opener').hide()
  data = writeCookieDetails()
  window.connectToServer(data)

  Crafty.init(800, 600)
  Crafty.scene("menu")

# Cookies
writeCookieDetails = () ->
  data =
    server: $('#opener_server').val()
    name:   $('#opener_name').val()
    code:   $('#opener_code').val()
  $.cookie('has_played', true)
  $.cookie('server', data['server'])
  $.cookie('name', data['name'])
  $.cookie('code', data['code'])
  data

rememberCookieDetails = () ->
  if $.cookie('has_played')
    $('#opener_server').val($.cookie('server'))
    $('#opener_name').val($.cookie('name'))
    $('#opener_code').val($.cookie('code'))

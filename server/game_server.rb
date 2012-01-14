require 'web_socket'


class GameServer
  def initialize(socket)
    socket.send('{"action":"set_game_server"}')
  end

  def request_messages
    puts "requesting..."
  end

  def send_messages
    puts "sending..."
  end
end

socket = WebSocket.new("ws://localhost:9001")
server = GameServer.new(socket)

i = 0
loop do
  server.request_messages
  server.send_messages
  sleep 1
end

require 'json'
require 'eventmachine'
require 'em-websocket'

class SocketServer
  def initialize
    @sockets = []
    @game_server = nil
  end

  def handle(message, socket)
    begin
      message = JSON.parse(message)
      self.send("handle_#{message['action']}", socket, message)
    rescue => ex
      puts ex
    end
  end

  # Once set, the game server can't change
  def handle_set_game_server(socket, message)
    puts "setting game server" if not @game_server
    @game_server ||= socket
  end
end

socket_server = SocketServer.new

i = 0
EventMachine.run {
  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 9001) do |socket|
    socket.onopen {
      puts "Opened socket"
    }

    socket.onmessage do |msg|
      socket_server.handle(msg, socket)
    end
  end
}

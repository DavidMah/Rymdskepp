require 'json'
require 'eventmachine'
require 'em-websocket'

class SocketServer
  def initialize
    @sockets = {}
    @game_server = nil
    @top_id = 0

    @outbox = []
  end

  def add_socket(socket)
    @sockets[socket] = @top_id
    @sockets[@top_id] = socket
    add_to_outbox({"action" => "new_socket"}, socket)
    @top_id += 1
  end

  def handle(message, socket)
    begin
      message = JSON.parse(message)
      if message['action'] == 'game_server'
        send("handle_gs_#{message['command']}", socket, message)
      elsif 
        add_to_outbox(message, socket)
      end
    rescue => ex
      puts "\033[31m#{ex}\n#{ex.backtrace[0..3].join("\n")}\033[0m"
    end
  end

  # Once set, the game server can't change
  def handle_gs_set_game_server(socket, message)
    puts "setting game server" if not @game_server
    @game_server ||= socket
  end

  def handle_gs_request_messages(socket, message)
    @game_server.send @outbox.to_json
    @outbox = []
  end

  # {"messages" => [
  #    {"id" => 1,
  #     "message" => "--------------"
  #    }
  # ...]}
  def handle_gs_send_messages(socket, message)
    items = message['messages']
    puts "sending out #{items.size} messages to clients..."
    items.each do |item|
      outbound_id = item['id']
      outbound_socket = @sockets[outbound_id]
      outbound_socket.send item['message']
    end
  end

  def add_to_outbox(message, socket)
    @outbox << {"socket" => @sockets[socket], "message" => message}
  end
end

socket_server = SocketServer.new

i = 0
EventMachine.run {
  EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 9001) do |socket|
    socket.onopen {
      socket_server.add_socket(socket)
    }

    socket.onmessage do |msg|
      socket_server.handle(msg, socket)
    end
  end
}
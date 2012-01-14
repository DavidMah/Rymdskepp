require 'web_socket'
require 'json'

MESSAGE_BOILER = {"action" => "game_server"}


class GameServer
  def initialize(socket)
    @socket = socket
    @socket.send('{"action":"game_server", "command":"set_game_server"}')
    @outbox = []

    @users = {}
  end

  def request_messages
    puts "requesting messages..."
    @socket.send('{"action":"game_server", "command":"request_messages"}')

    puts "TEST #{@users.inspect}"
  end

  def handle_data(messages)
    begin
      messages = JSON.parse(messages)
      puts "!!!#{messages}"
      puts "handling #{messages.size} messages"
      messages.each do |msg|
        puts "=>#{msg}"
        puts "==>#{msg['message']}"
        puts "==>#{msg['message']['action']}"
        action = msg['message']['action']
        send("handle_#{action}", msg['message'], msg['socket'])
      end
    rescue => ex
      puts "\033[31m#{ex}\n#{ex.backtrace[0..3].join("\n")}\033[0m"
    end
  end

  def send_messages
    puts "sending...#{@outbox.size} messages"
    container = MESSAGE_BOILER
    container = container.merge({"command"  => "send_messages"})
    container = container.merge({"messages" => @outbox})
    @socket.send(container.to_json)
    @outbox = []
  end

  # Responses
  def handle_new_socket(message, socket_id)
    @users[socket_id] = {}
  end

  def handle_new_player(message, socket_id)
    name = message['name']
    code = message['code']
    @users[socket_id]['name'] = name
    @users[socket_id]['code'] = code
  end
end

socket = WebSocket.new("ws://localhost:9001")
server = GameServer.new(socket)

i = 0
loop do
  server.request_messages()
  server.handle_data(socket.receive())
  server.send_messages()
  sleep(0.3)
end
require 'web_socket'
require 'json'

MESSAGE_BOILER = {"action" => "game_server"}


class GameServer
  def initialize(socket)
    @socket = socket
    @socket.send('{"action":"game_server", "command":"set_game_server"}')
    @outbox = []

    @users = {}
    @old_players = {}
  end

  def request_messages
    log "requesting messages..."
    @socket.send('{"action":"game_server", "command":"request_messages"}')

    log "Current Users:  #{@users.inspect}"
  end

  def handle_data(messages)
    begin
      messages = JSON.parse(messages)
      log "handling #{messages.size} messages"
      log "#{messages.inspect}"
      messages.each do |msg| # socket, message basket
        socket = msg['socket']
        if msg['message'].is_a?(Array)
          msg['message'].each do |m| # message in basket
            handle_message(m, socket)
          end
        else
          handle_message(msg['message'], socket)
        end
      end
    rescue => ex
      log "\033[31m#{ex}\n#{ex.backtrace[0..3].join("\n")}\033[0m"
    end
  end

  def handle_message(message, socket)
    log "mess #{message.inspect}"
    action = message['action']
    send("handle_#{action}", message, socket)
  end

  def send_messages
    log "sending...#{@outbox.size} messages"
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

  def handle_remove_socket(message, socket_id)
    @users.delete(socket_id)
  end

  def handle_new_player(message, socket_id)
    name = message['name']
    code = message['code']
    @users[socket_id]['name'] = name
    @users[socket_id]['code'] = code
  end

  # new entity comes into existence
  def handle_new(message, socket_id)
    log(message.inspect, "[034m")
  end

  def handle_update(message, socket_id)
    log(message.inspect, "[034m")
  end


  def log(message, color = "[33m")
      puts "\033#{color}Game Server: #{message}\033[0m"
  end
end

def run_game_server
  socket = WebSocket.new("ws://localhost:9001")
  server = GameServer.new(socket)

  i = 0
  loop do
    server.request_messages()
    server.handle_data(socket.receive())
    server.send_messages()
    sleep(0.3)
  end
end

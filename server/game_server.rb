load "game_state_manager.rb"
require 'web_socket'
require 'json'

MESSAGE_BOILER = {"action" => "game_server"}
LOBBY_SERVER   = "davidpmah.com:9002"
RATE = 0.1


class GameServer
  def initialize(socket, name)
    @name = name
    @game_state = GameStateManager.new(self, RATE)
    begin
      @lobby  = WebSocket.new("ws://#{LOBBY_SERVER}")
    rescue
      log "no lobby"
      @lobby = nil
    end
    @socket = socket
    @socket.send('{"action":"game_server", "command":"set_game_server"}')
    @outbox = []

    @users = {}
    @old_players = {}
  end

  def request_messages
    log "requesting messages..."
    @socket.send('{"action":"game_server", "command":"request_messages"}')

    # log "Current Users:  #{@users.inspect}"
  end

  def handle_data(messages)
    begin
      messages = JSON.parse(messages)
      log "handling #{messages.size} messages"
      # log "#{messages.inspect}"
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
    # log "mess #{message.inspect}"
    action = message['action']
    send("handle_#{action}", message, socket)
  end

  def send_to_all(message, except = nil)
    return message.each {|m| send_to_all(m)} if message.is_a?(Array)
      # log "Message Output => #{message.inspect}"
    @users.each do |id, data|
      data['outbox']['messages'] << message
    end
  end

  # {"messages" => [
  #    {"socket_id" => 1,
  #     "message" => "--------------"
  #    }
  # ...]}
  def move_user_outboxes_to_outbox
    @outbox = @outbox + @users.map do |id, user|
      {
        "socket_id" => id,
        "messages"  => user['outbox']['messages']
      }
    end
    @outbox.reject!{|m| m['messages'].empty? or m['socket_id'] == 0}
    @users.each {|id, data| data['outbox']['messages'] = []}
  end

  def add_to_outbox(message)
    @outbox << message
  end

  def send_messages
    # log "the messages => #{@users.inspect}"
    move_user_outboxes_to_outbox
    log "sending...#{@outbox.size} messages"
    container = MESSAGE_BOILER
    container = container.merge({"command"  => "send_messages"})
    container = container.merge({"messages" => @outbox})
    @socket.send(container.to_json)
    @outbox = []
  end

  # Responses
  def handle_new_socket(message, socket_id)
    @users[socket_id] = {'outbox' => {
                                       'socket_id' => socket_id,
                                       'messages'  => [],
                                     }
                        }
  end

  def handle_remove_socket(message, socket_id)
    @game_state.remove_entity(@users[socket_id]['id'], "player")
    log "about to destroy #{socket_id}"
    @users.delete(socket_id)
  end

  def handle_new_player(message, socket_id)
    name = message['name']
    code = message['code']
    @users[socket_id]['name'] = name
    @users[socket_id]['code'] = code
    player_id = @game_state.handle_new_player(message, socket_id)
    @users[socket_id]['id'] = player_id
  end

  def run_state_changes
    @game_state.run_state_changes()
  end

  def request_update_changes
    send_to_all(@game_state.retrieve_update_changes)
  end

  # new entity comes into existence
  def handle_new(message, socket_id)
    log("saw new thing => #{message.inspect}", "[035m")
    @game_state.handle_new(message, socket_id)
  end

  def handle_update(message, socket_id)
    # log("Update Message => #{message.inspect}", "[034m")
    @game_state.handle_update(message, socket_id)
  end

  def handle_collision(message, socket_id)
    log(message.inspect, "[034m")
  end

  def handle_destroy(message, socket_id)
    log(message.inspect, "[034m")
    send_to_all(@game_state.handle_destroy(message, socket_id))
  end

  def update_lobby
    return if @lobby.nil?
    @lobby.send({
      'action'  => 'update',
      'name'    => @name,
      'players' => @users.size - 1
    }.to_json)
  end

  def log(message, color = "[33m")
      puts "\033#{color}<#{Time.now.to_f}> Game Server: #{message}\033[0m"
  end
end

def run_game_server(name = "Rymdskepp Game")
  socket = WebSocket.new("ws://localhost:9001")
  server = GameServer.new(socket, name)

  i = 0
  loop do
    pretime = Time.now.to_f

    server.request_messages()
    server.handle_data(socket.receive())

    server.run_state_changes()

    server.request_update_changes()
    server.send_messages()
    if i > 10
      server.update_lobby()
      i = 0
    end
    length = Time.now.to_f - pretime
    i += RATE
    server.log("Cycle time => #{length}", "[7m")
    waittime = ((RATE - length) <= 0 ? 0 : (RATE - length))
    sleep(waittime)
  end
end

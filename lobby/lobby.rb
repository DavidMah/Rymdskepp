require 'eventmachine'
require 'json'
require 'em-websocket'

class Lobby
  def initialize
    @rooms = []
    @room_ids = {}
  end

  def handle_message(message, socket)
    log "Message => #{message}"
    begin
      case message['action']
      when 'check'
        check_rooms(socket)
      when 'add'
        add_room(message, socket)
      when 'update'
        update_room(message, socket)
      end
    rescue => ex
      log "\033[31mFrom message => #{message.inspect}\033"
      log "\033[31m#{ex}\n#{ex.backtrace[0..3].join("\n")}\033[0m"
    end
  end

  def check_rooms(socket)
    socket.send(pretty_rooms.to_json)
  end

  # {
  #   action  => 'add'
  #   name    => 'derp'
  #   players => 3
  #   address => 127.0.0.1
  # }
  def add_room(message, socket)
    @room_ids[socket] = @rooms.size
    @rooms << get_room_message(message, socket)
  end

  def update_room(message, socket)
    if @room_ids[socket].nil?
      add_room(message, socket)
    else
      @rooms[@room_ids[socket]] = get_room_message(message, socket)
    end
  end

  def get_room_message(message, socket)
    {
      'name'    => message['name'],
      'players' => message['players'],
      'address' => get_ip(socket)
    }
  end

  def remove_room(socket)
    @rooms.delete(socket)
  end

  def pretty_rooms
    @rooms.to_json
  end

  def log(message)
      puts "\033[32mSocket Server: #{message}\033[0m"
  end

  def get_ip(socket)
    socket.get_peername[2, 6].unpack('nC4')[1..4].join(".")
  end
end

lobby = Lobby.new

EventMachine.run do
  EventMachine::WebSocket.start(:host => '0.0.0.0', :port => 9002) do |socket|
    socket.onopen {}
    socket.onmessage do |msg|
      lobby.handle_message(JSON.parse(msg), socket)
    end
    socket.onclose { lobby.remove_room(socket) }
  end
end

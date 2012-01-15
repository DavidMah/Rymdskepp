class GameStateManager
  def initialize(game_server)
    @game_server = game_server
    @everything = {}
    @players    = {}
    @bullets    = {}
    @aliens     = {}
    @asteroids  = {}
  end

  def run_state_changes
  end

  def handle_new_player(message, socket_id)
    add_new(message, @players)
  end

  def handle_new(message, socket_id)
    object = message
    case message['type']
    when 'netplayer'
      log "a new netplayer.. wtf #{object.inspect}"
    when 'bullet'
      add_new(object, @bullets)
    when 'alien'
      add_new(object, @aliens)
    when 'asteroid'
      add_new(object, @asteroids)
    end
    @game_server.send_to_all(object)
  end

  def add_new(object, list)
    assigned_id = @everything.size
    object = object.merge({'id' => assigned_id})
    @everything[assigned_id] = object
    list[assigned_id]        = object
  end
end

class GameStateManager
  def initialize(game_server)
    @game_server = game_server
    @everything = {}
    @players    = {}
    @bullets    = {}
    @aliens     = {}
    @asteroids  = {}

    @entity_table = {
      "player"   => @players,
      "bullet"   => @bullets,
      "alien"    => @aliens,
      "asteroid" => @asteroids
    }
  end

  def run_state_changes
  end

  def handle_new_player(message, socket_id)
    object = add_new(message, @players)
    @game_server.send_to_all(object)
    object['id']
  end

  def handle_new(message, socket_id)
    object = message
    add_new(object, @entity_table[message['type']])
    @game_server.send_to_all(object)
  end

  def handle_update(message, socket_id)
   
  end

  def add_new(object, list)
    assigned_id = @everything.size
    object = object.merge({'id' => assigned_id})
    @everything[assigned_id] = object
    list[assigned_id]        = object
    object
  end

  # Misc
  def retrieve_update_changes
    @everything.values.map{|unit| unit.merge({"action" => "update"})}
  end

  def remove_entity(id, type)
    puts "removing #{id} of type #{type}"
    @everything.delete(id)
    @entity_table[type].delete(id)
  end
end

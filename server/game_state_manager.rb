class GameStateManager
  def initialize(game_server, rate)
    @game_server = game_server
    @rate        = rate

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

    @current_id = 1
  end

  def run_state_changes
    # set_velocity_changes(@bullets)
    set_velocity_changes(@aliens)
  end

  def handle_new_player(message, socket_id)
    message = message.merge({
      'x' => 400,
      'y' => 400,
      'vel' => {
        'x' => 1,
        'y' => 1
      }
    })
    object = add_new(message, @players)
    object['action'] = 'new_player'
    @game_server.send_to_all(object)
    object['id']
  end

  def handle_new(message, socket_id)
    object = message
    add_new(object, @entity_table[message['type']])
    @game_server.send_to_all(object)
  end

  def handle_update(message, socket_id)
    id   = message['id']
    type = message['type']
    return if @everything[id].nil?
    item = @everything[id]
    item['x'] = message['x']
    item['y'] = message['y']
    item['vel'] = message['vel']
  end

  def add_new(object, list)
    assigned_id = @current_id
    object = object.merge({'id' => assigned_id})
    @everything[assigned_id] = object
    list[assigned_id]        = object
    @current_id += 1

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

  def set_velocity_changes(elements)
    elements.values.each do |e|
      e['x'] = e['vel']['x'] * RATE
      e['y'] = e['vel']['y'] * RATE
    end
  end
end

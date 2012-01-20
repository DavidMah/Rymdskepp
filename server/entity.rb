class Entity

  # Entity maintains a table of all current entities on the game board
  # Each Entity is given a unique global id for each game
  # In the @@entities table, this global id is also the key for
  #   retrieving data for that entity
  @@entities = {}
  @@entity_count = 0

  def self.entities
    @@entities
  end

  def self.add_to_entity_list(entity)
    @@entity_count += 1
    @@entities[@@entity_count] = entity
    @@entity_count
  end

  def self.destroy_entity(entity)
    @@entities.delete(entity.id)
  end

  def self.clear_entities(ids = nil)
    if ids == nil
      @@entities = {}
      @@entity_count = 0
    else
      ids.each do |id|
        @@entities.delete(id)
      end
    end
  end

  # --------------------------------
  # -- Instance level begins here --
  # --------------------------------

  attr_reader :id, :type

  def initialize(message = {})
    @x, @y = 0, 0
    @vel   = {:x => 0, :y => 0}
    @acc   = {:x => 0, :y => 0}
    @type  = 'entity'
    update_attributes(message)

    # Uses class for the sake of child inheritors!
    @id = self.class.add_to_entity_list(self)

    @new = true
  end

  # List of attributes
  def attributes
    ['type', 'id', 'x', 'y', 'v', 'a']
  end

  def update_attributes(message)
    @x   = (message[:x]   or @x)
    @y   = (message[:y]   or @y)
    @vel = (message[:vel] or @vel)
    @acc = (message[:acc] or @acc)
  end

  def destroy
    self.class.destroy_entity(self)
  end
  # ---------------------------------
  # -- Code Pertaining to Messages --

  # This message will be dispersed to all clients
  # As the information for the status of this entity
  def retrieve_update_message
    message = self.inspect
    message.merge!(:action => (@new ? 'new' : 'update'))
    @new = false
    message
  end

  def inspect
    {
      :type => @type,
      :id   => @id,
      :x    => @x,
      :y    => @y,
      :vel  => @vel.clone,
      :acc  => @acc.clone
    }
  end
  # -----------------------------------
  # -- Code Pertaining to Game Logic --

  def simulate_movement
    @x += @vel[:x] * RATE
    @y += @vel[:y] * RATE
    @vel[:x] += @acc[:x] * RATE
    @vel[:y] += @acc[:y] * RATE
  end
end

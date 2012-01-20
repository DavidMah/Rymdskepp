class Entity

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

  def self.clear_entities
    @@entities = {}
    @@entity_count = 0
  end

  # --------------------------------
  # -- Instance level begins here --
  # --------------------------------

  attr_reader :id, :type

  def initialize(message = {})
    @type  = :entity
    @x, @y = 0, 0
    @vel   = {:x => 0, :y => 0}
    @acc   = {:x => 0, :y => 0}
    update_attributes(message)

    @id = Entity.add_to_entity_list(self)
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
    Entity.destroy_entity(self)
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

end

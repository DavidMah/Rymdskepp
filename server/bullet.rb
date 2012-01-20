require_relative 'entity.rb'

class Bullet < Entity
  @@bullets = {}

  def self.entities
    @@bullets
  end

  def self.add_to_entity_list(entity)
    id = super(entity)
    @@bullets[id] = entity
  end

  def self.clear_entities(ids = nil)
    super(ids)
    if ids == nil
      @@bullets = {}
    else
      ids.each do |id|
        @@bullets.delete(id)
      end
    end
  end

  # --------------------------------
  # -- Instance level begins here --
  # --------------------------------

  def initialize(message = {})
    super(message)
    @type = 'bullet'
  end

end

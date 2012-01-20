require_relative 'entity.rb'

class Player < Entity
  @@players = {}
  def self.players
    @@players
  end

  def self.add_to_entity_list(entity)
    id = super(entity)
    @@players[id] = entity
  end

  def self.clear_entities(ids = nil)
    super(ids)
    if ids == nil
      @@players = {}
    else
      ids.each do |id|
        @@players.delete(id)
      end
    end
  end

  # --------------------------------
  # -- Instance level begins here --
  # --------------------------------

  def initialize(message = {})
    super(message)
    @type = 'player'
  end
end

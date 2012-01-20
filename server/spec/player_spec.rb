require_relative 'entity_spec_ops.rb'
require_relative '../player.rb'

describe Player do

  Type = 'player'

  before :each do
    @player = Player.new
  end

  after :each do
    Player.clear_entities
  end

  describe "#initialize" do
    it "should send players to the players pool" do
      Player.players.size.should == 1
    end
  end

  describe "retrieve_update_message" do
    it "should include the type player and inherit correctly" do
      data = @player.retrieve_update_message
      data[:type].should == 'player'
      check_entity_attributes(@player, 0, 0, 0, 0, 0, 0, {:data => data})
    end
  end
end

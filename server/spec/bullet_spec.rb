require_relative 'entity_spec_ops.rb'
require_relative '../bullet.rb'

describe Bullet do
  before :each do
    @bullet = Bullet.new
  end

  after :each do
    Bullet.clear_entities
  end

  describe "#initialize" do
    it "should send players to the players pool" do
      Bullet.entities.size.should == 1
    end
  end

  describe "#retrieve_update_message" do
    it "should include the type player and inherit correctly" do
      data = @bullet.retrieve_update_message
      data[:type].should == 'bullet'
      check_entity_attributes(@bullet, 0, 0, 0, 0, 0, 0, {:data => data})
    end
  end
end

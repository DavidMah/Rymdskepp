require_relative 'entity_spec_ops.rb'
require_relative "../entity.rb"

RATE = 0.1

describe Entity do
  before :each do
    @entity = Entity.new
  end

  # Class variables need to be reset
  after :each do
    Entity.clear_entities
  end

  describe "#initialize" do

    it "should assign increasing ids" do
      entity_two   = Entity.new
      entity_three = Entity.new
      @entity.inspect[:id].should      == 1
      entity_two.inspect[:id].should   == 2
      entity_three.inspect[:id].should == 3
    end

    it "should assign ids upwards even if entities are destroyed" do
      # RELIES ON DESTROY
      entity_two   = Entity.new
      @entity.destroy
      entity_three = Entity.new
      entity_three.id.should == 3
    end

    it "should assign attributes to 0 if there is no message" do
      check_entity_attributes(@entity, 0, 0, 0, 0, 0, 0)
    end
  end

  describe "update_attributes" do
    it "should set instance variables according to the message" do
      message = create_input_update(39, 42, 111, 333, 222, 444)
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 42, 111, 333, 222, 444)
    end

    it "should ignore keys that are missing" do
      message = create_input_update(39, 42, 111, 333, 222, 444)
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 42, 111, 333, 222, 444)

      message = create_input_update(nil, 0, 0, 0, nil, nil)
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 0, 0, 0, 222, 444)

      message = create_input_update(1, nil, nil, nil, 1, 1)
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 1, 0, 0, 0, 1, 1)
    end
  end

  describe "#destroy_entity" do
    it "should remove the entity's existence from the table" do
      @entity.destroy
      Entity.entities.size.should == 0
    end
  end

  describe "#retrieve_update_message" do
    it "should include the new action tag at first" do
      data = @entity.retrieve_update_message
      data[:action].should == 'new'
      data[:type].should   == 'entity'
      check_entity_attributes(@entity, 0, 0, 0, 0, 0, 0, {:data => data})
    end

    it "should include the update action tag after first" do
      data = @entity.retrieve_update_message
      data = @entity.retrieve_update_message
      data[:action].should == 'update'
      check_entity_attributes(@entity, 0, 0, 0, 0, 0, 0, {:data => data})
    end
  end

  describe "#simulate_movement" do
    it "should change x and y positions" do
      message = create_input_update(10, 10, 5, 50, 100, 100)
      @entity.update_attributes(message)
      @entity.simulate_movement
      check_entity_attributes(@entity, 10.5, 15, 15, 60, 100, 100)
    end
  end
end

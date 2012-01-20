load "../entity.rb"

def check_entity_attributes(entity, x, y, vx, vy, ax, ay)
  data = entity.inspect
  data[:x].should   == x
  data[:y].should   == y
  data[:vel].should == {:x=>vx, :y=>vy}
  data[:acc].should == {:x=>ax, :y=>ay}
end

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
      message = {
        :id => 42,
        :type => 'goomba',
        :x => 39,
        :y => 42,
        :vel => {:x=>111,:y=>333},
        :acc => {:x=>222,:y=>444}
      }
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 42, 111, 333, 222, 444)
    end

    it "should ignore keys that are missing" do
      message = {
        :x => 39,
        :y => 42,
        :vel => {:x=>111,:y=>333},
        :acc => {:x=>222,:y=>444}
      }
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 42, 111, 333, 222, 444)

      message = {
        :y => 0,
        :vel => {:x=>0,:y=>0},
      }
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 39, 0, 0, 0, 222, 444)

      message = {
        :x => 1,
        :acc => {:x=>1,:y=>1},
      }
      @entity.update_attributes(message)
      check_entity_attributes(@entity, 1, 0, 0, 0, 1, 1)
    end
  end

  describe "destroy_entity" do
    it "should remove the entity's existence from the table" do
      @entity.destroy
      Entity.entities.size.should == 0
    end
  end

end

load "../entity.rb"

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
      data = @entity.inspect
      data[:x].should   == 0
      data[:y].should   == 0
      data[:vel].should == {:x=>0, :y=>0}
      data[:acc].should == {:x=>0, :y=>0}
    end
  end

  describe "destroy_entity" do
    it "should remove the entity's existence from the table" do
      @entity.destroy
      Entity.entities.size.should == 0
    end
  end
end

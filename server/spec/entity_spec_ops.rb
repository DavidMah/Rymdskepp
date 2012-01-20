# Just has a bunch of helpers that many entity specs use

def check_entity_attributes(entity, x, y, vx, vy, ax, ay, options = {})
  data = (options[:data] or entity.inspect)
  data[:x].should   == x
  data[:y].should   == y
  data[:vel].should == {:x=>vx, :y=>vy}
  data[:acc].should == {:x=>ax, :y=>ay}
end

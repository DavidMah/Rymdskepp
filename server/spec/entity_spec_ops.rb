# Just has a bunch of helpers that many entity specs use

def check_entity_attributes(entity, x, y, vx, vy, ax, ay, options = {})
  data = (options[:data] or entity.inspect)
  data[:x].should   == x
  data[:y].should   == y
  data[:vel].should == {:x=>vx, :y=>vy}
  data[:acc].should == {:x=>ax, :y=>ay}
end

def create_input_update(x, y, vx, vy, ax, ay)
  data = {}
  data[:x] = x if x
  data[:y] = y if y
  data[:vel] = {:x=>vx, :y=>vy} if (vx and vy)
  data[:acc] = {:x=>ax, :y=>ay} if (ax and ay)
  data
end


Crafty.c("LocalPlayer", 
{
	init: function()
	{
		this.requires("Mover, Shooter, Keyboard, Mouse");
	},
	
	LocalPlayer: function()
	{
		this.bind("EnterFrame", this.localUpdate);
		this.bind("KeyDown", this.localClick);
		return this;
	},

	localUpdate: function(e)
	{
		var x = 0;
		var y = 0;
		if(this.isDown(Crafty.keys.W))
		{
			y -= 1;
		}
		if(this.isDown(Crafty.keys.A))
		{
			x -= 1;
		}
		if(this.isDown(Crafty.keys.S))
		{
			y += 1;
		}
		if(this.isDown(Crafty.keys.D))
		{
			x += 1;
		}
		
		var up = 0;
		var right = 0;
		if(this.isDown(Crafty.keys.UP_ARROW))
		{
			up -= 1;
		}
		if(this.isDown(Crafty.keys.LEFT_ARROW))
		{
			right -= 1;
		}
		if(this.isDown(Crafty.keys.DOWN_ARROW))
		{
			up += 1;
		}
		if(this.isDown(Crafty.keys.RIGHT_ARROW))
		{
			right += 1;
		}
		if(((up != 0) || (right != 0)) && (Date.now() - this.lastShot > this.fireRate))
		{
			var dir = Math.atan2(up, right);
			this.shoot(dir);
			this.lastShot = Date.now();
		}
		
		if(x != 0 || y != 0)
			this.addVel(x,y);
	}
});

Crafty.c("NetPlayer",
{
	init: function()
	{
		this.requires("Mover, Shooter");
	},
	
	NetPlayer: function()
	{
		return this;
	}
});

Crafty.c("Mover", 
{
	init: function()
	{
		this.requires("2D");
	},
	
	Mover: function(maxv, drag)
	{
		this.bind("EnterFrame", this.moverUpdate);
		this.lastTick = Date.now();
		this.maxv = {x:maxv, y:maxv};
		this.drag = {x:drag, y:drag};
		this.vel = {x:0, y:0};
		this.acc = {x:0, y:0};
		this.control = {x:0, y:0};
		this.speed = 2000;
		return this;
	},
	
	addVel: function(x,y)
	{
		// bounds to 1, -1, 0 if you pass in something else
		this.control.x = (x >= 1) ? 1 : ((x <= -1) ? -1 : 0);
		this.control.y = (y >= 1) ? 1 : ((y <= -1) ? -1 : 0);
	},
	
	moverUpdate: function(e)
	{
		// this gives the time since the last update
		// multiply by delta to get framerate independent movement
		var delta = (Date.now()-this.lastTick)/1000;
		
		// update velocity from outside sources and reset controls
		this.vel.x += this.control.x * this.speed * delta;
		this.vel.y += this.control.y * this.speed * delta;
		this.control.x = 0;
		this.control.y = 0;
		
		// add any acceleration
		this.vel.x += this.acc.x * delta;
		this.vel.y += this.acc.y * delta;
		
		// deltafy drag values
		var dx = this.drag.x * delta;
		var dy = this.drag.y * delta;
		
		// -dx v dx -- if velocity is between drag values, set it to zero
		// otherwise make velocity go closer to 0
		if(this.vel.x > dx)
			this.vel.x -= dx;
		else if(this.vel.x < -dx)
			this.vel.x += dx;
		else
			this.vel.x = 0;
		
		if(this.vel.y > dy)
			this.vel.y -= dy;
		else if(this.vel.y < -dy)
			this.vel.y += dy;
		else
			this.vel.y = 0;

		// bound the velocity at maximum
		if(this.vel.x > this.maxv.x)
			this.vel.x = this.maxv.x;
		if(this.vel.y > this.maxv.y)
			this.vel.y = this.maxv.y;
		
		if(this.vel.x < -this.maxv.x)
			this.vel.x = -this.maxv.x;
		if(this.vel.y < -this.maxv.y)
			this.vel.y = -this.maxv.y;
		
		// update the x and y values
		this.x += this.vel.x * delta; 
		this.y += this.vel.y * delta;
		
		this.lastTick = Date.now();
	}
});
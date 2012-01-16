Crafty.c("Shooter",
{
	init: function()
	{
		this.requires("Teammate");
		this.fireRate = 300;
		this.bulletSpeed = 400;
		this.lastShot = Date.now();
	},
	
	shoot: function(vel)
	{
		if(Date.now() - this.lastShot > this.fireRate)
		{
			var len = Math.sqrt(vel.x*vel.x+vel.y*vel.y);
			var dir = {x:vel.x/len, y:vel.y/len};
			/*
			var bullet = Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet")
				.attr({x:this.x+this.w/2-5, y:this.y+this.h/2-5, w:11, h:11})
				.Teammate(this.team)
				.Bullet(10, {x:dir.x*this.bulletSpeed, y:dir.y*this.bulletSpeed})
				.SendsData("bullet", ["x", "y", "vel"]); // bulletspeed
				*/
			msg = {};
			msg.action = "new";
			msg.type = "bullet";
			msg.x = this.x+this.w/2-5;
			msg.y = this.y+this.h/2-5;
			msg.vel = {x:dir.x*this.bulletSpeed, y:dir.y*this.bulletSpeed};
			msg.team = this.team;
			window.addToOutbox(msg);
			
			this.lastShot = Date.now();
		}
	}
});

Crafty.c("LocalPlayer", 
{
	init: function()
	{
		this.requires("Mover, Shooter, Keyboard, Mouse");
	},
	
	LocalPlayer: function()
	{
		this.bind("EnterFrame", this.localUpdate);
		this.mouseIsDown = false;
		this.mouseX = 0;
		this.mouseY = 0;
		Crafty.addEvent(this, Crafty.stage.elem, "mousedown", this.localClickDown);
		Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this.localClickMove);
		Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this.localClickUp);
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
			this.shoot({x:right, y:up});
		}
		
		if(x != 0 || y != 0)
			this.addVel(x,y);
			
		Crafty.viewport.x = -this.x + width/2;
		Crafty.viewport.y = -this.y + height/2;
		
		if(this.mouseIsDown)
			this.shoot({x:this.mouseX-(width/2), y:this.mouseY-(height/2)});	
	},
	
	localClickDown: function(e)
	{
		this.mouseIsDown = true;
		this.mouseX = e.offsetX;
		this.mouseY = e.offsetY;
	},
	
	localClickMove: function(e)
	{
		this.mouseX = e.offsetX;
		this.mouseY = e.offsetY;
	},
	
	localClickUp: function(e)
	{
		this.mouseIsDown = false;
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
		this.speed = 1000;
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
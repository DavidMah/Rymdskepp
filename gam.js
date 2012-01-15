var width = 400;
var height = 336;

Crafty.scene("menu", function()
{
	Crafty.background("#000");
	Crafty.sprite(1, "arts/ship1.png", {ship1Img:[0,0,19,27]});
	Crafty.sprite(24, "arts/ship2.png", {ship2Img:[0,0]});
	Crafty.sprite(24, "arts/ship3.png", {ship3Img:[0,0]});

	Crafty.load(["arts/ship1.png", "arts/ship2.png", "arts/ship3.png"], function(){
		Crafty.scene("main");
	});
	
	var title = Crafty.e("2D, DOM, Text");
	title.text("Loading!");
});

Crafty.scene("main", function()
{
	var title = Crafty.e("2D, DOM, Text");
	title.text("Rmydskepp!");
	
	var player1 = Crafty.e("DOM, Ship2, Mover, LocalPlayer, Healthy")
		.attr({x:50, y:50, z:50, w:19, h:27, name:"player"})
		.Mover(500, 500, 500, 500)
		.LocalPlayer();
	
	var alien1 = Crafty.e("DOM, Mover, Healthy, Ship3")
		.attr({x: 100, y:200, z:51, w:24, h:24, name:"alien"})
		.Mover(500, 500, 500, 500);
});

Crafty.c("Mover", 
{
	speed: 2000,
	vel: {x:0, y:0},
	acc: {x:0, y:0},
	maxv: {x:0, y:0},
	drag: {x:0, y:0},
	control: {x:0, y:0},
	lastTick: 0,
	
	init: function()
	{
		this.requires("2D, Tween");
	},
	
	Mover: function(maxv, drag)
	{
		this.bind("EnterFrame", this.moverUpdate);
		this.lastTick = Date.now();
		this.maxv.x = maxv;
		this.maxv.y = maxv;
		this.drag.x = drag;
		this.drag.y = drag;
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

Crafty.c("Healthy",
{});

Crafty.c("Shooter",
{
	init: function()
	{
	
	},
	
	shoot: function()
	{
		var bullet = Crafty.e("DOM, bulletImg, Mover");
	}
});


/* Things that have custom movement */
Crafty.c("LocalPlayer", 
{
	init: function()
	{
		this.requires("Mover, Shooter, Keyboard");
	},
	
	LocalPlayer: function()
	{
		this.bind("EnterFrame", this.localUpdate);
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
		
		if(x != 0 || y != 0)
			this.addVel(x,y);
	}
});

Crafty.c("NetPlayer",
{
// requires squishy mover
});


/* Animations */

Crafty.c("Ship2",
{
	init: function()
	{
		this.requires("ship2Img, SpriteAnimation")
		.animate("ship2Ani", [[0,0],[1,0],[2,0],[3,0],[4,0],[3,0],[2,0],[1,0]])
		.animate("ship2Ani", 10, -1);
	}
});

Crafty.c("Ship3",
{
	init: function()
	{
		this.requires("ship3Img, SpriteAnimation")
		.animate("ship3Ani", 0, 0, 7)
		.animate("ship3Ani", 4, -1);
	}
});
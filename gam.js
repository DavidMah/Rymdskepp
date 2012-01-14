var width = 400;
var height = 336;

Crafty.scene("menu", function()
{
	Crafty.background("#000");
	Crafty.sprite(1, "small1.png", {shipImg:[0,0,66,52]});

	Crafty.load(["small1.png"], function(){
		Crafty.scene("main");
	});
	
	var title = Crafty.e("2D, DOM, Text");
	title.text("Loading!");
});

Crafty.scene("main", function()
{
	var title = Crafty.e("2D, DOM, Text");
	title.text("Rmydskepp!");
	
	var player1 = Crafty.e("DOM, shipImg, Mover, LocalPlayer")
		.attr({x:50, y:50, z:50, w:66, h:52})
		.mover(50, 50, 50, 50);
});

Crafty.c("Mover", 
{
	vel: {x:0, y:0},
	acc: {x:0, y:0},
	maxv: {x:0, y:0},
	drag: {x:0, y:0},
	lastTick: 0,
	
	init: function()
	{
		this.requires("2D");
		this.bind("EnterFrame", this.enterframe);
		this.lastTick = Date.now();
	},
	
	mover: function(maxvx, maxvy, dragx, dragy)
	{
		this.maxv.x = maxvx;
		this.maxv.y = maxvy;
		this.drag.x = dragx;
		this.drag.y = dragy;
	},
	
	enterframe: function(e)
	{
		var delta = (Date.now()-this.lastTick)/1000;
					
		if(this.isDown(Crafty.keys.W))
		{
			this.vel.y -= this.speed;
		}
		if(this.isDown(Crafty.keys.A))
		{
			this.vel.x -= this.speed;
		}
		if(this.isDown(Crafty.keys.S))
		{
			this.vel.y += this.speed;
		}
		if(this.isDown(Crafty.keys.D))
		{
			this.vel.x += this.speed;
		}

		this.vel.x += this.acc.x * delta;
		this.vel.y += this.acc.y * delta;
		
		var dx = this.drag.x * delta;
		var dy = this.drag.y * delta;
		
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

		if(this.vel.x > this.maxv.x)
			this.vel.x = this.maxv.x;
		if(this.vel.y > this.maxv.y)
			this.vel.y = this.maxv.y;
		
		if(this.vel.x < -this.maxv.x)
			this.vel.x = -this.maxv.x;
		if(this.vel.y < -this.maxv.y)
			this.vel.y = -this.maxv.y;
				
		this.x += this.vel.x * delta; 
		this.y += this.vel.y * delta;
		
		this.lastTick = Date.now();
	}
});

Crafty.c("LocalPlayer",
{
	speed: 100,
	
	init: function()
	{
		this.requires("Keyboard, Mover");
		//.bind("KeyDown", this.keypressed)
		//.bind("KeyUp", this.keyreleased);
		//Crafty.viewport.x = this.x - width/2;
		//Crafty.viewport.y = this.y - height/2;
	},
	
	localPlayer: function()
	{
		
	},
	
	keypressed: function(e)
	{
		if(this.isDown(Crafty.keys.W))
		{
			this.vel.y -= this.speed;
		}
		if(this.isDown(Crafty.keys.A))
		{
			this.vel.x -= this.speed;
		}
		if(this.isDown(Crafty.keys.S))
		{
			this.vel.y += this.speed;
		}
		if(this.isDown(Crafty.keys.D))
		{
			this.vel.x += this.speed;
		}
	},
	
	keyreleased: function(e)
	{
		if(!this.isDown(Crafty.keys.W))
		{
			this.vel.y += this.speed;
		}
		if(!this.isDown(Crafty.keys.A))
		{
			this.vel.x += this.speed;
		}
		if(!this.isDown(Crafty.keys.S))
		{
			this.vel.y -= this.speed;
		}
		if(!this.isDown(Crafty.keys.D))
		{
			this.vel.x -= this.speed;
		}
	}
	// moves a ship
	// has a viewport
	// controlled by keyboard
});

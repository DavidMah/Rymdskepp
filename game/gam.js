var width = 800;
var height = 600;
var playing = false;
var handleMessage;

// Crafty Scenes

// The menu scene loads the images and then moves to the main scene
Crafty.scene("menu", function()
{
	Crafty.background("#000");
	
	loadImages();
	
	var title = Crafty.e("2D, DOM, Text");
	title.text("Loading!");
});

// The main scene just adds some basic level stuff and then lets the game play
Crafty.scene("main", function()
{
	var title = Crafty.e("2D, DOM, Text");
	title.text("Rymdskepp!");

	var alien1 = Crafty.e("Mover, Healthy, Ship3, Teammate")
		.attr({x: 100, y:200, w:24, h:24, z:51, name:"alien"})
		.Mover(500, 500)
		.Teammate(0);
		
	var player = Crafty.e("Ship2, Mover, LocalPlayer, Healthy")
		.attr({x:150, y:150, w:24, h:24, z:50, name:"player"})
		.Mover(500, 500)
		.LocalPlayer()
		.Teammate(msg.team);
});

/*
	Adds health to an entity
	Requires Teammate and Collision for interacting with things
	that might hurt it.
*/
Crafty.c("Healthy",
{
	init: function()
	{
		this.requires("Teammate, Collision");
		this.health = 100;
	},
	
	Healthy: function(hp)
	{
		this.health = hp;
		return this;
	}
});

/*
	Gives a team to an object, which can be used to be picky about collisions
	and stuff
*/
Crafty.c("Teammate",
{
	init: function(){},
	
	Teammate: function(team)
	{
		if(team == null) team = 0;
		this.team = team;
		return this;
	}
});

/*
	Small component for objects that should die after they are done animating
*/
Crafty.c("Effect",
{
	init: function()
	{
		this.require("SpriteAnimation");
		this.bind("AnimationEnd", function()
		{
			this.destroy();
		});
	},
});

/*
	Bullets hit things and make them die
	Requires Mover and Collision
	Hits objects on other teams that can take damage. This kills the bullet.
*/
Crafty.c("Bullet",
{
	init: function()
	{
		this.requires("Mover, Collision");
	},
	
	Bullet: function(dmg, vel)
	{
		this.dmg = dmg;
		this.delay(function(){
			if(this != null)
			{
				if(this.has("SendsData"))
					this.netKill();
				else
					this.kill();
			}
		}, 1500); // Lifetime
		this.Mover(10000, 0)
			.collision(new Crafty.circle(0,0,this.w))
			.onHit("Teammate Healthy", this.bulletHit);

		this.vel.x = vel.x;
		this.vel.y = vel.y;
		return this;
	},
	
	bulletHit: function(hitdata)
	{
		var healthy = hitdata[0].obj;
		if(this.team !== healthy.team)
		{
			healthy.health -= this.dmg;
			this.kill();
		}
	},
	
	// Call this if you are told to die
	kill: function()
	{
		Crafty.e("2D, Assplode, Effect")
			.attr({x:this.x, y:this.y});
			
		this.destroy();
	},
	
	// Call this to tell everyone else that you are going to die
	netKill: function()
	{
		Crafty.e("2D, Assplode, Effect")
			.attr({x:this.x, y:this.y});
		
		msg = {};
		msg.id = this.id;
		msg.action = "destroy";
		msg.type = "bullet";
		window.addToOutbox(msg);
		
		this.destroy();
	}
});

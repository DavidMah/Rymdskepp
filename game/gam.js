var width = 800;
var height = 600;
var playing = false;
var handleMessage;

//Crafty.canvas.init();

Crafty.scene("menu", function()
{
	Crafty.background("#000");
	
	loadImages();
	
	var title = Crafty.e("2D, DOM, Text");
	title.text("Loading!");
});

Crafty.scene("main", function()
{
	var title = Crafty.e("2D, DOM, Text");
	title.text("Rymdskepp!");

	var alien1 = Crafty.e("Mover, Healthy, Ship3, Teammate")
		.attr({x: 100, y:200, w:24, h:24, z:51, name:"alien"})
		.Mover(500, 500)
		.Teammate(0);
});

Crafty.c("Healthy",
{
	init: function()
	{
		this.requires("Teammate, Collision")
			.collision().onHit("Teammate Bullet", this.bulletHit);
	},
	
	Healthy: function(hp, arm)
	{
		this.health = hp;
		this.armor = arm;
		//this.collision(this.width, this.height);
		//this.onHit("Teammate Bullet", function(){});
	},
	
	bulletHit: function(hitdata)
	{
		var bullet = hitdata[0].obj;
		if(this.team != bullet.team)
		{
			this.health -= bullet.dmg;
			bullet.kill();
		}
	}
});

Crafty.c("Teammate",
{
	init: function(){},
	
	Teammate: function(team)
	{
		this.team = team;
		return this;
	}
});

Crafty.c("Ownable",
{
	init: function(){},
	
	Ownable: function(owner)
	{
		this.owner = owner;
	}
});

Crafty.c("Effect",
{
	init: function()
	{
		this.bind("AnimationEnd", function()
		{
			this.destroy();
		});
	},
});

Crafty.c("Bullet",
{
	init: function()
	{
		this.requires("Mover, Collision, SendsData");
	},
	
	Bullet: function(dmg, vel)
	{
		this.dmg = dmg;
		this.delay(this.kill, 1500); //lifetime
		this.Mover(10000, 0)
			.collision(new Crafty.circle(0,0,this.w));
			//.SendsData("player", ["x", "y", "vel"], msg.id);
		
		this.vel.x = vel.x;
		this.vel.y = vel.y;
		return this;
	},
	
	kill: function()
	{
		Crafty.e("2D, Assplode, Effect")
			.attr({x:this.x, y:this.y});
		this.destroy();
	}
});

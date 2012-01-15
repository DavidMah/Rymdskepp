var width = 800;
var height = 600;

Crafty.scene("menu", function()
{
	Crafty.background("#000");
	Crafty.sprite(1, "arts/ship1.png", {ship1Img:[0,0,19,27]});
	Crafty.sprite(24, "arts/ship2.png", {ship2Img:[0,0]});
	Crafty.sprite(24, "arts/ship3.png", {ship3Img:[0,0]});
	Crafty.sprite(5, "arts/redbullet.png", {redBullet:[0,0]});
	Crafty.sprite(5, "arts/bluebullet.png", {blueBullet:[0,0]});
	Crafty.sprite(11, "arts/greenbullet.png", {greenBullet:[0,0]}, 1);

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
	
	var player1 = Crafty.e("Ship2, Mover, LocalPlayer, Healthy")
		.attr({x:150, y:150, w:24, h:24, z:50, name:"player"})
		.Mover(500, 500, 500, 500)
		.LocalPlayer()
		.Teammate(1);
		
	var netPlayer = Crafty.e("DOM, ship1Img, Mover, NetPlayer, Healthy, Teammate")
		.attr({x:50, y:50, z:50, w:19, h:27, name:"netplayer"})
		.Mover(500, 500)
		.NetPlayer()
		.Teammate(2);
	
	var alien1 = Crafty.e("Mover, Healthy, Ship3, Teammate")
		.attr({x: 100, y:200, w:24, h:24, z:51, name:"alien"})
		.Mover(500, 500)
		.Teammate(0);
});

var netObjs = {};

var handleMessage = function(msg)
{
	switch(msg.action)
	{
		case "update":
			var obj = netObjs[msg.id];
			break;
		case "new":
			switch(msg.type)
			{
				case "bullet":
					Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet")
						.attr({x:msg.x, y:msg.y, w:11, h:11})
						.Teammate(this.team)
						.Bullet(10, 1000, dir);
					break;
			}
			break;
	}
};

Crafty.c("Healthy",
{
	init: function()
	{
		this.requires("Collision");
	},
	
	Healthy: function(hp, arm)
	{
		health = hp;
		armor = arm;
		//this.collision(this.width, this.height);
		//this.onHit("Teammate Bullet", function(){});
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

Crafty.c("Bullet",
{
	init: function()
	{
		this.requires("Mover");
	},
	
	Bullet: function(dm, s, dir)
	{
		this.dmg = dm;
		this.speed = s;
		this.delay(function(){this.destroy()}, 100);
		this.Mover(s, 0);
		
		this.vel.x = Math.cos(dir) * this.speed;
		this.vel.y = Math.sin(dir) * this.speed;
		return this;
	}
});

Crafty.c("Shooter",
{
	init: function()
	{
		this.requires("Teammate");
		this.fireRate = 10;
		this.lastShot = Date.now();
	},
	
	shoot: function(dir)
	{
		var bullet = Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet")
			.attr({x:this.x, y:this.y, w:11, h:11})
			.Teammate(this.team)
			.Bullet(10, 1000, dir);
	}
});
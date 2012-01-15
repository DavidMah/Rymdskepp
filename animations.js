Crafty.c("Ship2",
{
	init: function()
	{
		this.requires("DOM, ship2Img, SpriteAnimation")
		.animate("ship2Ani", [[0,0],[1,0],[2,0],[3,0],[4,0],[3,0],[2,0],[1,0]])
		.animate("ship2Ani", 10, -1)
		.attr({w:24,h:24});
	}
});

Crafty.c("Ship3",
{
	init: function()
	{
		this.requires("DOM, ship3Img, SpriteAnimation")
		.animate("ship3Ani", 0, 0, 7)
		.animate("ship3Ani", 4, -1)
		.attr({w:24,h:24});
	}
});

Crafty.c("GreenBullet",
{
	init: function()
	{
		this.requires("DOM, greenBullet, SpriteAnimation")
		.animate("greenBulletAni", [[0,0],[1,0],[2,0],[3,0],[2,0],[1,0]])
		.animate("greenBulletAni", 100, -1)
		.attr({w:11,h:11});
	}
});

Crafty.c("Assplode",
{
	init: function()
	{
		this.requires("DOM, assplode, SpriteAnimation")
		.animate("assplodeAni", [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0]])
		.animate("assplodeAni", 20, 1)
		.attr({w:12,h:12});
	}
});
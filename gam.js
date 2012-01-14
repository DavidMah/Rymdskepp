var width = 400;
var height = 336;

Crafty.scene("menu", function()
{
	Crafty.background("#000");
	var title = Crafty.e("2D, DOM, Text");
	title.text("Rymdskepp!");
});

Crafty.c("Ship", 
{
	_vel: {x:0, y:0},
	_acc: {x:0, y:0},
	
	init: function()
	{
		this.requires("2D, DOM");
	},
	
	ship: function()
	{
	}
});

Crafty.c("LocalPlayer",
{
	_drag:10,
	_speed:10,
	
	init: function()
	{
		this.requires("Keyboard");
		this.bind("KeyDown", this.keypressed);
		this.bind("KeyUp", this.keyreleased);
		Crafty.viewport.x = this.x - width/2;
		Crafty.viewport.y = this.y - height/2;
	},
	
	localPlayer: function()
	{
		
	},
	
	keypressed: function(k)
	{
		if(e.key == Crafty.keys.W)
		{
			
		}
		else if(e.key == Crafty.keys.A)
		{
		
		}
		else if(e.key == Crafty.keys.S)
		{

		}
		else if(e.key == Crafty.keys.D)
		{

		}
	},
	
	keyreleased: function(k)
	{
	
	}
	// moves a ship
	// has a viewport
	// controlled by keyboard
});

Crafty.c("NetPlayer",
{
	// moves a ship
	// controlled by net packets
});

var player1 = Crafty.e("Ship, LocalPlayer");
var code = "";

var netObjs = {};

var handleMessage = function(msgs)
{
	if(!playing) return;

	for(var key in msgs)
	{	
		var msg = msgs[key];
		
		switch(msg.action)
		{
			case "update":
				if(window.code == msg.code) return;
			
				// grab the object from the list
				var obj = netObjs[msg.id];
				if(obj == null)
				{
					buildNewEntity(msg);
					obj = netObjs[msg.id];
				}
				obj.trigger("NetUpdate", msg);
				break;
			case "new":
				buildNewEntity(msg);
				break;
			case "new_player":
			if(window.code != msg.code) return;
								
				var player1 = Crafty.e("Ship2, Mover, LocalPlayer, Healthy, SendsData")
					.attr({x:150, y:150, w:24, h:24, z:50, name:"player"})
					.Mover(500, 500)
					.LocalPlayer()
					.Teammate(1)
					.SendsData("player", ["x", "y", "vel"], msg.id);
				
				break;
		}
	}
};

var buildNewEntity = function(msg)
{
	switch(msg.type)
	{
		case "bullet":
			Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet, RecsData")
				.attr({x:msg.x, y:msg.y, w:11, h:11})
				.Teammate(0)
				.Bullet(10, msg.vel)
				.RecsData(msg);
			break;
		case "player":
			var netPlayer = Crafty.e("DOM, ship1Img, Mover, RecsData, Healthy, Teammate")
				.attr({x:msg.x, y:msg.y, z:50, w:19, h:27})
				.Teammate(2)
				.Mover(500, 500)
				.RecsData(msg);
			break;
	}
};

// use this to send data every sendDelay
Crafty.c("SendsData",
{
	init: function(){},
	
	SendsData: function(type, listofthings, id)
	{
		this.id = id;
		this.type = type;
		this.sendDelay = 100;
		this.lastSend = Date.now();
		this.sendProperties = listofthings;
		this.bind("EnterFrame", this.netUpdate);
		
		this.sentNew = false;

		return this;
	},
	
	netUpdate: function()
	{
		if(!this.sentNew)
		{
			this.sendNew();
			return;
		}
		if((this.lastSend + this.sendDelay) > Date.now()) return;
		
		var msg = {};
		msg["id"] = this.id;
		msg["action"] = "update";
		msg["type"] = this.type;
		for(var key in this.sendProperties)
		{
			msg[this.sendProperties[key]] = this[this.sendProperties[key]];
		}
		
		//console.log(msg);
		window.addToOutbox(msg);
	},
	
	sendNew: function()
	{	
		//send new message
		var msg = {};
		msg["id"] = this.id;
		msg["action"] = "new";
		msg["type"] = this.type;
		for(var key in this.sendProperties)
		{
			msg[this.sendProperties[key]] = this[this.sendProperties[key]];
		}
		
		//console.log(msg);
		window.addToOutbox(msg);
		
		this.sentNew = true;
	}
});

// use this to listen for data and update the object
Crafty.c("RecsData",
{
	init: function()
	{
		this.requires("Mover");
	},
	
	RecsData: function(msg)
	{
		for(var key in msg)
			this[key] = msg[key];
		netObjs[this.id] = this;
		this.bind("NetUpdate", this.recUpdate);
	},
	
	recUpdate: function(msg)
	{
		for(var key in msg)
			this[key] = msg[key];
	}
});
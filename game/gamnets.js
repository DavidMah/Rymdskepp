var code = "";

var netObjs = {};

var handleMessage = function(msgs)
{
	if(!playing) return;

	for(var key = 0; key < msgs.length; key++)
	{	
		var msg = msgs[key];
		
		switch(msg.action)
		{
			case "update":
				if(window.code === msg.code) break;
			
				// grab the object from the list
				var obj = netObjs[msg.id];
				if(obj == null)
				{
					buildNewRecver(msg);
					obj = netObjs[msg.id];
				}
				obj.trigger("NetUpdate", msg);
				break;
			case "new":
				if(window.code !== msg.code) break;
				buildNewSender(msg);
				break;
			case "new_player":
				if(window.code !== msg.code) break;
				buildNewSender(msg);
				break;
		}
	}
};

var buildNewSender = function(msg)
{
	switch(msg.type)
	{
		case "bullet":
			Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet, SendsData")
				.attr({x:msg.x, y:msg.y, w:11, h:11})
				.Teammate(msg.team)
				.Bullet(10, {x:msg.vel.x, y:msg.vel.y})
				.SendsData("bullet", ["x", "y", "vel", "team"], msg.id);
			break;
		case "player":			
			Crafty.e("Ship2, Mover, LocalPlayer, Healthy, SendsData")
				.attr({x:msg.x, y:msg.y, w:24, h:24, z:50, name:"player"})
				.Mover(500, 500)
				.LocalPlayer()
				.Teammate(msg.team)
				.SendsData("player", ["x", "y", "vel", "team"], msg.id);
			break;
	}
};

var buildNewRecver = function(msg)
{
	switch(msg.type)
	{
		case "bullet":
			Crafty.e("DOM, GreenBullet, Mover, Teammate, Bullet, RecsData")
				.attr({x:msg.x, y:msg.y, w:11, h:11})
				.Teammate(msg.team)
				.Bullet(10, msg.vel)
				.RecsData(msg);
			break;
		case "player":
			Crafty.e("Ship1, Mover, RecsData, Healthy, Teammate")
				.attr({x:msg.x, y:msg.y, z:50, w:19, h:27})
				.Teammate(msg.team)
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
		if((this.lastSend + this.sendDelay) > Date.now()) return;
		
		console.log("sending message");
		
		var msg = {};
		msg["id"] = this.id;
		msg["action"] = "update";
		msg["type"] = this.type;
		msg["tick"] = Date.now();
		for(var key in this.sendProperties)
		{
			msg[this.sendProperties[key]] = this[this.sendProperties[key]];
		}
		
		//console.log(msg);
		window.addToOutbox(msg);
		this.lastSend = Date.now();
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
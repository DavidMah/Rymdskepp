function testHealthy()
{
	function setUp()
	{
		obj = Crafty.e("Healthy");
	}
	function testInit()
	{
		assertEqual(100, obj.health);
		assertTrue(obj.has("Healthy"));
		assertTrue(obj.has("Teammate"));
		assertTrue(obj.has("Collision"));
	}
	function testConstructor()
	{
		obj = Crafty.e("Healthy")
			.Healthy(110);
		assertEqual(110, obj.health);
		obj = Crafty.e("Healthy")
			.Healthy(-500);
		assertEqual(-500, obj.health);
		obj = Crafty.e("Healthy")
			.Healthy(0.187);
		assertEqual(0.187, obj.health);
	}
	function testChangeHealth()
	{
		assertEqual(100, obj.health);
		obj.health -= 10;
		assertEqual(90, obj.health);
	}
}

function testTeammate()
{
	function setUp()
	{
		obj = Crafty.e("Teammate");
	}
	function testInit()
	{
		assertTrue(obj.has("Teammate"));
		assertEqual(1, obj.team);
	}
	
}

jsUnity.attachAssertions();
jsUnity.log = function(s) { console.log(s); };
jsUnity.run(testHealthy);
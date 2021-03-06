// Decare all commonly used objects as variables for easier use
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var world;
// 30 pixels on the canvas will represent 1 meter in Box2D space
var scale = 30;

var context;

var timeStep = 1/60;
var velocityIterations = 8;
var positionIterations = 3;

var specialBody;

function init()
{
	// the rate and direction objects will fall
	var gravity = new b2Vec2(0, 9.81);
	
	// allow objects that are at rest to be excuded from calcualtions to improve performance
	var allowSleep = true;
	
	// sets up the box2D world so it can be used for calculating the physics
	world = new b2World(gravity, allowSleep);
	
	createFloor();
	createRectangularBody();
	createCircularBody();
	createSimplePolygonBody();
	createComplexBody();
	createRevoluteJointBody();
	createSpecialBody();
	
	addContactListener();
	
	setupDebugDraw();
	animate();
}

function createFloor()
{
	// create and set all data for the rigid body
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	// in the midle (horizontaly)
	bodyDef.position.x = (640 / 2) / scale;
	// at the bottom of the canvas
	bodyDef.position.y = 450 / scale;
	
	// a fixture is used for attaching a shape to a body to detect if it has collided
	// creates and sets data for the objects fixture
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.2;
	
	fixtureDef.shape = new b2PolygonShape;
	// the floor box will be 640 x 20 pixels
	fixtureDef.shape.SetAsBox(320 / scale, 10 / scale);
	
	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);
}

function createRectangularBody()
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 40 / scale;
	bodyDef.position.y = 100 / scale;
	
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.3;
	
	fixtureDef.shape = new b2PolygonShape;
	fixtureDef.shape.SetAsBox(30 / scale, 50 / scale);
	
	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);
}

function createCircularBody()
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 130 / scale;
	bodyDef.position.y = 100 / scale;
	
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.7;
	
	fixtureDef.shape = new b2CircleShape(30 / scale);
	
	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);
}

function createSimplePolygonBody()
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 230 / scale;
	bodyDef.position.y = 50 / scale;
	
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.2;
	
	fixtureDef.shape = new b2PolygonShape;
	
	// create an array of points 
	// points must be defined in a clockwise direction
	// point 0, 0 will be t5he bodies origin and will appear at 230, 50 in world space
	var points = [
		new b2Vec2(0, 0),
		new b2Vec2(40 / scale, 50 / scale),
		new b2Vec2(50 / scale, 100 / scale),
		new b2Vec2(-50 / scale, 100 / scale),
		new b2Vec2(-40 / scale, 50 / scale),
	];
	
	// use SetAsArray to define the shape using the array of points
	fixtureDef.shape.SetAsArray(points, points.length);
	
	var body = world.CreateBody(bodyDef);
	var fixture = body.CreateFixture(fixtureDef);
}

function createComplexBody()
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 350 / scale;
	bodyDef.position.y = 50 / scale;
	// creates a empty body for the fixtures to be attached to
	var body = world.CreateBody(bodyDef);
	
	// create and attach a circular fixture to the body
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.5;
	fixtureDef.restitution = 0.7;
	fixtureDef.shape = new b2CircleShape(40 / scale);
	body.CreateFixture(fixtureDef);
	
	// create and attach a seccond polygon fixture to the body
	fixtureDef.shape = new b2PolygonShape;
	var points = [
		new b2Vec2(0, 0),
		new b2Vec2(40 / scale, 50 / scale),
		new b2Vec2(50 / scale, 100 / scale),
		new b2Vec2(-50 / scale, 100 / scale),
		new b2Vec2(-40 / scale, 50 / scale),
	];
	fixtureDef.shape.SetAsArray(points, points.length);
	body.CreateFixture(fixtureDef);
}

function createRevoluteJointBody()
{
	// define the first body
	var bodyDef1 = new b2BodyDef;
	bodyDef1.type = b2Body.b2_dynamicBody;
	bodyDef1.position.x = 480 / scale;
	bodyDef1.position.y = 50 / scale;
	var body1 = world.CreateBody(bodyDef1);
	
	// create a fixture to attach to body1
	var fixtureDef1 = new b2FixtureDef;
	fixtureDef1.density = 1.0;
	fixtureDef1.friction = 0.5;
	fixtureDef1.restitution = 0.5;
	fixtureDef1.shape = new b2PolygonShape;
	fixtureDef1.shape.SetAsBox(50 / scale, 10 / scale);
	
	body1.CreateFixture(fixtureDef1);
	
	// define the seccond body
	var bodyDef2 = new b2BodyDef;
	bodyDef2.type = b2Body.b2_dynamicBody;
	bodyDef2.position.x = 470 / scale;
	bodyDef2.position.y = 50 / scale;
	var body2 = world.CreateBody(bodyDef2);
	
	// create a seccond fixture to attach to body2
	var fixtureDef2 = new b2FixtureDef;
	fixtureDef2.density = 1.0;
	fixtureDef2.friction = 0.5;
	fixtureDef2.restitution = 0.5;
	fixtureDef2.shape = new b2PolygonShape;
	var points = [
		new b2Vec2(0, 0),
		new b2Vec2(40 / scale, 50 / scale),
		new b2Vec2(50 / scale, 100 / scale),
		new b2Vec2(-50 / scale, 100 / scale),
		new b2Vec2(-40 / scale, 50 / scale),
	];
	fixtureDef2.shape.SetAsArray(points, points.length);
	body2.CreateFixture(fixtureDef2);
	
	// creates a revolute joint between body1 & 2
	var jointDef = new b2RevoluteJointDef;
	var jointCenter = new b2Vec2(470 / scale, 50 / scale);
	jointDef.Initialize(body1, body2, jointCenter);
	world.CreateJoint(jointDef);
}

function createSpecialBody()
{
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = 450 / scale;
	bodyDef.position.y = 0 / scale;
	
	specialBody = world.CreateBody(bodyDef);
	specialBody.SetUserData({name : "special", life : 250})
	
	// create a fixture to attach to the special body
	var fixtureDef = new b2FixtureDef;
	fixtureDef.density = 1.0;
	fixtureDef.Friction = 0.5;
	fixtureDef.restitution = 0.5;
	
	fixtureDef.shape = new b2CircleShape(30 / scale);
	
	var fixture = specialBody.CreateFixture(fixtureDef);
}

function drawSpecialBody()
{
	// get the rigidbodies position and rotation
	var position = specialBody.GetPosition();
	var rotation = specialBody.GetAngle();
	
	// translate and rotate the context so drawings match the object they are being drawn on
	context.translate(position.x * scale, position.y * scale);
	context.rotate(rotation);
	
	// colour the circle
	context.fillStyle = "rgb(200, 150, 250);";
	context.beginPath();
	context.arc(0, 0, 30, 0, Math.PI * 2, false);
	context.fill();
	
	// draw two rectangular eyes
	context.fillStyle = "rgb(255, 255, 255);";
	context.fillRect = (-15, -15, 10, 5);
	context.fillRect = (5, -15, 10, 5);
	
	// draw a smile at high life and a frown at low life
	context.strokeStyle = "rgb(255, 255, 255);";
	context.beginPath();
	if (specialBody.GetUserData().life > 100)
	{
		context.arc(0, 0, 10, Math.PI, Math.PI * 2, true);
	}
	else
	{
		context.arc(0, 10, 10, Math.PI, Math.PI * 2, false);
	}
	context.stroke();
	
	// reset the context position and rotation
	context.rotate(-rotation);
	context.translate(-position.x * scale, -position.y * scale);
}

function addContactListener()
{
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.PostSolve = function (contact, impulse)
	{
		var body1 = contact.GetFixtureA().GetBody();
		var body2 = contact.GetFixtureB().GetBody();
		
		// if eather of the bodies is our specialBody, reduce it's life
		if (body1 == specialBody || body2 == specialBody)
		{
			var impulseAlongNormal = impulse.normalImpulses[0];
			specialBody.GetUserData().life -= impulseAlongNormal;
			console.log("Special body colided with impulse ", impulseAlongNormal, " and it's life is now ", specialBody.GetUserData().life);
		}
	};
	
	// listener function will now be run whenever a colision occours in world
	world.SetContactListener(listener);
}

function setupDebugDraw()
{
	context = document.getElementById('canvas').getContext('2d');
	
	var debugDraw = new b2DebugDraw();
	
	// specify the canvas to be used for drawing debug shapes
	debugDraw.SetSprite(context);
	// set the scale used
	debugDraw.SetDrawScale(scale);
	// set the boxes to be mostly transparent
	debugDraw.SetFillAlpha(0.3);
	// set the lines drawn to have a thickness of 1 pixel
	debugDraw.SetLineThickness(1.0);
	// display all shapes and joints
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	// start using the debug draw in the world
	world.SetDebugDraw(debugDraw);
}

function animate()
{
	world.Step(timeStep, velocityIterations, positionIterations);
	world.ClearForces();
	
	world.DrawDebugData();
	
	// if the special body exists draw a face on it (^.^)
	if (specialBody)
	{
		drawSpecialBody();
	}
	
	// remove special body if it exists and has run out of health
	if (specialBody && (specialBody.GetUserData().life <= 0))
	{
		world.DestroyBody(specialBody);
		specialBody = undefined;
		console.log("Special body destroyed");
	}
	
	// will run the animate function again after 1/60th of a seccond
	setTimeout(animate, timeStep);
}


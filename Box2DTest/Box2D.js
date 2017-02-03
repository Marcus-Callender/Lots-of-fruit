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

function init()
{
	// the rate and direction objects will fall
	var gravity = new b2Vec2(0, 9.81);
	
	// allow objects that are at rest to be excuded from calcualtions to improve performance
	var allowSleep = true;
	
	// sets up the box2D world so it can be used for calculating the physics
	world = new b2World(gravity, allowSleep);
}


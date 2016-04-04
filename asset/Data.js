// ////////////////////////////////////////// WEAPONERY ///////////////////////////////////////////

function weapon() {
	// Basic statistics
	this.baseFireRate;
	this.baseHeatCost;
	this.baseDamage;
	this.baseProjectileSpeed;
	this.baseImpactArea;
	this.size;
	this.collisionType = COLLISION_TYPE_SPHERE;
	// Advanced statistics
	this.collideType;
	this.collidableWith;
	this.baseProjectileDecay;
	this.homing = false;
	this.homingSpeed = 1;
	this.pierce = 0;
	this.baseProjectileNumber = 1;
	
	this.orientationProjectileMatrix = function(nbProjectile) {
		return {a:0,x:0,y:0,d:0};
	}
	
	this.init = function(weaponType, level, support) {
		this.weaponType = weaponType;
		if(weaponType == WEAPON_TYPE_SPREAD) {
			this.baseFireRate = 200;
			this.baseHeatCost = 12;
			this.baseDamage = 5;
			this.baseProjectileSpeed = 1.5;
			this.baseProjectileDecay = 5000;
			this.size = 3;
		}
		if(weaponType == WEAPON_TYPE_LASER) {
			this.baseFireRate = 350;
			this.baseHeatCost = 25;
			this.baseDamage = 16;
			this.baseProjectileSpeed = 3;
			this.baseProjectileDecay = 1000;
			this.size = 3;
			this.collisionType = COLLISION_TYPE_BOX;
			this.width = 3;
			this.height = 3;
			this.pierce = 50;
		}
		if(weaponType == WEAPON_TYPE_HOMING) {
			this.baseFireRate = 500;
			this.baseHeatCost = 20;
			this.baseDamage = 15;
			this.baseProjectileSpeed = 1.1;
			this.baseProjectileDecay = 15000;
			this.baseImpactArea=15;
			this.homing = true;
			this.homingSpeed = 0.025;
			this.size = 2;
		}
		if(weaponType == WEAPON_TYPE_WAVE) {
			this.baseFireRate = 300;
			this.baseHeatCost = 15;
			this.baseDamage = 5;
			this.baseProjectileSpeed = 1.2;
			this.baseProjectileDecay = 3000;
			this.size = 8;
			this.collisionType = COLLISION_TYPE_BOX;
			this.width = 8;
			this.height = 2;
			this.pierce = 100;
			this.expandFactor = 2.5;
			// Allow the launch of two projectiles with a different orientation angle and shifted to the side
			this.baseProjectileNumber = 2;
			this.orientationProjectileMatrix = function(nbProjectile) {
				return {a:- Math.PI / 4 * (1 - 2 * nbProjectile) ,
						x:0,
						y:this.width / 4 * Math.sqrt(2)  * (1 - 2 * nbProjectile),
						d:this.expandFactor
				};
			}
		}
		if(weaponType == WEAPON_TYPE_DISCHARGE) {
			this.baseFireRate = 600;
			this.baseHeatCost = 40;
			this.baseDamage = 15;
			this.baseProjectileSpeed = 2.7;
			this.baseProjectileDecay = 750;
			this.baseProjectileNumber = 4;
			this.size = 0;
			this.randomPath = true;
		}
		if(weaponType == WEAPON_TYPE_DISRUPTOR) {
			this.baseFireRate = 300;
			this.baseHeatCost = 15;
			this.baseDamage = 5;
			this.baseProjectileSpeed = 0;
			this.baseProjectileDecay = 100;
			this.size = 110;
		}
	}
}

// /////////////////////////////////////// END OF WEAPONERY ///////////////////////////////////////
// /////////////////////////////////////////// ARMOURY ////////////////////////////////////////////

var HULL_TRANSPORT = {name: "Transport", code: "TN", width: 2, height: 4, radius: 2, collisionType: COLLISION_TYPE_BOX, terminalVelocity: 40, shieldCapacity:40, heatCapacity:25, armour:5, mainModule:4, subModule: 2};
var HULL_CRUISER = {name: "Croiseur", code: "CR", width: 15, height: 12, radius: 8, collisionType: COLLISION_TYPE_BOX, terminalVelocity:25 , shieldCapacity:125, heatCapacity:50, armour:15, mainModule:5, subModule: 4};
var HULL_ASSAULT = {name: "Assaut", code: "AT", width: 20, height: 6, radius: 10, collisionType: COLLISION_TYPE_BOX, terminalVelocity:20 , shieldCapacity:150, heatCapacity:200, armour:5, mainModule:6, subModule: 6};
var HULL_SCOUT = {name: "Éclaireur", code: "SC", width: 6, height: 6, radius: 3, collisionType: COLLISION_TYPE_SPHERE, terminalVelocity:30 , shieldCapacity:40, heatCapacity:40, armour:5, mainModule:4, subModule: 6};
var HULL_WHISP = {name: "Furtif", code: "WP", width: 2, height: 2, radius: 1, collisionType: COLLISION_TYPE_SPHERE, terminalVelocity:50 , shieldCapacity:25, heatCapacity:100, armour:0, mainModule:4, subModule: 4};
var HULL_DESTROYER = {name: "Destroyer", code: "DT", width: 10, height: 10, radius: 5, collisionType: COLLISION_TYPE_SPHERE, terminalVelocity:20 , shieldCapacity:100, heatCapacity:125, armour:10, mainModule:6, subModule: 2};
var HULL_BOMBER = {name: "Cuirassier", code: "BB", width: 30, height: 14, radius: 15, collisionType: COLLISION_TYPE_BOX, terminalVelocity:12 , shieldCapacity:200, heatCapacity:100, armour:20, mainModule:6, subModule: 4};

var WEAPON_TYPE_SPREAD = 1;
var WEAPON_TYPE_LASER = 2;
var WEAPON_TYPE_HOMING = 3;
var WEAPON_TYPE_WAVE = 4;
var WEAPON_TYPE_DISCHARGE = 5;
var WEAPON_TYPE_ = 6;
var WEAPON_TYPE_DISRUPTOR = 7;
var WEAPON_TYPE_DRONE = 8;

function armoury() {
	
}
// //////////////////////////////////////// END OF ARMOURY ////////////////////////////////////////
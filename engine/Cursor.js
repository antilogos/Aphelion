
// //////////////////////////////////////////// CURSOR ////////////////////////////////////////////

Cursor.prototype = new BoardElement();
Cursor.prototype.constructor = Cursor;

function Cursor() {
	// Mouse position defines target wanted velocity
	this.mouseX;
	this.mouseY;
	// Rubber banding factor : smooth inertia around 4, superior to 5 = no rubber banding
	this.accelerationCap = 50;
	// Translate distance of mouse in pixel to velocity : smooth velocity around 0.3, 
	this.pointToVelocity = 0.2;
	this.collisionType;
	this.shieldCapacity;
	this.heatCapacity;
	this.terminalVelocity;
	// Define by Hull: width height radius
	this.hull;
	// Weaponery
	this.lastFire = 0;
	this.heat = 100;
	this.heatDissipation = 1.25;
	this.firing = false;
	this.mountedWeapon;
	// Colliding data
	this.collideType = COLLISION_MASK_CURSOR;
	this.collidableWith = COLLISION_MASK_WEAPON_PASSERBY;
	this.shieldRepair = 1.125;
	this.shield = 100;
	
	this.notable = 51; // 1 = Danmaku, 2 = Dreadnaugh, 4 = Afterburner, 8 = Emergencydrive, 16 = Inertiacore, 32 = Autofire, 64 = Powerrouting
	
	this.init = function () {
		this.mountedWeapon = new weapon();
		this.hull = HULL_WHISP;
	}
	
	this.updateConfiguration = function () {
		this.width = this.hull.width;
		this.height = this.hull.height;
		this.radius = this.hull.radius;
		this.collisionType = this.hull.collisionType;
		this.shieldCapacity = this.hull.shieldCapacity;
		this.heatCapacity = this.hull.heatCapacity;
		this.terminalVelocity = this.hull.terminalVelocity;
		if(this.notable / 1 & 1) {
			// Danmaku
			this.heatCapacity += this.hull.shieldCapacity;
			this.heatDissipation += this.shieldRepair;
			this.shieldCapacity = 1;
			this.shield = 1;
			this.shieldRepair = 0;
		}
		this.mountedWeapon.init(WEAPON_TYPE_DISCHARGE,1,'');
	}
	
	this.deployScene = function () {
		this.mouseX = engine.mainCanvas.clientWidth/2;
		this.mouseY = engine.mainCanvas.clientHeight/2;
		this.updateConfiguration();
	}
	
	this.move = function() {
		// Clear cusor at center
		this.context.clearRect( (engine.mainCanvas.clientWidth - this.width - 30)/2, (engine.mainCanvas.clientHeight - this.height - 30)/2, this.width + 30, this.height + 30);
		
		// Actualize Time
		var updateTime = Date.now() - this.lastseen;
		this.lastseen = Date.now();
		// Make the acceleration not suffer from framerate drop
		var latencyExpectation = Math.min(updateTime/60,1);
		
		// Calculate differential movement
		// DEBUG test with raw velocity (1 px = 1 velocity)
		var diffX = ((this.mouseX-engine.mainCanvas.clientWidth/2) * this.pointToVelocity) - this.velocityH;
		var diffY = ((this.mouseY-engine.mainCanvas.clientHeight/2) * this.pointToVelocity) - this.velocityV;
		var diffT = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
		var diffH = diffT==0 ? diffT : Math.min(diffT, this.accelerationCap) / diffT * diffX * latencyExpectation;
		var diffV = diffT==0 ? diffT : Math.min(diffT, this.accelerationCap) / diffT * diffY * latencyExpectation;
		
		// Compute Velocity
		if(this.notable / 2 & 1 && this.firing) {
			// dreadnaugh mode does not change trajectory
		} else {
			if(this.notable / 16 & 1) {
				// inertiacore does not suffer inertia
				this.velocityH = (this.mouseX-engine.mainCanvas.clientWidth / 2) * this.pointToVelocity * latencyExpectation;
				this.velocityV = (this.mouseY-engine.mainCanvas.clientHeight / 2) * this.pointToVelocity * latencyExpectation;
			} else {
				this.velocityH += diffH;
				this.velocityV += diffV;
			}
		}
		
		// Normalize Velocity
		var normal = Math.sqrt(Math.pow(this.velocityH,2)+Math.pow(this.velocityV,2));
		if(normal > this.terminalVelocity) {
			if(this.notable / 4 & 1 && normal > this.terminalVelocity) {
				// afterburner increase range of acceleration at the cost of heat
				if(this.heat > (normal/this.terminalVelocity - 1) * this.heatCapacity / 50) {
					this.heat = this.heat - (normal/this.terminalVelocity - 1) * this.heatCapacity / 50;
					this.velocityH = this.terminalVelocity*Math.min(normal/this.terminalVelocity,1.5) / normal * this.velocityH;
					this.velocityV = this.terminalVelocity*Math.min(normal/this.terminalVelocity,1.5) / normal * this.velocityV;
				} else {
					this.velocityH = this.terminalVelocity / normal * this.velocityH;
					this.velocityV = this.terminalVelocity / normal * this.velocityV;
				}
			} else {
				this.velocityH = this.terminalVelocity / normal * this.velocityH;
				this.velocityV = this.terminalVelocity / normal * this.velocityV;
			}
		} else if(this.notable / 16 & 1) {
			// inertiacore is always at max speed
			if(normal != 0) {
				this.velocityH = this.terminalVelocity / normal * this.velocityH;
				this.velocityV = this.terminalVelocity / normal * this.velocityV;
			} else {
				this.velocityH = 0;
				this.velocityV = 0;
			}
		}
				
		// Compute Displacement
		this.positionH += (this.velocityH * updateTime * ENGINE_TIME_TO_PIXEL_CELERITY);
		this.positionV += (this.velocityV * updateTime * ENGINE_TIME_TO_PIXEL_CELERITY);
		
		// Firing
		if(this.firing) {
			this.manageFire();
		}
		if(this.heat < this.heatCapacity) {
			this.heat = Math.min(this.heat + this.heatDissipation * updateTime / 60, this.heatCapacity);
		}
		
		// Shield
		if(this.shield < this.shieldCapacity) {
			this.shield = Math.min(this.shield + this.shieldRepair * updateTime / 60, this.shieldCapacity);
			if(this.notable / 8 & 1 && this.shield < this.shieldCapacity / 2) {
				// emergencydrive double repair speed while under halved shield
				this.shield = Math.min(this.shield + this.shieldRepair * updateTime / 60, this.shieldCapacity);
			}
		}
		
		// Redraw cursor at center
		this.context.beginPath();
		this.context.arc(engine.mainCanvas.clientWidth / 2, engine.mainCanvas.clientHeight / 2, this.radius, 0, 2 * Math.PI, false);
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#330000';
		this.context.stroke();
		
		// emergencydrive effect
		if(this.notable / 8 & 1 && this.shield < this.shieldCapacity / 2) {
			this.context.beginPath();
			this.context.arc(engine.mainCanvas.clientWidth / 2, engine.mainCanvas.clientHeight / 2, this.radius+3, (this.lastseen/100)%(2 * Math.PI), (this.lastseen/100)%(2 * Math.PI)+Math.PI/3, false);
			this.context.lineWidth = 2;
			this.context.strokeStyle = '#AA55AA';
			this.context.stroke();
			this.context.beginPath();
			this.context.arc(engine.mainCanvas.clientWidth / 2, engine.mainCanvas.clientHeight / 2, this.radius+3, (this.lastseen/100)%(2 * Math.PI)+Math.PI, (this.lastseen/100)%(2 * Math.PI)+Math.PI/3+Math.PI, false);
			this.context.lineWidth = 2;
			this.context.strokeStyle = '#AA55AA';
			this.context.stroke();
		}
		
		// Scroll background
		engine.background.draw();
		
		// heat bar
		// Create gradient
		gradient = engine.bgContext.createLinearGradient(10, 0, 10+100*this.heat/this.heatCapacity, 0);
		gradient.addColorStop(0, "#ff0000");
		gradient.addColorStop(1, "#ffff00");
		engine.bgContext.fillStyle = gradient;
		// Fill rectangle with gradient
		engine.bgContext.fillRect(10, 300, 100*this.heat/this.heatCapacity, 10);
		
		// shield bar
		// Create gradient
		gradient = engine.bgContext.createLinearGradient(560-(100*this.shield/this.shieldCapacity), 300, 560, 300);
		gradient.addColorStop(1, "#ff00ff");
		gradient.addColorStop(0, "#00ffff");
		engine.bgContext.fillStyle = gradient;
		// Fill rectangle with gradient
		engine.bgContext.fillRect(560-(100*this.shield/this.shieldCapacity), 300, 100*this.shield/this.shieldCapacity, 10);
	};
	
	this.manageFire = function() {
		var reloadTime = this.mountedWeapon.baseFireRate;
		if(this.notable / 2 & 1 && this.firing) {
			// dreadnaugh mode double firing speed
			reloadTime = reloadTime/2;
		}
		if(this.notable / 8 & 1 && this.shield < this.shieldCapacity / 2) {
			// emergencydrive reduce firing speed while under halved shield
			reloadTime = reloadTime*2;
		}
		if(Date.now() - this.lastFire > reloadTime) {
			if(this.heat > this.mountedWeapon.baseHeatCost) {
				this.lastFire = Date.now();
				var aim = {x: this.velocityH * this.mountedWeapon.baseProjectileSpeed,
							y: this.velocityV * this.mountedWeapon.baseProjectileSpeed};
				engine.projectilePool.spawn(this, this.mountedWeapon, aim);
				this.heat -= this.mountedWeapon.baseHeatCost;
			}
		}
		this.hasFired 
	};
	
	this.collide = function(objects) {
		damage = 0 || objects.damage;
		if(this.notable / 64 & 1 && this.heat > damage * 0.3) {
			// powerrouting route 30% of shield damage to heat 
			this.heat = this.heat - damage *0.3;
			damage = damage * 0.7;
		}
		if(this.shield > 0) {
			this.shield = Math.max(this.shield-damage,0);
		}
	};
}

// ///////////////////////////////////////// END OF CURSOR ////////////////////////////////////////
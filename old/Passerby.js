// /////////////////////////////////////// PASSERBY FACTORY ///////////////////////////////////////

function PasserbyFactory() {
	this.pool = [];
	var size = 10000;
	
	this.init = function() {
		for(var i=0; i<size; i++) {
			var passerby = new Passerby();
			this.pool[i] = passerby;
		}
	};
	
	this.spawn = function(x, y, vx, vy) {
		if(!this.pool[size - 1].alive) {
			this.pool[size - 1].spawn(x,y,vx, vy);
			this.pool.unshift(this.pool.pop());
		}
	};
	
	this.discard = function(object) {
		object.alive = false;
		this.pool.push(this.pool.splice(this.pool.lastIndexOf(object),1)[0]);
	}
	
	this.draw = function() {
		for(var i=0; i<size && this.pool[i].alive; i++) {
			this.pool[i].move();
		}
	};
	
	this.getAlivePool = function() {
		var obj = [];
		for(var i=0; i<size && this.pool[i].alive; i++) {
			obj.push(this.pool[i]);
		}
		return obj;
	};
}

// //////////////////////////////////// END OF PASSERBY FACTORY ///////////////////////////////////
// /////////////////////////////////////////// PASSERBY ///////////////////////////////////////////

Passerby.prototype = new BoardElement();
Passerby.prototype.constructor = Passerby;

function Passerby() {
	this.lockClock = 0;
	// Cursor image size
	this.width = 9;
	this.height = 9;
	this.radius = 4;
	// Colliding data
	this.collisionType = COLLISION_TYPE_SPHERE;
	this.collideType = COLLISION_MASK_PASSERBY;
	this.collidableWith = COLLISION_MASK_CURSOR;
	//
	this.lastFire = 0;
	this.mountedWeapon;
	this.target = engine.cursor;
	
	this.spawn = function(x,y,vx,vy) {
		this.alive=true;
		this.lastseen = Date.now();
		this.positionH = x;
		this.positionV = y;
		this.velocityH = -vx;
		this.velocityV = -vy;
		this.mountedWeapon = new weapon();
		this.mountedWeapon.init(Math.ceil(Math.random()*4),1,'');
	}
	
	this.move = function() {
			// Compute Steering behaviour
			var safeDistance = 150;
			var distanceRemaining = Math.sqrt(Math.pow(this.positionH - this.target.positionH,2)+Math.pow(this.positionV - this.target.positionV,2));
			var fleeOrFollowFactor;
			if(distanceRemaining > safeDistance) {
				fleeOrFollowFactor = Math.max(safeDistance - distanceRemaining, -safeDistance/3) / safeDistance * 3;
			} else {
				fleeOrFollowFactor = Math.min(safeDistance - distanceRemaining, safeDistance/3) / safeDistance * 3;
			}
			var diffX = (this.positionH - this.target.positionH);
			var diffY = (this.positionV - this.target.positionV);
			var normal = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
			var slowBeforeArrival = Math.min(Math.sqrt(Math.pow(safeDistance-normal,2)) / this.terminalVelocity,1);
			diffX = diffX * (this.terminalVelocity / normal) * slowBeforeArrival;
			diffY = diffY * (this.terminalVelocity / normal) * slowBeforeArrival;
			if(distanceRemaining > safeDistance) {
				diffX = -diffX;
				diffY = -diffY;
			}
			// Compute Orbiting behaviour
			if(this.lockClock == 0) {
				if(Math.random()*2 >= 1) {
					this.lockClock = 1;
				} else {
					this.lockClock = -1;
				}
			}
			if(this.lockClock == 1) {
				var orbitX = (this.target.positionV - this.positionV);
				var orbitY = (this.positionH - this.target.positionH);
			} else {
				var orbitX = (this.positionV - this.target.positionV);
				var orbitY = (this.target.positionH - this.positionH);
			}
			normal = Math.sqrt(Math.pow(orbitX,2)+Math.pow(orbitY,2));
			if(normal > this.terminalVelocity) {
				orbitX = orbitX * this.terminalVelocity / normal;
				orbitY = orbitY * this.terminalVelocity / normal;
			}
			// Compute new optimal Velocity
			this.velocityH = diffX / 2 + orbitX / 2 + this.velocityH * fleeOrFollowFactor;
			this.velocityV = diffY / 2 + orbitY / 2 + this.velocityV * fleeOrFollowFactor;
			// Normalize Velocity
			normal = Math.sqrt(Math.pow(this.velocityH,2)+Math.pow(this.velocityV,2));
			if(normal > this.terminalVelocity) {
				this.velocityH = this.terminalVelocity / normal * this.velocityH;
				this.velocityV = this.terminalVelocity / normal * this.velocityV;
			}
			
			var relativeX = this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
			var relativeY = this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2
			
			if(relativeX > -this.width/2 && relativeX < engine.mainCanvas.clientWidth + this.width/2
				&& relativeY > -this.height/2 && relativeY < engine.mainCanvas.clientHeight + this.width/2) {
				// Redraw passerby at center
				engine.mainContext.beginPath();
				engine.mainContext.arc(this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2, this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2, this.radius, 0, 2 * Math.PI, false);
				engine.mainContext.lineWidth = 1;
				if(this.color) {
					engine.mainContext.strokeStyle = this.color;
				} else {
					engine.mainContext.strokeStyle = '#0000FF';
				}
				engine.mainContext.stroke();
			}
			this.colliding = false;
			this.manageFire();
	};
	
	this.manageFire = function() {
		if(this.lastFire == 0) {
			this.lastFire = Date.now();
		}	
		var reloadTime = this.mountedWeapon.baseFireRate*25*Math.exp(1-Math.random());
		if(Date.now() - this.lastFire > reloadTime) {
			this.lastFire = Date.now();
			var aim = {x:0, y:0};
			var aimingH = (this.target.positionH - this.positionH);
			var aimingV = (this.target.positionV - this.positionV);
			var normal = Math.sqrt(Math.pow(aimingH,2)+Math.pow(aimingV,2));
			aim.x = aimingH * this.terminalVelocity / normal / 3 * this.mountedWeapon.baseProjectileSpeed;
			aim.y = aimingV * this.terminalVelocity / normal / 3 * this.mountedWeapon.baseProjectileSpeed;
			engine.projectilePool.spawn(this, this.mountedWeapon, aim);
		}
	}
	
	this.collide = function(objects) {
		this.colliding = true;
		engine.passerbyPool.discard(this);
	};
}

// //////////////////////////////////////// END OF PASSERBY ///////////////////////////////////////
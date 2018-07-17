// ////////////////////////////////////// PROJECTILE FACTORY //////////////////////////////////////

function ProjectileFactory() {
	this.pool = [];
	
	this.init = function() {
		for(var i=0; i<1000; i++) {
			var projectile = new Projectile();
			this.pool[i] = projectile;
		}
	};
	
	this.spawn = function(cursor, weapon, aim) {
		for(var i=0; i<weapon.baseProjectileNumber; i++) {
			if(!this.pool[this.pool.length - 1].alive) {
				this.pool[this.pool.length - 1].spawn(cursor, weapon, aim, weapon.orientationProjectileMatrix(i));
				this.pool.unshift(this.pool.pop());
			} else {
				var projectile = new Projectile();
				projectile.spawn(cursor, weapon, aim, weapon.orientationProjectileMatrix(i));
				this.pool.unshift(projectile);
			}
		}
	};
	
	this.discard = function(object) {
		object.alive = false;
		this.pool.push( this.pool.splice(this.pool.lastIndexOf(object),1)[0]);
		if(object.animation) {
			object.animation.velocityH = 0;
			object.animation.velocityV = 0;
		}
	}
	
	this.draw = function() {
		engine.mainContext.clearRect(0,0,engine.mainCanvas.clientWidth,engine.mainCanvas.clientHeight);
		for(var i=0; i<this.pool.length && this.pool[i].alive; i++) {
			this.pool[i].move();
		}
	};
	
	this.getAlivePool = function() {
		var obj = [];
		for(var i=0; i<this.pool.length && this.pool[i].alive; i++) {
			obj.push(this.pool[i]);
		}
		return obj;
	};
}

// /////////////////////////////////// END OF PROJECTILE FACTORY //////////////////////////////////
// ////////////////////////////////////////// PROJECTILE //////////////////////////////////////////

Projectile.prototype = new BoardElement();
Projectile.prototype.constructor = Projectile;

function Projectile() {
	this.type;
	// Colliding data
	this.aimType = 0;
	this.collideType = COLLISION_MASK_WEAPON_CURSOR;
	this.collidableWith = COLLISION_MASK_PASSERBY;
	// Projectile data
	this.damage = 10;
	this.areaOfEffect = 0;
	this.recalculationFactor = 1;
	this.pierce = 0;
	
	this.spawn = function(objectFiring, weapon, aim, orientationDiff) {
		this.alive=true;
		this.startT = Date.now();
		this.lastseen = Date.now();
		this.decay = weapon.baseProjectileDecay;
		if(orientationDiff.d != 0) {
			// Compute angle from expanding size and distance travelled
			var angleE =  Math.atan((Math.sqrt(Math.pow(aim.x , 2) + Math.pow(aim.y , 2)) * this.decay * ENGINE_TIME_TO_PIXEL_CELERITY * 4) / (Math.sqrt(2) * weapon.width * orientationDiff.d));
			var angle1 =  Math.atan((Math.sqrt(Math.pow(aim.x , 2) + Math.pow(aim.y , 2)) * this.decay * ENGINE_TIME_TO_PIXEL_CELERITY * 4) / (Math.sqrt(2) * weapon.width ));
			var theta = (angleE - angle1) * (Math.abs(orientationDiff.a ) / orientationDiff.a );
			// Reorient velocity direction
			this.velocityH = (Math.cos(theta ) * aim.x - Math.sin(theta ) * aim.y );
			this.velocityV = (Math.sin(theta ) * aim.x + Math.cos(theta ) * aim.y );
		} else { 
			this.velocityH = aim.x;
			this.velocityV = aim.y;
		}
		this.orientation = orientationDiff.a;
		this.collisionType = weapon.collisionType;
		this.type = objectFiring.collideType;
		this.pierce = weapon.pierce;
		if(this.collisionType == COLLISION_TYPE_BOX) {
			this.width = weapon.width;
			this.height = weapon.height;
			var theta = Math.atan(this.velocityV / this.velocityH);
			this.positionH = objectFiring.positionH + ((Math.cos(theta) * orientationDiff.x - Math.sin(theta) * orientationDiff.y ) * Math.abs(this.velocityH ) / this.velocityH );
			this.positionV = objectFiring.positionV + ((Math.sin(theta) * orientationDiff.x + Math.cos(theta) * orientationDiff.y ) * Math.abs(this.velocityH ) / this.velocityH );
		} else {
			this.positionH = objectFiring.positionH;
			this.positionV = objectFiring.positionV;
			this.width = weapon.size*2+1;
			this.height = weapon.size*2+1;
		}
		this.radius = weapon.size;
		if(weapon.baseImpactArea) {
			this.areaOfEffect = weapon.baseImpactArea;
		} else {
			this.areaOfEffect = 0;
		}
		if(this.type == COLLISION_MASK_CURSOR) {
			this.collideType = COLLISION_MASK_WEAPON_CURSOR;
			this.collidableWith = COLLISION_MASK_PASSERBY;
		} else {
			this.collideType = COLLISION_MASK_WEAPON_PASSERBY;
			this.collidableWith = COLLISION_MASK_CURSOR;
		}
		if(weapon.homing) {
			this.aimType = this.collidableWith;
			this.recalculationFactor = weapon.homingSpeed;
		} else {
			this.aimType = 0;
			this.recalculationFactor = 1;
			if(!weapon.randomPath) {
				this.animation = engine.animationPool.spawnTrailAnimation(this.positionH, this.positionV, this.velocityH, this.velocityV, this.decay);
			}
		}
		this.randomPath = weapon.randomPath;
		if(weapon.expandFactor) {
			this.expandFactor = weapon.expandFactor;
		}
		this.hasSpawn = true;
	}
	
	this.move = function() {
			
			// Is Aiming
			if(this.aimType != 0) {
				var target = findNearestObject(this);
				if(target) {
					var aimingH = (target.positionH - this.positionH);
					var aimingV = (target.positionV - this.positionV);
					var normal = Math.sqrt(Math.pow(this.velocityH,2)+Math.pow(this.velocityV,2)) / Math.sqrt(Math.pow(aimingH,2)+Math.pow(aimingV,2));
					var diffH = aimingH * normal * this.recalculationFactor + this.velocityH * (1-this.recalculationFactor);
					var diffV = aimingV * normal * this.recalculationFactor + this.velocityV * (1-this.recalculationFactor);
					normal = Math.sqrt(Math.pow(this.velocityH,2)+Math.pow(this.velocityV,2)) / Math.sqrt(Math.pow(diffH,2)+Math.pow(diffV,2));
					
					this.velocityH = diffH * normal;
					this.velocityV = diffV * normal;
				}
			}
			// Random path
			if(this.randomPath) {
				var INTERVAL_RANDOM_PATH = 250;
				if(this.hasSpawn) {
					this.animationPool = [];
					this.entropyDeviation = 0;
					this.randomPathLastPoint = Date.now() - INTERVAL_RANDOM_PATH;
					this.lastSpawnPoint = {x: this.positionH, y: this.positionV};
				}
				var updateTimeDeviation = Date.now() - this.randomPathLastPoint;
				if(updateTimeDeviation >= INTERVAL_RANDOM_PATH) {
					var DISPERSION_ARC = Math.PI / 2;
					this.randomPathLastPoint = Date.now();
					var deviation = (( (Math.random() - Math.random()) * DISPERSION_ARC + DISPERSION_ARC ) % DISPERSION_ARC) - (DISPERSION_ARC / 2);
					if((this.entropyDeviation + deviation) > DISPERSION_ARC / 2) {
						deviation = ((this.entropyDeviation + deviation + DISPERSION_ARC / 2) % DISPERSION_ARC) - (DISPERSION_ARC / 2);
					} else if ((this.entropyDeviation + deviation + DISPERSION_ARC / 2) < 0) {
						deviation = ((this.entropyDeviation + deviation + 3 * DISPERSION_ARC / 2) % DISPERSION_ARC) - (DISPERSION_ARC / 2);
					}
					this.entropyDeviation = this.entropyDeviation + deviation;
					
					var diffH = this.velocityH * Math.cos(deviation) - this.velocityV * Math.sin(deviation);
					var diffV = this.velocityH * Math.sin(deviation) + this.velocityV * Math.cos(deviation);
					this.velocityH = diffH;
					this.velocityV = diffV;
				}
				this.animationPool.unshift(engine.animationPool.spawnLineAnimation(this.positionH, this.positionV, this.lastSpawnPoint.x, this.lastSpawnPoint.y, this.decay));
				this.lastSpawnPoint = {x: this.positionH, y: this.positionV};
			}
			
			// Compute Displacement
			this.positionH += (this.velocityH * updateTime * ENGINE_TIME_TO_PIXEL_CELERITY);
			this.positionV += (this.velocityV * updateTime * ENGINE_TIME_TO_PIXEL_CELERITY);
			
			// Expansion
			if(this.expandFactor) {
				var relativeTimePassed = (Math.min(Date.now(), this.lastseen + this.decay) - this.startT) / (this.lastseen + this.decay - this.startT);
				// New size is calculated by recovering initial size and adjust from the max size
				this.width = this.width * (1 + this.expandFactor * relativeTimePassed) / (1 + this.expandFactor * (this.lastseen - this.startT) / (this.lastseen + this.decay - this.startT));
				this.height = this.height * (1 + this.expandFactor * relativeTimePassed) / (1 + this.expandFactor * (this.lastseen - this.startT) / (this.lastseen + this.decay - this.startT));
			}
			
			// Projectile Dying
			this.decay -= updateTime;
			if(this.decay < 0) {
				engine.projectilePool.discard(this);
			}
			
			var relativeX = this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
			var relativeY = this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;
			
			if(this.collisionType == COLLISION_TYPE_SPHERE) {
				if(relativeX > -this.width/2 && relativeX < engine.mainCanvas.clientWidth + this.width/2
					&& relativeY > -this.height/2 && relativeY < engine.mainCanvas.clientHeight + this.width/2) {
					// Redraw projectile at center
					engine.mainContext.beginPath();
					engine.mainContext.arc(this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2, this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2, this.radius, 0, 2 * Math.PI, false);
					engine.mainContext.lineWidth = 1;
					if(this.type == COLLISION_MASK_CURSOR) {
						engine.mainContext.strokeStyle = '#FF0000';
					} else {
						if(this.aimType != 0) {
							engine.mainContext.strokeStyle = '#002266';
						} else {
							engine.mainContext.strokeStyle = '#FF00FF';
						} 
					}
					engine.mainContext.stroke();
				}
			} else {
				var box = getBoxBoundingPoint(this);
				engine.mainContext.beginPath();
				engine.mainContext.moveTo(box[0].x + engine.mainCanvas.clientWidth / 2 - engine.cursor.positionH, box[0].y + engine.mainCanvas.clientHeight / 2 - engine.cursor.positionV);
				for(var i = 0; i < 4; i ++) {
					engine.mainContext.lineTo(box[(i + 1)%4].x + engine.mainCanvas.clientWidth / 2 - engine.cursor.positionH, box[(i + 1)%4].y + engine.mainCanvas.clientHeight / 2 - engine.cursor.positionV);
				}
				engine.mainContext.lineWidth = this.size;
				engine.mainContext.strokeStyle = '#FF9999';
				engine.mainContext.fillStyle = '#FF9999';
				engine.mainContext.fill();
				engine.mainContext.stroke();
			}
			this.colliding = false;
			this.lastseen = Date.now();
			this.hasSpawn = false;
	};
	
	this.collide = function(objects) {
		if(this.collidedWith.indexOf(objects) < 0) {
			this.colliding = true;
			this.collidedWith.push(objects);
			if(Math.random() * 100 > this.pierce) {
				engine.projectilePool.discard(this);
			}
			// Trigger AoE animation
			if(this.areaOfEffect > 0) {
				engine.animationPool.spawnAoeAnimation(this.positionH, this.positionV, 0, 0, this.areaOfEffect);
				var aoe = findObjectsInArea(this);
				for(var i=0; i<aoe.length; i++) {
					if(aoe[i].alive) {
						aoe[i].collide(this);
					}
				}
			}
			// Trigger Line animation
			if(this.randomPath) {
				for(var i=0; i<this.animationPool.length; i++) {
					this.animationPool[i].flash = true;
					this.animationPool[i].decay = Date.now() + 350;
				}
			}
		}
	};
}


// /////////////////////////////////////// END OF PROJECTILE //////////////////////////////////////
/**
 * BoardElement object.
 * Main class that all Board elements should implements.
 * The elements have sufficient properties to trace them on the Board, be manageable by their Factory and interact with other elements.
 *
 * Lifecycle of the object:
 * - creation: call spawn from parent's factory
 * 	- call inner initSpawn
 * - update: call updateStateByClock from engine
 * 	- call inner move
 * 	- call inner draw
 *
 */
 function BoardElement() {
	this.alive = false;
	// Master pool
	this.pool = null;
	// Time marker for computation
	this.lastseen = 0;
	// Position on the background and it's displacement, velocity and acceleration
	this.velocityH = 0;
	this.velocityV = 0;
	this.positionH = 0;
	this.positionV = 0;
	
	this.terminalVelocity = 25; // TODO ? should be global ?
	
	// Sprite data TODO Image size in separate class ?
	this.width = 5;
	this.height = 5;
	this.radius = 2;
	this.decay = 0;
	this.orientation = 0;
	this.areaOfEffect = 0;
	
	// Collision data //TODO move in separate class
	this.collisionType = COLLISION_TYPE_SPHERE;
	this.collideType = COLLISION_MASK_WEAPON_CURSOR;
	this.collidableWith = COLLISION_MASK_PASSERBY;
	// elements it collides with at the end of a turn
	this.collideWith = [];
	this.colliding = false; // Should be replaced by collideWith.length > 0
			
	this.spawn = function(factoryPool, spawnOption) {
		this.alive=true;
		this.lastseen = Date.now();
		this.pool = factoryPool
		
		if(typeof(this.initSpawn) === typeof(Function)) this.initSpawn(spawnOption);
	}
	
	this.updateStateByClock = function() {
		// Actualize Time
		var updateTime = Date.now() - this.lastseen;
		
		// Move 
		this.move(updateTime);
		
		// Draw the object
		if(typeof(this.draw) === typeof(Function)) this.draw();
		
		// End of computation, refresh lastseen
		this.lastseen = Date.now();
	}
	
	this.move = function(updateTime) {
		// Compute Displacement
		this.positionH += (this.velocityH * updateTime / ENGINE_TIME_TO_PIXEL_CELERITY);
		this.positionV += (this.velocityV * updateTime / ENGINE_TIME_TO_PIXEL_CELERITY);
		
		// Inner Move
		if(typeof(this.innerMove) === typeof(Function)) 
		
		// Recycle animation at expiration time
		this.cleanState()
	};
	
	this.draw = function(relativeObject) {
		// Compute position relative to the object at the center of the screen
		var relativeX = this.positionH - relativeObject.positionH + engine.mainCanvas.clientWidth / 2;
		var relativeY = this.positionV - relativeObject.positionV + engine.mainCanvas.clientHeight / 2;
		
		// Only draw element that fit in the screen
		if(relativeX > 0 && relativeX < engine.mainCanvas.clientWidth
			&& relativeY > 0 && relativeY < engine.mainCanvas.clientHeight) {
			// Redraw element
			engine.mainContext.beginPath();
			engine.mainContext.arc(relativeX, relativeY, this.areaOfEffect, 0, 2 * Math.PI, false);
			engine.mainContext.lineWidth = 4;
			engine.mainContext.strokeStyle = '#FF00FF';
			//engine.mainContext.fillStyle = '#AA0000';
			//engine.mainContext.fill();
			engine.mainContext.stroke();
		}
	};
	
	this.cleanState = function() {
		// Recycle animation at expiration time
		if(this.lastseen > this.decay) {
			pool.discard(this);
		}
	};
	
	this.collide = function(objects) {
	};
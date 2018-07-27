// /////////////////////////////////////// ANIMATION FACTORY //////////////////////////////////////

function AnimationFactory() {
	this.poolAoe = [];
	this.poolTrail = [];
	this.poolLine = [];

	this.init = function() {
		for(var i=0; i<100000; i++) {
			var animationAoe = new AoeAnimation();
			this.poolAoe[i] = animationAoe;
			var animationTrail = new TrailAnimation();
			this.poolTrail[i] = animationTrail;
			var animationLine = new LineAnimation();
			this.poolLine[i] = animationLine;
		}
	};

	this.discard = function(object) {
		object.alive = false;
		if(object instanceof AoeAnimation) {
			this.poolAoe.push(this.poolAoe.splice(this.poolAoe.lastIndexOf(object),1)[0]);
		}
		if(object instanceof TrailAnimation) {
			this.poolTrail.push(this.poolTrail.splice(this.poolTrail.lastIndexOf(object),1)[0]);
		}
		if(object instanceof LineAnimation) {
			this.poolLine.push(this.poolLine.splice(this.poolLine.lastIndexOf(object),1)[0]);
		}
	}

	this.spawnAoeAnimation = function(x, y, vx, vy, aoe) {
		// Spawn an AoeAnimation
		if(!this.poolAoe[this.poolAoe.length - 1].alive) {
			this.poolAoe[this.poolAoe.length - 1].spawn(x,y,vx, vy, aoe);
			this.poolAoe.unshift(this.poolAoe.pop());
		} else {
			var animation = new AoeAnimation();
			animation.spawn(x,y,vx, vy, aoe);
			this.poolAoe.unshift(animation);
		}
		return animation;
	};

	this.spawnTrailAnimation = function(x, y, vx, vy, decay) {
		var animation;
		// Spawn a TrailAnimation
		if(!this.poolTrail[this.poolTrail.length - 1].alive) {
			this.poolTrail[this.poolTrail.length - 1].spawn(x,y,vx, vy, decay);
			animation = this.poolTrail.pop();
			this.poolTrail.unshift(animation)
		} else {
			animation = new TrailAnimation();
			animation.spawn(x,y,vx, vy, decay);
			this.poolTrail.unshift(animation);
		}
		return animation;
	};

	this.spawnLineAnimation = function(x, y, x2, y2, decay) {
		var animation;
		// Spawn a LineAnimation
		if(!this.poolLine[this.poolLine.length - 1].alive) {
			this.poolLine[this.poolLine.length - 1].spawn(x,y,x2, y2, decay);
			animation = this.poolLine.pop();
			this.poolLine.unshift(animation)
		} else {
			animation = new LineAnimation();
			animation.spawn(x,y,x2, y2, decay);
			this.poolLine.unshift(animation);
		}
		return animation;
	};

	this.draw = function() {
		for(var i=0; i<this.poolAoe.length && this.poolAoe[i].alive; i++) {
			this.poolAoe[i].move();
		}
		for(var i=0; i<this.poolTrail.length && this.poolTrail[i].alive; i++) {
			this.poolTrail[i].move();
		}
		for(var i=0; i<this.poolLine.length && this.poolLine[i].alive; i++) {
			this.poolLine[i].move();
		}
	};

	this.getAlivePool = function() {
		var obj = [];
		for(var i=0; i<this.poolAoe.length && this.poolAoe[i].alive; i++) {
			obj.push(this.poolAoe[i]);
		}
		for(var i=0; i<this.poolTrail.length && this.poolTrail[i].alive; i++) {
			obj.push(this.poolTrail[i]);
		}
		for(var i=0; i<this.poolLine.length && this.poolLine[i].alive; i++) {
			obj.push(this.poolLine[i]);
		}
		return obj;
	};
}

// /////////////////////////////////// END OF ANIMATION FACTORY ///////////////////////////////////
// /////////////////////////////////////////// ANIMATION //////////////////////////////////////////

Animation.prototype = new BoardElement();
Animation.prototype.constructor = Animation;

function AoeAnimation() {
	this.areaOfEffect = 0;

	this.spawn = function(x,y,vx,vy, aoe) {
		this.alive=true;
		this.lastseen = Date.now();
		this.positionH = x;
		this.positionV = y;
		this.velocityH = -vx;
		this.velocityV = -vy;
		this.areaOfEffect = aoe;
		this.decay = Date.now() + 350;
	}

	this.draw = function() {
		engine.mainContext.arc(relativeX, relativeY, this.areaOfEffect, 0, 2 * Math.PI, false);
		engine.mainContext.lineWidth = 4;
		engine.mainContext.strokeStyle = '#FF00FF';
	};

	this.collide = function(objects) {
	};
}

function TrailAnimation() {
	this.startT = 0;
	this.startH = 0;
	this.startV = 0;

	this.spawn = function(x,y,vx,vy, decay) {
		this.alive=true;
		this.lastseen = Date.now();
		this.startT = Date.now();
		this.startH = x;
		this.startV = y;
		this.positionH = x;
		this.positionV = y;
		this.velocityH = vx;
		this.velocityV = vy;
		this.decay = Date.now() + decay;
	}

	this.move = function() {
			// Compute relative position to screen
			var relativeStartX = 0;
			var	relativeStartY = 0;
			if(this.lastseen - this.startT < 300) {
				// If less than 3 tenth second, trail from start
				relativeStartX = this.startH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
				relativeStartY = this.startV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;
			} else {
				// Else crop tail
				var dX = this.velocityH * Math.min(3,(this.lastseen - this.startT) / 100);
				var dY = this.velocityV * Math.min(3,(this.lastseen - this.startT) / 100);
				relativeStartX = this.positionH - dX - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
				relativeStartY = this.positionV - dY - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;
			}
			var relativeX = this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
			var relativeY = this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;

			// If start or end is in the canvas
			if( (relativeStartX > 0 && relativeStartX < engine.mainCanvas.clientWidth
				&& relativeStartY > 0 && relativeStartY < engine.mainCanvas.clientHeight) ||
				(relativeX > 0 && relativeX < engine.mainCanvas.clientWidth
				&& relativeY > 0 && relativeY < engine.mainCanvas.clientHeight)) {
				if(this.velocityH != 0 && this.velocityV != 0) {
					// Redraw animation at center
					engine.mainContext.beginPath();
					engine.mainContext.moveTo(relativeStartX, relativeStartY);
					engine.mainContext.lineTo(relativeX, relativeY);
					engine.mainContext.lineWidth = 1;
					// Create gradient
					gradient = engine.mainContext.createLinearGradient(relativeStartX, relativeStartY, relativeX, relativeY);
					gradient.addColorStop(0, "#ffeedd");
					gradient.addColorStop(1, "#ffdd66");
					engine.mainContext.strokeStyle  = gradient;
					engine.mainContext.stroke();
				} else {
					// Redraw animation at center
					engine.mainContext.beginPath();
					engine.mainContext.fillRect(relativeStartX, relativeStartY,1,1);
					engine.mainContext.fillStyle = "#cc88aa";
					engine.mainContext.stroke();

				}
			}

			// Recycle animation at expiration time
			if(this.lastseen > this.decay) {
				engine.animationPool.discard(this);
			}
	};

	this.collide = function(objects) {
	};
}

function LineAnimation() {
	this.alive = false;
	// Time marker for computation
	this.lastseen = 0;
	// Cursor position on the background and it's displacement, velocity and acceleration
	this.velocityH = 0;
	this.velocityV = 0;
	this.positionH = 0;
	this.positionV = 0;
	this.startT = 0;
	this.startH = 0;
	this.startV = 0;
	this.decay = 0;

	this.spawn = function(x,y,x2, y2, decay) {
		this.alive=true;
		this.lastseen = Date.now();
		this.startT = Date.now();
		this.startH = x;
		this.startV = y;
		this.positionH = x2;
		this.positionV = y2;
		this.decay = Date.now() + decay;
		this.flash = false;
	}

	this.move = function() {
			// Actualize Time
			var updateTime = Date.now() - this.lastseen;
			this.lastseen = Date.now();

			// Compute relative position to screen
			var relativeStartX = this.startH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
			var	relativeStartY = this.startV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;
			var relativeX = this.positionH - engine.cursor.positionH + engine.mainCanvas.clientWidth / 2;
			var relativeY = this.positionV - engine.cursor.positionV + engine.mainCanvas.clientHeight / 2;

			// If start or end is in the canvas
			if( (relativeStartX > 0 && relativeStartX < engine.mainCanvas.clientWidth
				&& relativeStartY > 0 && relativeStartY < engine.mainCanvas.clientHeight) ||
				(relativeX > 0 && relativeX < engine.mainCanvas.clientWidth
				&& relativeY > 0 && relativeY < engine.mainCanvas.clientHeight)) {
				// Redraw animation at center
				engine.mainContext.beginPath();
				engine.mainContext.moveTo(relativeStartX, relativeStartY);
				engine.mainContext.lineTo(relativeX, relativeY);
				if(this.flash) {
					engine.mainContext.lineWidth = 2;
					engine.mainContext.strokeStyle = "#aa44aa";
					if(this.lastseen + 150 > this.decay ) {
						engine.mainContext.strokeStyle = "#ff99ff";
					}
				} else {
					engine.mainContext.lineWidth = 1;
					engine.mainContext.strokeStyle = "#440044";
				}
				engine.mainContext.stroke();
			}

			// Recycle animation at expiration time
			if(this.lastseen > this.decay) {
				engine.animationPool.discard(this);
			}
	};

	this.collide = function(objects) {
	};
}


// /////////////////////////////////////// END OF ANIMATION ///////////////////////////////////////

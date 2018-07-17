// //////////////////////////////////////////// EVENTS ////////////////////////////////////////////

function generateEvents() {
	this.lastseen = 0;
	this.lastevent = 0;
	
	this.doEvent = function() {
		// Actualize Time
		var updateTime = Date.now() - this.lastseen;
		this.lastseen = Date.now();
		this.lastevent = this.lastevent + updateTime;
		if(this.lastevent > 500) {
			this.lastevent = 0;
			angle = Math.random();
			engine.passerbyPool.spawn(engine.cursor.positionH + (Math.cos(Math.PI * 2 * angle) * 100), engine.cursor.positionV + (Math.sin(Math.PI * 2 * angle) * 100), engine.cursor.velocityH * (Math.random()*2.5-1), engine.cursor.velocityV * (Math.random()*2.5-1));
		}
	};
}

// ///////////////////////////////////////// END OF EVENTS ////////////////////////////////////////
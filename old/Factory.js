/**
 * Factory object.
 * Create a factory that can manage adding element and removing element of a same type.
 * The factory keep a chained list with all alive element first and dead one after, so that it can stop parsing at the first dead element.
 *
 */
 function ElementFactory() {
	this.pool = [];
	var size = 10000;
	
	this.init = function() {
		for(var i=0; i<size; i++) {
			var element = new ElementClass();
			this.pool[i] = element;
		}
	};
		
	this.spawn = function(x, y, vx, vy) {
		if(!this.pool[size - 1].alive) {
			this.pool[size - 1].spawn(x,y,vx, vy);
			this.pool.unshift(this.pool.pop());
		} else {
			console.log("Factory is maxed, element couldn't be created")
		}
	};
		
	this.discard = function(object) {
		object.alive = false;
		this.pool.push(this.pool.splice(this.pool.lastIndexOf(object),1)[0]);
		if(object.animation) {
			object.animation.stop // TODO À configurer
		}
	}
	
	/* Allow */
	this.draw = function() {
	// TODO ? clear rect ? engine.mainContext.clearRect(0,0,engine.mainCanvas.clientWidth,engine.mainCanvas.clientHeight);
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


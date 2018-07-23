/**
 * QuadTree object.
 * The quadrant indexes are numbered as below:
 * 1|0
 * �+-
 * 2|3
 */
function QuadTree(boundBox, lvl) {
	var maxObjects = 2;
	this.bounds = boundBox || {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};
	this.objects = [];
	this.nodes = [];
	this.level = lvl || 0;
	this.maxLevels = 2;
	/*
	 * Clears the quadTree and all nodes of objects
	 */
	this.clear = function() {
		this.objects = [];
		for (var i = 0; i < this.nodes.length; i++) {
			this.nodes[i].clear();
		}
		this.nodes = [];
	};

	/*
	 * Get all objects in the quadTree
	 */
	this.getAllObjects = function() {
		var returnedObjects = [];

		for (var i = 0; i < this.nodes.length; i++) {
			returnedObjects = returnedObjects.concat(this.nodes[i].getAllObjects());
		}

		returnedObjects = returnedObjects.concat(this.objects);

		return returnedObjects;
	};

	/*
	 * Return all objects that the object could collide with
	 */
	this.findObjects = function(obj) {
		var returnedObjects = [];
		if (typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT");
			return;
		}

		var index = this.getIndex(obj);
		if (index > -1 && this.nodes.length) {
			returnedObjects = returnedObjects.concat(this.nodes[index].findObjects(obj));
		}

		returnedObjects = returnedObjects.concat(this.objects);

		return returnedObjects;
	};

	/*
	 * Insert the object into the quadTree. If the tree
	 * excedes the capacity, it will split and add all
	 * objects to their corresponding nodes.
	 */
	this.insert = function(obj) {
		if (typeof obj === "undefined") {
			return;
		}

		var index = this.getIndex(obj);
		if (this.nodes.length) {
			// Only add the object to a subnode if it can fit completely
			// within one
			if (index > -1) {
				this.nodes[index].insert(obj);
				return;
			}
		}
		// Grow tree if the objects escape the bounds
		if (index < -1) {
			this.grow(index, obj);
		}

		this.objects.push(obj);

		// Prevent infinite splitting
		if (this.objects.length > maxObjects && this.level < this.maxLevels) {
			if (this.nodes[0] == null) {
				this.split();
			}

			var i = 0;
			while (i < this.objects.length) {

			var index = this.getIndex(this.objects[i]);
				if (index > -1) {
					this.nodes[index].insert((this.objects.splice(i,1))[0]);
				}
				else {
					i++;
				}
			}
		}
	};

	/*
	 * Determine which node the object belongs to. -1 means
	 * object cannot completely fit within a node and is part
	 * of the current node
	 */
	this.getIndex = function(obj) {

		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

		if(obj.radius) {
			// Object can fit completely within the left quadrant
			var leftQuadrant = (obj.positionH + obj.radius < verticalMidpoint);
			var leftOverflow = (obj.positionH + obj.radius < this.bounds.x);
			// Object can fit completely within the right quandrant
			var rightQuadrant = (obj.positionH - obj.radius > verticalMidpoint);
			var rightOverflow = (obj.positionH - obj.radius > this.bounds.x + this.bounds.width);
			// Object can fit completely within the top quadrant
			var topQuadrant = (obj.positionV + obj.radius < horizontalMidpoint);
			var topOverflow = (obj.positionV + obj.radius < this.bounds.y);
			// Object can fit completely within the bottom quandrant
			var bottomQuadrant = (obj.positionV - obj.radius > horizontalMidpoint);
			var bottomOverflow = (obj.positionV - obj.radius > this.bounds.y + this.bounds.height);
		} else {
			// Object can fit completely within the left quadrant
			var leftQuadrant = (obj.positionH < verticalMidpoint && obj.positionH + obj.width < verticalMidpoint);
			var leftOverflow = (obj.positionH < this.bounds.x);
			// Object can fit completely within the right quandrant
			var rightQuadrant = (obj.positionH > verticalMidpoint);
			var rightOverflow = (obj.positionH + obj.width > this.bounds.x + this.bounds.width);
			// Object can fit completely within the top quadrant
			var topQuadrant = (obj.positionV < horizontalMidpoint && obj.positionV + obj.height < horizontalMidpoint);
			var topOverflow = (obj.positionV < this.bounds.y);
			// Object can fit completely within the bottom quandrant
			var bottomQuadrant = (obj.positionV > horizontalMidpoint);
			var bottomOverflow = (obj.positionV + obj.height > this.bounds.y + this.bounds.height);
		}

		// Object is outside the box
		if(leftOverflow) {
			if(bottomQuadrant) {
				index = -12;
			} else {
				index = -11;
			}
		}else if(rightOverflow) {
			if(bottomOverflow) {
				index = -13;
			} else {
				index = -10;
			}
		} else if(topOverflow) {
			if(rightQuadrant) {
				index = -10;
			} else {
				index = -11;
			}
		} else if(bottomOverflow) {
			if(rightQuadrant) {
				index = -13;
			} else {
				index = -12;
			}
		}
		// Object can fit completely within the left quadrants
		else if (leftQuadrant) {
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}
		// Object can fix completely within the right quandrants
		else if (rightQuadrant) {
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}
		// else, the object is in bound and cannot fit in any quadrant, return -1

		return index;
	};

	/*
	 * Splits the node into 4 subnodes
	 */
	this.split = function() {
		// Bitwise or [html5rocks]
		var subWidth = (this.bounds.width / 2) | 0;
		var subHeight = (this.bounds.height / 2) | 0;

		this.nodes[0] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, this.level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, this.level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, this.level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, this.level+1);
	};

	/*
	 * Create 3 sibling leaf and one parent to create a bigger QuadTree
	 */
	this.grow = function(corner, obj) {
		var subWidth = this.bounds.width * 2;
		var subHeight = this.bounds.height * 2;
		var fatherNode = [];

		if(corner == -10) {
			newBounds = {x: this.bounds.x, y: this.bounds.y-this.bounds.height, width:subWidth, height:subHeight};
			fatherNode[0] = new QuadTree({x:this.bounds.x+this.bounds.width, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[1] = new QuadTree({x:this.bounds.x, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[2] = this;
			fatherNode[3] = new QuadTree({x:this.bounds.x, y:this.bounds.y, width:this.bounds.width, height:this.bounds.height}, this.level);
		} else if(corner == -11) {
			newBounds = {x: this.bounds.x-this.bounds.width, y: this.bounds.y-this.bounds.height, width:subWidth, height:subHeight};
			fatherNode[0] = new QuadTree({x:this.bounds.x, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[1] = new QuadTree({x:this.bounds.x-this.width, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[2] = new QuadTree({x:this.bounds.x-this.width, y:this.bounds.y, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[3] = this;
		} else if(corner == -12) {
			newBounds = {x: this.bounds.x-this.bounds.width, y: this.bounds.y, width:subWidth, height:subHeight};
			fatherNode[0] = this;
			fatherNode[1] = new QuadTree({x:this.bounds.x, y:this.bounds.y-this.bounds.height, width:this.width, height:this.bounds.height}, this.level);
			fatherNode[2] = new QuadTree({x:this.bounds.x-this.bounds.width, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[3] = new QuadTree({x:this.bounds.x-this.bounds.width, y:this.bounds.y, width:this.bounds.width, height:this.bounds.height}, this.level);
		} else if(corner == -13) {
			newBounds = {x: this.bounds.x, y: this.bounds.y, width:subWidth, height:subHeight};
			fatherNode[0] = new QuadTree({x:this.bounds.x+this.bounds.width, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[1] = this;
			fatherNode[2] = new QuadTree({x:this.bounds.x, y:this.bounds.y-this.bounds.height, width:this.bounds.width, height:this.bounds.height}, this.level);
			fatherNode[3] = new QuadTree({x:this.bounds.x, y:this.bounds.y, width:this.bounds.width, height:this.bounds.height}, this.level);
		}

		var newTree = new QuadTree(newBounds, this.level - 1);
		newTree.maxLevels = this.maxLevels+1;
		newTree.nodes = fatherNode;
		newTree.objects = this.objects;
		this.objects = [];
		engine.quadTree = newTree;
	};

	this.print = function() {
		var text = "[";
		text = text + this.objects.length;
		if(this.nodes && this.nodes.length) {
			text = text + "|";
			for (var i = 0; i < this.nodes.length; i++) {
				text = text + this.nodes[i].print() + "|";
			}
		}
		text = text + "]";
		return text;
	}
}

/**
 * return an array with the x,y absolute coordinate of each point of the box
 * -> width, height, positionH, positionV, velocityH, velocityV
 * array 0-3 : each point counter-clockwise from upper-left corner
 * x: the absolute x coordinate
 * y: the absolute y coordinate
 */
function getBoxBoundingPoint(obj) {
	var theta = Math.atan(obj.velocityV / obj.velocityH);
	if(obj.orientation) {
		theta = (theta + (obj.orientation)) % Math.PI;
	}
	var angle = {a: theta,
				cos: Math.cos(theta),
				sin: Math.sin(theta)};
	var distance = (Date.now() - obj.lastseen) * ENGINE_TIME_TO_PIXEL_CELERITY;
	return [{ x: (obj.width / 2 * angle.cos - obj.height / 2 * angle.sin ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionH + distance * obj.velocityH,
				y: (obj.width / 2 * angle.sin + obj.height / 2 * angle.cos ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionV + distance * obj.velocityV },
			{ x: (obj.width / 2 * angle.cos + obj.height / 2 * angle.sin ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionH + distance * obj.velocityH,
				y: (obj.width / 2 * angle.sin - obj.height / 2 * angle.cos ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionV + distance * obj.velocityV },
			{ x: (-obj.width / 2 * angle.cos + obj.height / 2 * angle.sin ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionH,
				y: (-obj.width / 2 * angle.sin - obj.height / 2 * angle.cos ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionV },
			{ x: (-obj.width / 2 * angle.cos - obj.height / 2 * angle.sin ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionH,
				y: (-obj.width / 2 * angle.sin + obj.height / 2 * angle.cos ) * Math.abs(obj.velocityH ) / obj.velocityH + obj.positionV } ];
}

/*
 * Create a bounding box of 4 points rectangle that include the object and its next image
 */
function buildBoundBox(hitbox, velocity) {
	// Step 1: create 4 points from center and width/height
	var pne = {x: hitbox.h + hitbox.width, y: hitbox.v - hitbox.height};
	var pnw = {x: hitbox.h - hitbox.width, y: hitbox.v - hitbox.height};
	var pse = {x: hitbox.h + hitbox.width, y: hitbox.v + hitbox.height};
	var psw = {x: hitbox.h - hitbox.width, y: hitbox.v + hitbox.height};
	// Step 2: create 4 additionnal points that are the future of the 4 points
	var fne = {x: hitbox.h + hitbox.width + velocity.h, y: hitbox.v - hitbox.height + velocity.v};
	var fnw = {x: hitbox.h - hitbox.width + velocity.h, y: hitbox.v - hitbox.height + velocity.v};
	var fse = {x: hitbox.h + hitbox.width + velocity.h, y: hitbox.v + hitbox.height + velocity.v};
	var fsw = {x: hitbox.h - hitbox.width + velocity.h, y: hitbox.v + hitbox.height + velocity.v};
	// Step 3: make a normal vector from the velocity at the center of the path
	var velocityA = {x: hitbox.h, y: hitbox.v + velocity.v};
	var velocityB = {x: hitbox.h, y: hitbox.v + velocity.v};
	var normalA = {x: hitbox.h + velocity.h /2 + velocity.v /2, y: hitbox.v + velocity.v /2 - velocity.h /2};
	var normalB = {x: hitbox.h + velocity.h /2 - velocity.v /2, y: hitbox.v + velocity.v /2 + velocity.h /2};
	// Step 4: found each intersection between the couple of past-future corner and the normal of velocity
}

/**
 * return the intersection of two oriented segment [A,B] and [C,D]
 * delta: 0 if parallel lines
 * x: the absolute x coordinate
 * y: the absolute y coordinate
 * p: point is beofre A < =0 < point is between A and B < =1 < point is after B
 * q: point is beofre C < =0 < point is between C and D < =1 < point is after D
 */
function findIntersectionPoint(ax, bx, ay, by, cx, dx, cy, dy) {
	var delta = (ax-bx)*(cy-dy) - (ay-by)*(cx-dx);
	var p,q,px,py;
	if(delta == 0) {
		// Parallel lines
	} else {
		p = ( (by-dy)*(cx-dx) - (bx-dx)*(cy-dy) ) / delta;
		q = ( (bx-dx)*(ay-by) - (by-dy)*(ax-bx) ) / delta;
		px= p*ax + (1-p)*bx;
		py= p*ay + (1-p)*by;
	}
	return {delta: delta, p:p, q:q, x: px, y: py};
}

// //////////////////////////////////////// END OF LIBRARY ////////////////////////////////////////

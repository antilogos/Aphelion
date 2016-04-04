// ////////////////////////////////////////// COLLISION ///////////////////////////////////////////

var COLLISION_MASK_CURSOR = 1;
var COLLISION_MASK_PASSERBY = 2;
var COLLISION_MASK_WEAPON_CURSOR = 4;
var COLLISION_MASK_WEAPON_PASSERBY = 8;
var COLLISION_MASK_WEAPON_TYPE_ENERGY = 16;
var COLLISION_MASK_WEAPON_TYPE_PROJECTILE = 32;
var COLLISION_TYPE_SPHERE = 1;
var COLLISION_TYPE_BOX = 2;

function detectCollision () {
	var objects = [];
	objects = engine.quadTree.getAllObjects();
	for(var i=0; i<objects.length; i++) {
		var obj = engine.quadTree.findObjects(objects[i]);
		for(var j=0; j<obj.length; j++) {
			if(objects[i] !== obj[j]) {
				if(objects[i].collidableWith & obj[j].collideType) {
					// Detect collision
					if(isCollision(objects[i],obj[j])) {
						objects[i].collide(obj[j]);
						obj[j].collide(objects[i]);
					}
				}
			}
		}
	}
}

function isCollision(one, another) {
	if(one.collisionType == COLLISION_TYPE_SPHERE && another.collisionType == COLLISION_TYPE_SPHERE) {
		// Collision between sphere is if their distance is inferior to their radius.
		return Math.pow(one.radius + another.radius,2) >= (Math.pow(one.positionH - another.positionH,2) + Math.pow(one.positionV - another.positionV,2))
	} else if((one.collisionType == COLLISION_TYPE_SPHERE && another.collisionType == COLLISION_TYPE_BOX) || (one.collisionType == COLLISION_TYPE_BOX && another.collisionType == COLLISION_TYPE_SPHERE)) {
		// Collision between box and circle is computing solution of the circle equation 
		var boxPoints;
		var circle;
		// We don't care wich one is the box and wich is the circle
		if(another.collisionType == COLLISION_TYPE_BOX) {
			boxPoints = getBoxBoundingPoint(another);
			circle = {r: one.radius, x: one.positionH, y: one.positionV};
		} else {
			boxPoints = getBoxBoundingPoint(one);
			circle = {r: another.radius, x: another.positionH, y: another.positionV};
		}
		// Check for collision with each segment
		for(var i=0; i<4; i++) {
			// Segment
			var dx = boxPoints[(i+1)%4].x - boxPoints[i].x ;
			var dy = boxPoints[(i+1)%4].y - boxPoints[i].y ;
			// Segment from center of circle to start of line
			var fx = boxPoints[i].x - circle.x;
			var fy = boxPoints[i].y - circle.y;
			// Solution of equation
			var a =  Math.pow(dx ,2) + Math.pow(dy ,2) ;
			var b = 2 * ( boxPoints[i].x * dx + boxPoints[i].y * dy - dx * circle.x - dy * circle.y );
			var c = Math.pow(fx ,2) + Math.pow(fy ,2) - Math.pow(circle.r ,2);
			var disc = Math.sqrt( Math.pow(b ,2) - 4 * a * c );
			if(disc >= 0) {
				var t1 = (-b - disc ) / (2 * a );
				var t2 = (-b + disc ) / (2 * a );
				// Completly in
				if(t1 < 0 && t2 > 1) {
					return true;
				}
				// Impale or Poke
				if(t1 >= 0 && t1 <= 1) {
					return true;
				}
				// Exit wound
				if(t2 >= 0 && t2 <= 1) {
					return true;
				}
			}
		}
	} else if(one.collisionType == COLLISION_TYPE_BOX && another.collisionType == COLLISION_TYPE_BOX) {
		// Collision between boxes checking all intersection of axis, if any of the 16 point intersect, then there is collision
		var boxPointsOne = getBoxBoundingPoint(one);
		var boxPointsAnother = getBoxBoundingPoint(another);
		for(var i=0; i<4; i++) {
			var intersect = findIntersectionPoint(boxPointsOne[i].x, boxPointsOne[(i+1)%4].x, boxPointsOne[i].y, boxPointsOne[(i+1)%4].y, boxPointsAnother[i].x, boxPointsAnother[(i+1)%4].x, boxPointsAnother[i].y, boxPointsAnother[(i+1)%4].y);
			if(intersect.delta != 0 && intersect.p >= 0 && intersect.p <= 1) {
				return true;
			}
		}
	}
}

function findNearestObject(object) {
	var obj = engine.quadTree.findObjects(object);
	var candidate;
	var distanceCandidate;
	for(var j=0; j<obj.length; j++) {
		if(object !== obj[j]) {
			if(object.aimType & obj[j].collideType) {
				if(candidate) {
					// Compare to candidate
					if(Math.pow(object.positionH - obj[j].positionH,2) + Math.pow(object.positionV - obj[j].positionV,2) < distanceCandidate) {
						candidate = obj[j];
						distanceCandidate = Math.pow(object.positionH - obj[j].positionH,2) + Math.pow(object.positionV - obj[j].positionV,2);
					}
				} else {
					candidate = obj[j];
					distanceCandidate = Math.pow(object.positionH - obj[j].positionH,2) + Math.pow(object.positionV - obj[j].positionV,2);
				}
			}
		}
	}
	return candidate;
}

function findObjectsInArea(object) {
	var aoeObject = {
		positionH: object.positionH,
		positionV: object.positionV,
		width: object.areaOfEffect,
		height: object.areaOfEffect
	};
	var obj = engine.quadTree.getAllObjects(aoeObject);
	var objectsInAoe = [];
	for(var j=0; j<obj.length; j++) {
		if(object !== obj[j]) {
			if(object.collidableWith & obj[j].collideType) {
				// Compare to candidate
				if(Math.pow(object.positionH - obj[j].positionH,2) + Math.pow(object.positionV - obj[j].positionV,2) < Math.pow(object.areaOfEffect,2)) {
					objectsInAoe.push(obj[j]);
				}
			}
		}
	}
	return objectsInAoe;
}


// /////////////////////////////////////// END OF COLLISION ///////////////////////////////////////
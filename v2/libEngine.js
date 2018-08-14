// Translate velocity factor to pixel distance
var ENGINE_TIME_TO_PIXEL_CELERITY = 1 / 500;
var QUADTREE_NODE_ELEMENTS_THRESHOLD = 3;
var QUADTREE_NODE_MIN_LEVEL = 3;
var COLLISION_MASK_CURSOR = 1;
var COLLISION_MASK_PASSERBY = 2;
var COLLISION_MASK_WEAPON_CURSOR = 4;
var COLLISION_MASK_WEAPON_PASSERBY = 8;
var COLLISION_MASK_WEAPON_TYPE_ENERGY = 16;
var COLLISION_MASK_WEAPON_TYPE_PROJECTILE = 32;
var COLLISION_SHAPE_ROUND = 1;
var COLLISION_SHAPE_BOX = 2;

function Quadtree(level, h, v) {

  this.current = { elements: [], level: level, h: h, v: v, width: Math.pow(2,level), height: Math.pow(2,level)};
  this.nwChild = null;
  this.neChild = null;
  this.swChild = null;
  this.seChild = null;

  this.clear = function clear() {
    this.current.elements = [];
    this.nwChild = null;
    this.neChild = null;
    this.swChild = null;
    this.seChild = null;
  };

  this.insertElement = function insertElement(element, allowExpand) {
    var collisionBox = firstOrderBoundBox(element.hitbox, element.velocity);
    // If not a fit, should escalate
    if(!this.fitInQuad(collisionBox) && allowExpand) {
      console.log("element " + collisionBox.h + ":" + collisionBox.v + " did not fit in QT " + this.current.h + "-" + this.current.v + "^" + this.current.level);
      // Determine which quadrant it should go
      if(collisionBox.h <= this.current.h && collisionBox.v <= this.current.v) {
        var newFather = new Quadtree(this.current.level +1, this.current.h - this.current.width, this.current.v - this.current.height);
        newFather.nwChild = new Quadtree(this.current.level, this.current.h - this.current.width, this.current.v - this.current.height);
        newFather.neChild = new Quadtree(this.current.level, this.current.h, this.current.v - this.current.height);
        newFather.swChild = new Quadtree(this.current.level, this.current.h - this.current.width, this.current.v);
        newFather.seChild = this;
        //console.log("expanding quadtree North West");
      } else if(collisionBox.h <= this.current.h) {
        var newFather = new Quadtree(this.current.level +1, this.current.h - this.current.width, this.current.v);
        newFather.nwChild = new Quadtree(this.current.level, this.current.h - this.current.width, this.current.v);
        newFather.seChild = new Quadtree(this.current.level, this.current.h, this.current.v + this.current.height);
        newFather.swChild = new Quadtree(this.current.level, this.current.h - this.current.width, this.current.v + this.current.height);
        newFather.neChild = this;
        //console.log("expanding quadtree North East");
      } else if(collisionBox.v <= this.current.v) {
        var newFather = new Quadtree(this.current.level +1, this.current.h, this.current.v - this.current.height);
        newFather.nwChild = new Quadtree(this.current.level, this.current.h, this.current.v - this.current.height);
        newFather.neChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v - this.current.height);
        newFather.seChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v);
        newFather.swChild = this;
        //console.log("expanding quadtree South West");
      } else {
        var newFather = new Quadtree(this.current.level +1, this.current.h, this.current.v);
        newFather.seChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v + this.current.height);
        newFather.neChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v);
        newFather.swChild = new Quadtree(this.current.level, this.current.h, this.current.v + this.current.height);
        newFather.nwChild = this;
        //console.log("expanding quadtree South East");
      }
      quadTree = newFather;
      //console.log("expanding quadtree to " + quadTree.current.h + "-" + quadTree.current.v + "^" + quadTree.current.level);
      if(this.current.level <= 30) {
        newFather.insertElement(element, true);
      }
    } else {
      // Check if need to insert in a child element if they exist
      if(this.nwChild != null) {
        if(this.nwChild.fitInQuad(collisionBox)) {
          this.nwChild.insertElement(element, false);
        } else if(this.neChild.fitInQuad(collisionBox)) {
          this.neChild.insertElement(element, false);
        } else if(this.swChild.fitInQuad(collisionBox)) {
          this.swChild.insertElement(element, false);
        } else if(this.seChild.fitInQuad(collisionBox)) {
          this.seChild.insertElement(element, false);
        } else {
          // Even if full, must stockpile element at the lowest level possible
          this.current.elements.push(element);
        }
      } else {
        // Insert, even if reached maximum capacity
        this.current.elements.push(element);
        // If the current node can too many element and can split, split it
        if(this.current.elements.length > QUADTREE_NODE_ELEMENTS_THRESHOLD && this.current.level > QUADTREE_NODE_MIN_LEVEL) {
          //console.log("split happen - " + this.current.level);
          // split the elements in 5 groups, those which fit in one of the four quadrants, and those which don't fit in any
          var nw = new Quadtree(this.current.level -1, this.current.h, this.current.v);
          var ne = new Quadtree(this.current.level -1, this.current.h + this.current.width/2, this.current.v);
          var sw = new Quadtree(this.current.level -1, this.current.h, this.current.v + this.current.height/2);
          var se = new Quadtree(this.current.level -1, this.current.h + this.current.width/2, this.current.v + this.current.height/2);
          this.nwChild = nw;
          this.neChild = ne;
          this.swChild = sw;
          this.seChild = se;
          var elementsList = this.current.elements.splice(0, this.current.elements.length);
          var intermediateTree = this;
          elementsList.forEach(function distributeChild(distribute, index) {
            intermediateTree.insertElement(distribute, false);
          });
        }
      }
    }
  };

  this.fitInQuad = function fitIn(element) {
    return element.h > this.current.h && element.h + element.width < this.current.h + this.current.width &&
      element.v > this.current.v && element.v + element.height < this.current.v + this.current.height;
  };

  this.checkCollision = function checkCollision() {
    // Check if there is any collision between this level
    elementsList = this.current.elements;
    this.current.elements.forEach(function collide(one, index) {
       // Check with the remaining elements of the same level
        var checkWith = elementsList.slice(index +1, elementsList.length +1);
        checkWith.forEach(function collidable(other, index2) {
          if(areCollidable(one, other)) {
            one.collide(other);
            other.collide(one);
          }
        });
    });
    // Then check if there is any collision between this level and the lower one by getting all sub-elements
    var checkWith = this.pickSubElements();
    this.current.elements.forEach(function collide(one, index) {
       // Check with the remaining elements all sub-level
        checkWith.forEach(function collidable(other, index2) {
          if(areCollidable(one, other)) {
            one.collide(other);
            other.collide(one);
          }
        });
    });
    if(this.nwChild != null) this.nwChild.checkCollision();
    if(this.neChild != null) this.neChild.checkCollision();
    if(this.swChild != null) this.swChild.checkCollision();
    if(this.seChild != null) this.seChild.checkCollision();
  }

  this.pickSubElements = function pickSubElements() {
    if(this.nwChild != null) {
      return this.nwChild.current.elements.concat(this.neChild.current.elements, this.swChild.current.elements, this.swChild.current.elements,
        this.nwChild.pickSubElements(), this.neChild.pickSubElements(), this.swChild.pickSubElements(), this.seChild.pickSubElements());
    } else {
      return [];
    }
  }

  this.update = function update() {
    // Fill in the quadTree
    this.clear();
    passerbyFactory.passerbyList.filter(function stillAlive(p) { return p.state.alive; }).forEach(function insertPasserby(p) { quadTree.insertElement(p, true); });
    projectileFactory.projectileList.filter(function stillAlive(p) { return p.state.alive; }).forEach(function insertProjectile(p) { quadTree.insertElement(p, true); });
    stationFactory.stationList.forEach(function insertStation(s) {
        s.arrays.filter( stillAlive).forEach(function insertArray(a) { quadTree.insertElement(a, true); });
        s.nodes.filter( stillAlive).forEach(function insertNode(n) { quadTree.insertElement(n, true); });
    });
    quadTree.insertElement(cursor, true);
    // Detect collision
    quadTree.checkCollision();
  };

  this.draw = function draw() {
    // Debug
    /*
    var context = CANVAS_BACKGROUND.getContext('2d');
    var relX = this.current.h - cursor.hitbox.h + CANVAS_WIDTH /2;
    var relY = this.current.v - cursor.hitbox.v + CANVAS_HEIGHT /2;

    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.beginPath();
    context.strokeRect(relX, relY, this.current.width, this.current.height);
    context.font = '8pt Calibri';
    context.fillStyle = 'black';
    context.fillText("QT"+(this.current.level), relX+10, relY+20+this.current.level*10);

    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.beginPath();
    var level = this.current.level;
    this.current.elements.forEach(function drawBoundBox(e) {
      var boundBox = firstOrderBoundBox(e.hitbox, e.velocity);
      var relX = boundBox.h - cursor.hitbox.h + CANVAS_WIDTH /2;
      var relY = boundBox.v - cursor.hitbox.v + CANVAS_HEIGHT /2;
      context.strokeRect(relX, relY, boundBox.width, boundBox.height);
      context.font = '8pt Calibri';
      context.fillStyle = 'black';
      context.fillText(level, relX+3, relY+15);
    });

    if(this.nwChild != null) this.nwChild.draw();
    if(this.neChild != null) this.neChild.draw();
    if(this.swChild != null) this.swChild.draw();
    if(this.seChild != null) this.seChild.draw();
    */
  };
};

var quadTree = new Quadtree(9,Math.pow(2,8) * -1, Math.pow(2,8) * -1);

function areCollidable(one, other) {
  return (((one.hitbox.type | other.hitbox.type) == (COLLISION_MASK_CURSOR | COLLISION_MASK_WEAPON_PASSERBY))
    || ((one.hitbox.type | other.hitbox.type) == (COLLISION_MASK_PASSERBY | COLLISION_MASK_WEAPON_CURSOR)))
    && checkInboundRectangle(firstOrderBoundBox(one.hitbox, one.velocity), firstOrderBoundBox(other.hitbox, other.velocity));
};

function checkInboundRectangle(boundBoxA, boundBoxB) {
  // Collision x-axis?
  return boundBoxA.h + boundBoxA.width >= boundBoxB.h && boundBoxB.h + boundBoxB.width >= boundBoxA.h &&
  // Collision y-axis?
   boundBoxA.v + boundBoxA.height >= boundBoxB.v && boundBoxB.v + boundBoxB.height >= boundBoxA.v;
};

function firstOrderBoundBox(hitbox, velocity) {
  if(hitbox.shape == COLLISION_SHAPE_ROUND) {
    return {h: hitbox.h - hitbox.width/2 + Math.max(velocity.h,0) * ENGINE_TIME_TO_PIXEL_CELERITY, v: hitbox.v - hitbox.height/2 + Math.min(velocity.v,0) * ENGINE_TIME_TO_PIXEL_CELERITY,
      width: hitbox.width + Math.abs(velocity.h) * ENGINE_TIME_TO_PIXEL_CELERITY, height: hitbox.height + Math.abs(velocity.v) * ENGINE_TIME_TO_PIXEL_CELERITY};
  } else if(hitbox.shape == COLLISION_SHAPE_BOX) {
    return {h: hitbox.h + Math.max(velocity.h,0) * ENGINE_TIME_TO_PIXEL_CELERITY, v: hitbox.v + Math.min(velocity.v,0) * ENGINE_TIME_TO_PIXEL_CELERITY,
      width: hitbox.width + Math.abs(velocity.h) * ENGINE_TIME_TO_PIXEL_CELERITY, height: hitbox.height + Math.abs(velocity.v) * ENGINE_TIME_TO_PIXEL_CELERITY};
  } else {
    console.log("woops");
    return -1;
  }
};

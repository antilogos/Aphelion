// Translate velocity factor to pixel distance
var ENGINE_TIME_TO_PIXEL_CELERITY = 1 / 500;
var QUADTREE_NODE_ELEMENTS_THRESHOLD = 2;
var QUADTREE_NODE_MIN_LEVEL = 3;

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
      //console.log("element " + collisionBox.h + ":" + collisionBox.v + " did not fit in QT " + this.current.h + "-" + this.current.v + "^" + this.current.level);
      // Determine which quadrant it should go
      if(collisionBox.h <= this.current.h && collisionBox.v <= this.current.v) { //
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
        //console.log("expanding quadtree South West");
      } else if(collisionBox.v <= this.current.v) {
        var newFather = new Quadtree(this.current.level +1, this.current.h, this.current.v - this.current.height);
        newFather.nwChild = new Quadtree(this.current.level, this.current.h, this.current.v - this.current.height);
        newFather.neChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v - this.current.height);
        newFather.seChild = new Quadtree(this.current.level, this.current.h + this.current.width, this.current.v);
        newFather.swChild = this;
        //console.log("expanding quadtree North East");
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
      if(this.current.level < 10) {
        newFather.insertElement(element, true);
      } else {
        console.log("abandonning putting element " + element + " into quadtree");
      }
    } else {
      // Insert, even if reached maximum capacity
      this.current.elements.push(element);
      // If the current node can too many element and can split, split it
      if(this.current.elements.length > QUADTREE_NODE_ELEMENTS_THRESHOLD && this.current.level > QUADTREE_NODE_MIN_LEVEL) {
        console.log()
        // split the elements in 5 groups, those which fit in one of the four quadrants, and those which don't fit in any
        var nw = new Quadtree(this.current.level -1, this.current.h, this.current.v);
        var ne = new Quadtree(this.current.level -1, this.current.h + this.current.width/2, this.current.v);
        var sw = new Quadtree(this.current.level -1, this.current.h, this.current.level.v + this.current.height/2);
        var se = new Quadtree(this.current.level -1, this.current.h + this.current.width/2, this.current.v + this.current.height/2);
        var elementsList = this.current.elements;
        this.current.elements.forEach(function distributeChild(element, index) {
          if(nw.fitInQuad(collisionBox)) {
            elementsList.splice(index, 1);
            nw.insertElement(element, false);
          } else if(ne.fitInQuad(collisionBox)) {
            elementsList.splice(index, 1);
            ne.insertElement(element, false);
          } else if(sw.fitInQuad(collisionBox)) {
            elementsList.splice(index, 1);
            sw.insertElement(element, false);
          } else if(se.fitInQuad(collisionBox)) {
            elementsList.splice(index, 1);
            se.insertElement(element, false);
          }
        });
        this.nwChild = nw;
        this.neChild = ne;
        this.swChild = sw;
        this.seChild = se;
      }
    }
  };

  this.fitInQuad = function fitIn(element) {
    return element.h > this.current.h && element.h + element.width < this.current.h + this.current.width &&
      element.v > this.current.v && element.v + element.height < this.current.v + this.current.height;
  };

  this.update = function update() {
    this.clear();
    var t = this;
    passerbyFactory.passerbyList.forEach(function insertPasserby(p) { t.insertElement(p, true); });
    projectileFactory.projectileList.forEach(function insertProjectile(p) { t.insertElement(p, true); });
    t.insertElement(cursor, true);
  };

  this.draw = function draw() {
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

    if(this.nwChild != null) this.nwChild.draw();
    if(this.neChild != null) this.neChild.draw();
    if(this.swChild != null) this.swChild.draw();
    if(this.seChild != null) this.seChild.draw();

    // DEBUG
    var canvas = CANVAS_BACKGROUND.getContext('2d');
    canvas.font = '8pt Calibri';
    canvas.fillStyle = 'black';
    canvas.fillText(this.debug(), 160, 40);
  };

  this.debug = function() {
    var text = "[L"+quadTree.current.level + ":" + quadTree.current.elements.length;
    if(this.nwChild != null) text += "\nNW=" + this.nwChild.debug();
    if(this.neChild != null) text += "\nNE=" + this.neChild.debug();
    if(this.swChild != null) text += "\nSW=" + this.swChild.debug();
    if(this.seChild != null) text += "\nSE=" + this.seChild.debug();
    text += "]";
    return text;
    //console.log("total of elements : [" + quadTree.current.level + ":" + quadTree.current.elements.length + ",ne:" + (this.neChild!=null?this.neChild.current.elements.length:0) + ",nw" + (this.nwChild!=null?this.nwChild.current.elements.length:0) + ",sw" + (this.swChild!=null?this.swChild.current.elements.length:0) + ",se" + (this.seChild!=null?this.seChild.current.elements.length:0) + "]");
  }
}

var quadTree = new Quadtree(8,0,0);


function checkInboundRectangle(boundBoxA, boundBoxB) {
  // Collision x-axis?
  return boundBoxA.h + boundBoxA.width >= boundBoxB.h && boundBoxB.h + boundBoxB.width >= boundBoxA.h &&
  // Collision y-axis?
   boundBoxA.v + boundBoxA.heitght >= boundBoxB.v && boundBoxB.v + boundBoxB.height >= boundBoxA.v;
};

function firstOrderBoundBox(hitbox, velocity) {
  return {h: hitbox.h - hitbox.width + Math.max(velocity.h,0), v: hitbox.v - hitbox.height + Math.min(velocity.v,0),
    width: hitbox.width + Math.abs(velocity.h), height: hitbox.height + Math.abs(velocity.v)}
};

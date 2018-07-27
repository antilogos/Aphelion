// //////////////////////////////////////////// ENGINE ////////////////////////////////////////////

/*
 * Generic class for one-per-screen container UIObject
 */
var EngineObject = function(x, y, width, height, canvas, text) {
  MenuObject.call(this, x, y, width, height, canvas);
  this.hasFocus = false;
  this.items = [];
};

EngineObject.prototype = Object.create(MenuObject.prototype);
EngineObject.prototype.constructor = EngineObject;

// Call by the stack screen manager
EngineObject.prototype.focus = function() {
  hasFocus = true;
};
EngineObject.prototype.unfocus = function() {
  hasFocus = false;
};

// Call by the animation loop
EngineObject.prototype.collision = function() {
  // Check if mouse click on a button
  for (var i = 0; i < this.items.length; i++) {
    if(collide(this.items[i], {x: inputListener.mouseX, y: inputListener.mouseY, width: 1, height: 1})) {
      if(inputListener.mouseHasRealeased) {
        this.items[i].state = COLLISION_STATUS_ONCLICK;
        this.items[i].action();
      } else {
        this.items[i].state = COLLISION_STATUS_OVER;
      }
    } else {
      this.items[i].state = COLLISION_STATUS_NONE;
    }
  }
};

// Call by the animation loop
EngineObject.prototype.draw = function() {
  // Clear previous animation
  this.context = this.canvas.getContext('2d');
  this.context.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

  // Cascade the Draw function to each sub component of the field
  this.cursor.move();
};

EngineObject.prototype.init = function() {
  this.bgCanvas = document.getElementById('background');
  this.fgCanvas = document.getElementById('foreground');
  if(this.cursor == null) this.cursor = new Cursor();
  this.cursor.init();
  this.background = new Background()
  this.background.init();

  // Initialize quadTree
  this.quadTree = new QuadTree({x:-800,y:-800,width:1600,height:1600});
}

// ///////////////////////////////////////// END OF ENGINE ////////////////////////////////////////

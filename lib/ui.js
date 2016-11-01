/*
 * Generic class to get all interactive element work like a rectangle shape for collision detection
 */
var FirstOrderCollisionBox = function(x, y, width, height, canvas) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.canvas = canvas;
};

var collide = function(a, b) {
  return ! ((a.x + a.width < b.x) || (b.x + b.width < a.x) || (a.y + a.height < b.y) || (b.y + b.height < a.y));
};


/*
 * Class to get all non-game related interactive objects with a text to display
 */
var UIObject = function(x, y, width, height, canvas, text) {
  FirstOrderCollisionBox.call(this, x, y, width, height, canvas);
  this.text = text;
};

UIObject.prototype.displayToScreen = function(posx, posy) {

};

// Call by the animation loop
UIObject.prototype.draw = function() {
  // Clear previous animation
  var contextMenu = this.canvas.getContext('2d');
  contextMenu.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  contextMenu.textAlign = "center";
  contextMenu.fillStyle = "Black";
  contextMenu.font = Math.floor(CANVAS_HEIGHT / 20).toString() + "px Times New Roman";
  contextMenu.fillText(":)", inputListener.mouseX, inputListener.mouseY);
};

UIObject.prototype = Object.create(FirstOrderCollisionBox.prototype);
UIObject.prototype.constructor = UIObject;

/*
 * Generic class for clickable UIObject
 */
var ButtonObject = function(x, y, width, height, canvas, text, action) {
  UIObject.call(this, x, y, width, height, canvas);
  this.text = text;
  this.action = action;
  this.state = -1;
};
ButtonObject.prototype = Object.create(UIObject.prototype);
ButtonObject.prototype.constructor = ButtonObject;

ButtonObject.prototype.draw = function () {
  var contextMenu = this.canvas.getContext('2d');
  contextMenu.beginPath();
  contextMenu.moveTo(this.x, this.y);
  contextMenu.lineTo(this.x + this.width, this.y);
  contextMenu.lineTo(this.x + this.width, this.y + this.height);
  contextMenu.lineTo(this.x, this.y + this.height);
  contextMenu.lineTo(this.x, this.y);
  contextMenu.lineWidth = 1;
  if(this.state == COLLISION_STATUS_OVER) {
    contextMenu.strokeStyle = '#9999FF';
  } else if(this.state == COLLISION_STATUS_ONCLICK) {
    contextMenu.strokeStyle = '#99FF99';
  } else {
    contextMenu.strokeStyle = '#FF9999';
  }
  contextMenu.stroke();
  contextMenu.font = Math.floor(CANVAS_HEIGHT / 20).toString() + "px Times New Roman";
  contextMenu.fillText(this.text, this.x + 5, this.y + Math.floor(CANVAS_HEIGHT / 20) + 5);
};

/*
 * Generic class for one-per-screen container UIObject
 */
var MenuObject = function(x, y, width, height, canvas, text) {
  UIObject.call(this, x, y, width, height, canvas);
  this.hasFocus = false;
  this.items = [];
};

MenuObject.prototype = Object.create(UIObject.prototype);
MenuObject.prototype.constructor = MenuObject;

// Call by the stack screen manager
MenuObject.prototype.focus = function() {
  hasFocus = true;
};
MenuObject.prototype.unfocus = function() {
  hasFocus = false;
};

// Call by the animation loop
MenuObject.prototype.collision = function() {
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
MenuObject.prototype.draw = function() {
  // Clear previous animation
  var contextMenu = this.canvas.getContext('2d');
  contextMenu.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
  // Display all buttons
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].draw();
  }
  // Display cursor
  contextMenu.beginPath();
  contextMenu.strokeStyle = '#009900';
  contextMenu.arc(inputListener.mouseX, inputListener.mouseY, 2, 0, Math.PI*2, true);
  contextMenu.stroke();
};

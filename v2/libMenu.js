/* Global variable
 */
var CANVAS_WIDTH = 600;
var CANVAS_HEIGHT = 400;
var GLOBAL_TEXT_SIZE = 15;

// Creating all html element from javascript
var viewportDiv = document.createElement('div');
viewportDiv.setAttribute("id", "viewport");
viewportDiv.setAttribute("className", "viewport");
viewportDiv.style.border = "5px solid #201513";
viewportDiv.style.width = "" + CANVAS_WIDTH + "px";
viewportDiv.style.height = "" + CANVAS_HEIGHT + "px";
viewportDiv.style.margin = "30px auto";
viewportDiv.style.position = "relative";
viewportDiv.style.overflow = "hidden";
viewportDiv.style.borderRadius = "5px";
viewportDiv.style.boxShadow = "0 0 5px 5px #503530";
viewportDiv.style.fontFamily = "Offside, sans-serif";
viewportDiv.style.userSelect = "none";
viewportDiv.style.cursor = "none";
var CANVAS_BACKGROUND = document.createElement('canvas');
CANVAS_BACKGROUND.setAttribute("id", "background");
CANVAS_BACKGROUND.style.zIndex = -40;
CANVAS_BACKGROUND.style.position = "absolute";
CANVAS_BACKGROUND.width = CANVAS_WIDTH;
CANVAS_BACKGROUND.height = CANVAS_HEIGHT;
var CANVAS_FOREGROUND = document.createElement('canvas');
CANVAS_FOREGROUND.setAttribute("id", "foreground");
CANVAS_FOREGROUND.style.zIndex = -30;
CANVAS_FOREGROUND.style.position = "absolute";
CANVAS_FOREGROUND.width = CANVAS_WIDTH;
CANVAS_FOREGROUND.height = CANVAS_HEIGHT;
var CANVAS_HEADUP = document.createElement('canvas');
CANVAS_HEADUP.setAttribute("id", "headup");
CANVAS_HEADUP.style.zIndex = -20;
CANVAS_HEADUP.style.position = "absolute";
CANVAS_HEADUP.width = CANVAS_WIDTH;
CANVAS_HEADUP.height = CANVAS_HEIGHT;
var CANVAS_MENU = document.createElement('canvas');
CANVAS_MENU.setAttribute("id", "menu");
CANVAS_MENU.style.zIndex = -10;
CANVAS_MENU.style.position = "absolute";
CANVAS_MENU.width =  CANVAS_WIDTH;
CANVAS_MENU.height = CANVAS_HEIGHT;

/*
 * Common function, check if mouse is in the rectangle
 */
var checkInbound = function inbound(listener, rectangle) {
  return listener.mouseX > rectangle.x && listener.mouseX < rectangle.x + rectangle.width
    && listener.mouseY > rectangle.y && listener.mouseY < rectangle.y + rectangle.height;
}

function Menu() {
  this.button = [];
  this.draw = function draw() {
    var context = CANVAS_MENU.getContext('2d');
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.button.forEach(function draw(b) { b.draw(); });
    // Display cursor
    context.beginPath();
    context.strokeStyle = '#009900';
    context.arc(inputListener.mouseX, inputListener.mouseY, 2, 0, Math.PI*2, true);
    context.stroke();
  }
}

function Button(label, x, y, width, height, action, hover) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.action = action;
  this.hover = hover;
  this.context = CANVAS_MENU.getContext('2d');
  this.draw = function draw() {
    if(inputListener.mouseHasClicked) {
      if(checkInbound(inputListener, this)) {
        var colour = '#FF9999';
        this.ready = true;
      } else {
        var colour = '#9999FF';
        this.ready = false;
      }
    } else if(checkInbound(inputListener, this)) {
      var colour = '#99FF99';
      if(this.ready) {
        this.ready = false;
        this.action();
      }
      if(this.hover != null) this.hover();
    } else {
      var colour = '#9999FF';
      this.ready = false;
    }
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = colour;
    this.context.strokeRect(this.x, this.y, this.width, this.height);
    this.context.textAlign = "center";
    this.context.fillStyle = colour;
    this.context.font = GLOBAL_TEXT_SIZE.toString() + "px Times New Roman";
    this.context.fillText(this.label, this.x + this.width/2, this.y + this.height/2 + GLOBAL_TEXT_SIZE/2);
  }
  this.ready = false;
}

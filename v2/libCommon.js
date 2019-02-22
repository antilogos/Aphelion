function stillAlive(o) { return o.state.alive || o.state.lifespan != 0; };
function checkDeath(o) { o.state.lifespan -= Math.min(o.timeKeeper.update, o.state.lifespan); };

/* Get an object and update it with the time kept in inputListener, to remove time when document is iddle or field is iddle */
function timeUpdate(o) {
}

function textWrapping(context, text, x, y, maxWidth, lineHeight) {
  text.split('\n').forEach(function lineDelimiter(paragraph) {
    paragraph.split(' ').reduce(function wordDelimiter(currentLine, currentWord) {
     if(context.measureText(currentLine+' '+currentWord).width > maxWidth) {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine, x, y);
       y += lineHeight;
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentWord, x, y);
       return currentWord;
     } else {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine+' '+currentWord, x, y);
       return currentLine+' '+currentWord;
     }
   });
   y += lineHeight;
 });
};

function InputListener() {
  this.mouseX;
  this.mouseY;
  this.mouseHasClicked;
  this.mouseHasRealeased;
  this.keyup = [];
}

function TimeKeeper() {
  // Time of iddling or -1 if active
  this.iddle = -1;
  // Time of activity or -1 if iddle
  this.active = Date.now();
  // Time of last update made
  this.seen = Date.now();
  // Time window to use for updating object
  this.update = 0;

  this.onDraw = function onDraw() {
  }

  this.onUpdate = function onUpdate() {
    var now = Date.now();
    // Getting focus back
    if(this.active == -1) {
      // Remove iddle time from the last seen
      this.update = this.iddle - this.seen;
      // console.log("get Focus back");
      this.active = now;
      this.iddle = -1;
      this.seen = now;
    } else {
      this.update = now - this.seen;
      this.seen = now;
      this.active = now;
    }
    // Make time not suffer from framerate drop, = Frequency of refresh
    // Math.min(this.update/60,1);
  }

  this.onIddle = function onIddle() {
    // Losing focus
    if(this.iddle == -1) {
      // console.log("losing Focus");
      this.iddle = Date.now();
      this.active = -1;
    }
  }
}

/**
 * Define the direction in Radiant from object x to object y.
 * Return 0 for south, PI/2 for west, PI for north and 3/2PI for east
 */
function angularDistance(xh, xv, yh, yv) {
  var h = yh - xh;
  var v = yv - xv;
  if(Math.sign(h) == -1) theta = Math.atan(v/h) ;
  else theta = Math.atan(v/h) + Math.PI;
  return theta % (2*Math.PI);
}

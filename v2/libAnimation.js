/*
 * Background animation
 */
function Animation() {
  this.last = {seen: Date.now(), fire: Date.now(), update: 0};
  this.hitbox = {h: 0, v: 0, width: 0, height: 0, radius: 0};
  this.velocity = {h: 0, v: 0, n:25};
  this.state = {decay: 0, alive: true};

  this.update = function update() {
    // Only care about in screen animation
    if(this.hitbox.h - cursor.hitbox.h > - CANVAS_WIDTH - this.hitbox.width
      && this.hitbox.h - cursor.hitbox.h < CANVAS_WIDTH + this.hitbox.width
      && this.hitbox.v - cursor.hitbox.v > - CANVAS_HEIGHT - this.hitbox.height
      && this.hitbox.v - cursor.hitbox.v < CANVAS_HEIGHT + this.hitbox.height) {
      this.last.update = Date.now() - this.last.seen;
      this.last.seen += this.last.update;

      this.hitbox.h += this.velocity.h * ENGINE_TIME_TO_PIXEL_CELERITY * this.last.update;
      this.hitbox.v += this.velocity.v * ENGINE_TIME_TO_PIXEL_CELERITY * this.last.update;
    }
  }

  this.draw = function draw() {
    // Only care about in screen passerby
    if(this.hitbox.h - cursor.hitbox.h > - CANVAS_WIDTH - this.hitbox.width
      && this.hitbox.h - cursor.hitbox.h < CANVAS_WIDTH + this.hitbox.width
      && this.hitbox.v - cursor.hitbox.v > - CANVAS_HEIGHT - this.hitbox.height
      && this.hitbox.v - cursor.hitbox.v < CANVAS_HEIGHT + this.hitbox.height) {
      // Draw
      var canvasBg = CANVAS_BACKGROUND.getContext('2d');
      canvasBg.beginPath();
      canvasBg.arc(this.hitbox.h - cursor.hitbox.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.hitbox.v + CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
      canvasBg.lineWidth = 1;

      canvasBg.stroke();
    }
  }
}

function AnimationFactory() {

  this.animationList = [];

  this.spawn = function() {
    var animation = new Animation();
    this.animationList.push(animation);
  }

  this.update = function update() {
    this.animationList.forEach(function update(a) { a.update() });
    this.animationList = this.animationList.filter( function stillAlive(a) { return a.state.alive; });
  }

  this.draw = function draw() {
    this.animationList.forEach(function draw(a) { a.draw() });
  }
}

var animationFactory = new AnimationFactory();

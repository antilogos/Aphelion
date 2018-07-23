/*
 *
 */
function Projectile(weapon) {
  this.lastseen = Date.now();
  this.updateTime = 0;
  this.behaviour = new DefaultBehaviour(this);
  this.hitbox = {h: 0, v: 0, width: 2, height: 2, radius: 1};
  this.velocity = {h: 0, v: 0, n:25};
  this.weapon = {target: 0, damage: 100};
  this.state = {alive: true, lifespan: Date.now() + 6000};

  this.update = function update() {
     // Delete old Projectile
     if(this.state.lifespan < Date.now()) {
       this.state.alive = false;
     }
     // Only care about in screen
     if(this.hitbox.h - cursor.hitbox.h > - CANVAS_WIDTH - this.hitbox.width
       && this.hitbox.h - cursor.hitbox.h < CANVAS_WIDTH + this.hitbox.width
       && this.hitbox.v - cursor.hitbox.v > - CANVAS_HEIGHT - this.hitbox.height
       && this.hitbox.v - cursor.hitbox.v < CANVAS_HEIGHT + this.hitbox.height) {
       this.updateTime = Date.now() - this.lastseen;
       this.lastseen += this.updateTime;

       // Manage movement
       if(this.behaviour.move) this.behaviour.move();

       this.hitbox.h += this.velocity.h * ENGINE_TIME_TO_PIXEL_CELERITY * this.updateTime;
       this.hitbox.v += this.velocity.v * ENGINE_TIME_TO_PIXEL_CELERITY * this.updateTime;
     }
  }

  this.draw = function draw() {
   // Only care about in screen
   if(this.hitbox.h - cursor.hitbox.h > - CANVAS_WIDTH - this.hitbox.width
     && this.hitbox.h - cursor.hitbox.h < CANVAS_WIDTH + this.hitbox.width
     && this.hitbox.v - cursor.hitbox.v > - CANVAS_HEIGHT - this.hitbox.height
     && this.hitbox.v - cursor.hitbox.v < CANVAS_HEIGHT + this.hitbox.height) {
     // Draw
     var canvasFg = CANVAS_FOREGROUND.getContext('2d');
     canvasFg.beginPath();
     canvasFg.arc(this.hitbox.h - cursor.hitbox.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.hitbox.v + CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
     canvasFg.lineWidth = 1;
     canvasFg.strokeStyle = '#330000';

     canvasFg.stroke();
   }
 }
}

function ProjectileFactory() {

 this.projectileList = [];

 this.spawn = function(initPos, initVel, initWep) {
   var projectile = new Projectile();
   this.projectileList.push(projectile);
   // Initial launch
   projectile.hitbox.h = initPos.h;
   projectile.hitbox.v = initPos.v;
   // Initial inertia
   projectile.velocity.h = initVel.h;
   projectile.velocity.v = initVel.v;
   projectile.velocity.n = Math.sqrt(Math.pow(initVel.h,2)+Math.pow(initVel.v,2));
   // Initial weapon definition
   // Behaviour of projectile
   projectile.behaviour = new DefaultBehaviour(projectile);
 }

 this.update = function update() {
   this.projectileList.forEach(function update(p) { p.update(); });
   this.projectileList = this.projectileList.filter( function stillAlive(p) { return p.state.alive; });
 }

 this.draw = function draw() {
   this.projectileList.forEach(function draw(p) { p.draw(); });
 }
}

var projectileFactory = new ProjectileFactory();

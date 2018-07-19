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
 this.state = {alive: true};

 this.draw = function draw() {
   // Only care about in screen
   if(this.hitbox.h - cursor.position.h > - CANVAS_WIDTH - this.hitbox.width
     && this.hitbox.h - cursor.position.h < CANVAS_WIDTH + this.hitbox.width
     && this.hitbox.v - cursor.position.v > - CANVAS_HEIGHT - this.hitbox.height
     && this.hitbox.v - cursor.position.v < CANVAS_HEIGHT + this.hitbox.height) {
     this.updateTime = Date.now() - this.lastseen;
     this.lastseen += this.updateTime;

     // Manage movement
     if(this.behaviour.move) this.behaviour.move();

     this.hitbox.h += this.velocity.h * ENGINE_TIME_TO_PIXEL_CELERITY * this.updateTime;
     this.hitbox.v += this.velocity.v * ENGINE_TIME_TO_PIXEL_CELERITY * this.updateTime;
     // Manage firing


     // Draw
     var canvasFg = CANVAS_FOREGROUND.getContext('2d');
     canvasFg.beginPath();
     canvasFg.arc(this.hitbox.h - cursor.position.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.position.v + CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
     canvasFg.lineWidth = 1;
     if (this.behaviour instanceof ChasingBehaviour) {
       canvasFg.strokeStyle = '#000033';
     } else if (this.behaviour instanceof SteeringBehaviour) {
       canvasFg.strokeStyle = '#003300';
     } else {
       canvasFg.strokeStyle = '#330000';
     }

     canvasFg.stroke();
   }
 }
}

function ProjectileFactory() {

 this.projectileList = [];

 this.spawn = function() {
   var projectile = new Projectile();
   this.projectileList.push(projectile);
   // Pick a location on the spawn circle
   var random = Math.random() * Math.PI * 2;
   projectile.hitbox.h = cursor.position.h + (Math.cos(random) * PASSERBY_SPAWN_CIRCLE);
   projectile.hitbox.v = cursor.position.v + (Math.sin(random) * PASSERBY_SPAWN_CIRCLE);
   // Speed inversed and lowered to move toward center
   projectile.velocity.h = Math.cos(random) * -1 * projectile.velocity.n;
   projectile.velocity.v = Math.sin(random) * -1 * projectile.velocity.n;
   // Behaviour of projectile
   projectile.behaviour = new DefaultBehaviour(projectile);
 }

 this.draw = function draw() {
   this.projectileList.forEach(function draw(p) { p.draw() });
 }
}

var projectileFactory = new ProjectileFactory();

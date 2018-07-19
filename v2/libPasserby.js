PASSERBY_SPAWN_CIRCLE = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.45;
/*
 *
 */
function Passerby() {
  this.last = {seen: Date.now(), fire: Date.now(), update: 0};
  this.behaviour = new ChasingBehaviour(this);
  this.hitbox = {h: 0, v: 0, width: 2, height: 2, radius: 2};
  this.velocity = {h: 0, v: 0, n:25};
  this.weapon = new Weapon();
  this.hull = {alive: true, shield: 100};
  this.target = cursor;

  this.draw = function draw() {
    // Only care about in screen passerby
    if(this.hitbox.h - cursor.position.h > - CANVAS_WIDTH - this.hitbox.width
      && this.hitbox.h - cursor.position.h < CANVAS_WIDTH + this.hitbox.width
      && this.hitbox.v - cursor.position.v > - CANVAS_HEIGHT - this.hitbox.height
      && this.hitbox.v - cursor.position.v < CANVAS_HEIGHT + this.hitbox.height) {
      this.last.update = Date.now() - this.last.seen;
      this.last.seen += this.last.update;

      // Manage movement
      if(this.behaviour.move) this.behaviour.move();

      this.hitbox.h += this.velocity.h * ENGINE_TIME_TO_PIXEL_CELERITY * this.last.update;
      this.hitbox.v += this.velocity.v * ENGINE_TIME_TO_PIXEL_CELERITY * this.last.update;
      // Manage firing


      // Draw
      var canvasFg = CANVAS_FOREGROUND.getContext('2d');
      canvasFg.beginPath();
      canvasFg.arc(this.hitbox.h - cursor.position.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.position.v + CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
      canvasFg.lineWidth = 1;
      if (this.behaviour instanceof ComplexeBehaviourHarrier) {
        canvasFg.strokeStyle = '#6633BB';
      } else if (this.behaviour instanceof ComplexeBehaviourHunter) {
        canvasFg.strokeStyle = '#66BB33';
      } else {
        canvasFg.strokeStyle = '#EE33EE';
      }

      canvasFg.stroke();
    }
  }
}

function PasserbyFactory() {

  this.passerbyList = [];

  this.spawn = function() {
    var passerby = new Passerby();
    this.passerbyList.push(passerby);
    // Pick a location on the spawn circle
    var random = Math.random() * Math.PI * 2;
    passerby.hitbox.h = cursor.position.h + (Math.cos(random) * PASSERBY_SPAWN_CIRCLE);
    passerby.hitbox.v = cursor.position.v + (Math.sin(random) * PASSERBY_SPAWN_CIRCLE);
    // Speed inversed and lowered to move toward center
    passerby.velocity.h = Math.cos(random) * -1 * passerby.velocity.n;
    passerby.velocity.v = Math.sin(random) * -1 * passerby.velocity.n;
    var randomBehaviour = Math.floor(Math.random() * 3);
    if(randomBehaviour == 2) {
      passerby.behaviour = new ChasingBehaviour(passerby);
    } else if(randomBehaviour == 1) {
      passerby.behaviour = new ComplexeBehaviourHarrier(passerby);
    } else {
      passerby.behaviour = new ComplexeBehaviourHunter(passerby);
    }
  }

  this.draw = function draw() {
    var canvasFg = CANVAS_FOREGROUND.getContext('2d');
    canvasFg.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.passerbyList.forEach(function draw(p) { p.draw() });
    if(this.passerbyList.length < 20) this.spawn();
  }
}

var passerbyFactory = new PasserbyFactory();

/*
 *
 */
function DefaultBehaviour(passerby) {
 this.move = function move() {
   // Nothing to do
 }
}

function ChasingBehaviour(passerby) {
  this.passerby = passerby;

  this.move = function move() {
    // Trajectory correction
    var diffX = this.passerby.hitbox.h - passerby.target.hitbox.h;
    var diffY = this.passerby.hitbox.v - passerby.target.hitbox.v;
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffX / diffN * this.passerby.velocity.n;
    var diffV = diffY / diffN * this.passerby.velocity.n;
    // TODO smooth turn
    this.passerby.velocity.h = -diffH;
    this.passerby.velocity.v = -diffV;
  }
}

function OrbitingBehaviour(passerby) {
  this.passerby = passerby;
  this.clockwise = Math.floor(Math.random() * 2) == 0;
  this.move = function move() {
    // Trajectory correction
    if(this.clockwise) {
      var orbitX = (this.passerby.target.hitbox.v - this.passerby.hitbox.v);
      var orbitY = (this.passerby.hitbox.h - this.passerby.target.hitbox.h);
    } else {
      var orbitX = (this.passerby.hitbox.v - this.passerby.target.hitbox.v);
      var orbitY = (this.passerby.target.hitbox.h - this.passerby.hitbox.h);
    }
    normal = Math.sqrt(Math.pow(orbitX,2)+Math.pow(orbitY,2));
    if(normal > this.passerby.velocity.n) {
      orbitX = orbitX * this.passerby.velocity.n / normal;
      orbitY = orbitY * this.passerby.velocity.n / normal;
    }
    //
    this.passerby.velocity.h = -orbitX;
    this.passerby.velocity.v = -orbitY;
  }
}

function FleeingBehaviour(passerby) {
  this.passerby = passerby;

  this.move = function move() {
    // Trajectory correction
    var diffX = this.passerby.hitbox.h - passerby.target.hitbox.h;
    var diffY = this.passerby.hitbox.v - passerby.target.hitbox.v;
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffX / diffN * this.passerby.velocity.n;
    var diffV = diffY / diffN * this.passerby.velocity.n;
    // TODO smooth turn
    this.passerby.velocity.h = diffH;
    this.passerby.velocity.v = diffV;
  }
}


function FireAtWill(passerby) {
  this.passerby = passerby;

  this.move = function move() {
    // Always fire when ready
    if(this.passerby.last.seen - this.passerby.last.fire > 1000/this.passerby.weapon.fireRate * 5 /*firerate factor for IA*/) {
      // Define projectile state
      var initVelN = Math.sqrt(Math.pow(this.passerby.target.hitbox.h - this.passerby.hitbox.h,2) + Math.pow(this.passerby.target.hitbox.v - this.passerby.hitbox.v,2));
      var initVel = {h: (this.passerby.target.hitbox.h - this.passerby.hitbox.h) / initVelN * this.passerby.weapon.velocity, v: (this.passerby.target.hitbox.v - this.passerby.hitbox.v) / initVelN * this.passerby.weapon.velocity}
      // Confirm creation of projectile
      projectileFactory.spawn(this.passerby.hitbox, initVel, this.weapon);
      // Update firing state
      this.passerby.last.fire = Date.now();
    }
  }
}


function ComplexeBehaviourHunter(passerby) {
  this.passerby = passerby;
  this.chasingBehaviour = new ChasingBehaviour(passerby);
  this.fireAtWill = new FireAtWill(passerby);
  this.fleeingBehaviour = new FleeingBehaviour(passerby);

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.passerby.hitbox.h - this.passerby.target.hitbox.h,2) + Math.pow(this.passerby.hitbox.v - this.passerby.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE) {
      this.fleeingBehaviour.move();
    } else {
      this.chasingBehaviour.move();
    }
    this.fireAtWill.move();
  }
}

function ComplexeBehaviourHarrier(passerby) {
  this.passerby = passerby;
  this.chasingBehaviour = new ChasingBehaviour(passerby);
  this.fireAtWill = new FireAtWill(passerby);
  this.fleeingBehaviour = new FleeingBehaviour(passerby);
  this.orbitingBehaviour = new OrbitingBehaviour(passerby);
  this.inConfortZone = false;

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.passerby.hitbox.h - this.passerby.target.hitbox.h,2) + Math.pow(this.passerby.hitbox.v - this.passerby.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE * .65) {
      this.fleeingBehaviour.move();
      this.inConfortZone = false;
    } else if(distance > PASSERBY_SPAWN_CIRCLE * 1.35) {
      this.chasingBehaviour.move();
      this.inConfortZone = false;
    } else {
      this.orbitingBehaviour.move();
      this.inConfortZone = true;
    }
    this.fireAtWill.move();
  }
}

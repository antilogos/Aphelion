var TURNOVER_SPEED_FACTOR_MS = Math.PI / 100;
/*
 *
 */
function DefaultBehaviour(object) {
 this.move = function move() {
   // Nothing to do
 }
}

function ChasingBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Target vector normalize with velocity
    var ox = this.object.target.hitbox.h - this.object.hitbox.h;
    var oy = this.object.target.hitbox.v - this.object.hitbox.v;

    // Calculate corrective trajectory angle
    var thetaTarget = angularDistance(this.object.target.hitbox.h, this.object.target.hitbox.v, this.object.hitbox.h, this.object.hitbox.v);
    var thetaCurrent = angularDistance(this.object.velocity.h, this.object.velocity.v, this.object.hitbox.h, this.object.hitbox.v);
    // Angles are between 0 and 2*PI, diff will be put into a [-PI:PI] interval, so that 0 to PI is turning left and 0 to -PI is turning right
    // Then, apply the turning radiant maximum speed to it to get the max angle reachable in time (should apply square function to smooth displacement without impact from framerate)
    var thetaDiff = ((thetaTarget - thetaCurrent + Math.PI*2 ) % (Math.PI*2));
    if(thetaDiff > Math.PI) {
      var thetaNow = Math.max(-2*Math.PI + thetaDiff, -1 * TURNOVER_SPEED_FACTOR_MS * this.object.timeKeeper.update);
    } else {
      var thetaNow = Math.min(thetaDiff, TURNOVER_SPEED_FACTOR_MS * this.object.timeKeeper.update);
    }
    //console.log("dirrection angle: " + thetaCurrent.toFixed(2));
    //console.log("correction angle: " + thetaNow.toFixed(2));
    // Apply corrective angle
    var diffX = -1*Math.cos(thetaCurrent + thetaNow);
    var diffY = -1*Math.sin(thetaCurrent + thetaNow);
//https://www.w3schools.com/code/tryit.asp?filename=G1DEJM5IYDOY
    /*
    var diffVelN = Math.sqrt(Math.pow(diffVelH,2)+Math.pow(diffVelV,2));
    if(diffVelN > Math.sqrt(Math.pow(this.object.last.dh,2)+Math.pow(this.object.last.dv,2))) {
      // Adjust target velocity within the object capability
    }
    // Change velocity
    this.object.velocity.h = diffVelH / TURNOVER_SPEED_FACTOR_MS;
    this.object.velocity.v = diffVelV / TURNOVER_SPEED_FACTOR_MS;
    */

    // Target trajectory
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffN == 0 ? 0 : diffX / diffN * this.object.velocity.n;
    var diffV = diffN == 0 ? 0 : diffY / diffN * this.object.velocity.n;
    // Displacement vector between target and anticipated movement
    var diffT = this.object.timeKeeper.updateTime;

    // TODO smooth turn
    this.object.last.dh = this.object.velocity.h;
    this.object.last.dv = this.object.velocity.v;
    this.object.velocity.h = -diffH;
    this.object.velocity.v = -diffV;
  }
}

function OrbitingBehaviour(object) {
  this.object = object;
  this.clockwise = Math.floor(Math.random() * 2) == 0;
  this.move = function move() {
    // Trajectory correction
    if(this.clockwise) {
      var orbitX = (this.object.target.hitbox.v - this.object.hitbox.v);
      var orbitY = (this.object.hitbox.h - this.object.target.hitbox.h);
    } else {
      var orbitX = (this.object.hitbox.v - this.object.target.hitbox.v);
      var orbitY = (this.object.target.hitbox.h - this.object.hitbox.h);
    }
    normal = Math.sqrt(Math.pow(orbitX,2)+Math.pow(orbitY,2));
    if(normal > this.object.velocity.n) {
      orbitX = normal == 0 ? 0 : orbitX * this.object.velocity.n / normal;
      orbitY = normal == 0 ? 0 : orbitY * this.object.velocity.n / normal;
    }
    // Save new speed
    this.object.last.dh = this.object.velocity.h;
    this.object.last.dv = this.object.velocity.v;
    //
    this.object.velocity.h = -orbitX;
    this.object.velocity.v = -orbitY;
  }
}

function FleeingBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Trajectory correction
    var diffX = this.object.hitbox.h - object.target.hitbox.h;
    var diffY = this.object.hitbox.v - object.target.hitbox.v;
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffN == 0 ? 0 : diffX / diffN * this.object.velocity.n;
    var diffV = diffN == 0 ? 0 : diffY / diffN * this.object.velocity.n;
    // TODO smooth turn
    // Save new speed
    this.object.last.dh = this.object.velocity.h;
    this.object.last.dv = this.object.velocity.v;
    this.object.velocity.h = diffH;
    this.object.velocity.v = diffV;
  }
}


function FireAtWill(object) {
  this.object = object;

  this.move = function move() {
    // Always fire when ready
    if(this.object.timeKeeper.seen - this.object.last.fire > 1000/this.object.weapon.fireRate * 5 /*firerate factor for IA*/) {
      // Define projectile state
      var initVelN = Math.sqrt(Math.pow(this.object.target.hitbox.h - this.object.hitbox.h,2) + Math.pow(this.object.target.hitbox.v - this.object.hitbox.v,2));
      var initVel = initVelN == 0 ? {h:0, v:0} : {h: (this.object.target.hitbox.h - this.object.hitbox.h) / initVelN * this.object.weapon.velocity, v: (this.object.target.hitbox.v - this.object.hitbox.v) / initVelN * this.object.weapon.velocity}
      // Confirm creation of projectile
      projectileFactory.spawn(this.object.hitbox, initVel, this.weapon);
      // Update firing state
      this.object.last.fire = Date.now();
    }
  }
}


function ComplexeBehaviourHunter(object) {
  this.object = object;
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.fireAtWill = new FireAtWill(object);
  this.fleeingBehaviour = new FleeingBehaviour(object);

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.object.hitbox.h - this.object.target.hitbox.h,2) + Math.pow(this.object.hitbox.v - this.object.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE) {
      this.fleeingBehaviour.move();
    } else {
      this.chasingBehaviour.move();
    }
    this.fireAtWill.move();
  }
}

function ComplexeBehaviourHarrier(object) {
  this.object = object;
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.fireAtWill = new FireAtWill(object);
  this.fleeingBehaviour = new FleeingBehaviour(object);
  this.orbitingBehaviour = new OrbitingBehaviour(object);
  this.inConfortZone = false;

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.object.hitbox.h - this.object.target.hitbox.h,2) + Math.pow(this.object.hitbox.v - this.object.target.hitbox.v,2));
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

var TURNOVER_SPEED_FACTOR_MS = Math.PI / 2000;
/*
 *
 */
function DefaultBehaviour(object) {
 this.move = function move() {
   // Nothing to do
 }
}

// SIMPLE MOVEMENT BEHAVIOUR ///////////////////////////////////////////////////

function ChasingBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Target vector normalize with velocity
    var ox = this.object.target.hitbox.h - this.object.hitbox.h;
    var oy = this.object.target.hitbox.v - this.object.hitbox.v;

    // Calculate corrective trajectory angle
    var thetaTarget = angularDistance(this.object.target.hitbox.h, this.object.target.hitbox.v, this.object.hitbox.h, this.object.hitbox.v);
    var thetaCurrent = angularDistance(this.object.velocity.h, this.object.velocity.v, 0, 0);
    // Angles are between 0 and 2*PI, diff will be put into a [-PI:PI] interval, so that 0 to PI is turning left and 0 to -PI is turning right
    // Then, apply the turning radiant maximum speed to it to get the max angle reachable in time (should apply square function to smooth displacement without impact from framerate)
    var thetaDiff = ((thetaTarget - thetaCurrent + Math.PI*2 ) % (Math.PI*2));
    if(thetaDiff > Math.PI) {
      var thetaNow = Math.max(-2*Math.PI + thetaDiff, -1 * TURNOVER_SPEED_FACTOR_MS * this.object.timeKeeper.update);
    } else {
      var thetaNow = Math.min(thetaDiff, TURNOVER_SPEED_FACTOR_MS * this.object.timeKeeper.update);
    }
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

function OntoesBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // TODO
    // If object in vital space, try to dodge the bullet, else, return to safe point
  }
}

function WanderingBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // TODO
    // Define a seed, then a function of time to describe the path
    // (make an radius projection of a null gain function?)
  }
}

// SIMPLE FIRING BEHAVIOUR /////////////////////////////////////////////////////

function FireAtWillBehaviour(object) {
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

function UnleashBehaviour(object) {
  this.object = object;
  this.projToReload = 0;
  this.chilling = false;

  this.move = function move() {
    // Wait until max heat then fire at will untill no more heat
    if(this.object.timeKeeper.seen - this.object.last.fire > 1000/this.object.weapon.fireRate * 1  /*firerate factor for IA*/) {
      // Define projectile state
      var initVelN = Math.sqrt(Math.pow(this.object.target.hitbox.h - this.object.hitbox.h,2) + Math.pow(this.object.target.hitbox.v - this.object.hitbox.v,2));
      var initVel = initVelN == 0 ? {h:0, v:0} : {h: (this.object.target.hitbox.h - this.object.hitbox.h) / initVelN * this.object.weapon.velocity, v: (this.object.target.hitbox.v - this.object.hitbox.v) / initVelN * this.object.weapon.velocity}
      // Confirm creation of projectile
      if(Math.random() * 120 > this.projToReload && !this.chilling) {
        this.projToReload = this.projToReload + 1;
        projectileFactory.spawn(this.object.hitbox, initVel, this.weapon);
      } else {
        this.projToReload = this.projToReload - 1;
        this.chilling = true;
      }
      // Update firing state
      this.object.last.fire = Date.now();
    }
  }
}

function HoldBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Hold fire
  }
}

function SnipeBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Fire when reaching maximum heat
    if(this.object.timeKeeper.seen - this.object.last.fire > 1000/this.object.weapon.fireRate * 6 /*firerate factor for IA*/) {
      // Define projectile state
      var initVelN = Math.sqrt(Math.pow(this.object.target.hitbox.h - this.object.hitbox.h,2) + Math.pow(this.object.target.hitbox.v - this.object.hitbox.v,2));
      var projection = {h: 0, v: 0}; // TODO aim at the point of impact
      var initVel = initVelN == 0 ? {h:0, v:0} : {h: (this.object.target.hitbox.h - this.object.hitbox.h) / initVelN * this.object.weapon.velocity, v: (this.object.target.hitbox.v - this.object.hitbox.v) / initVelN * this.object.weapon.velocity}
      // Confirm creation of projectile
      projectileFactory.spawn(this.object.hitbox, initVel, this.weapon);
      // Update firing state
      this.object.last.fire = Date.now();
    }
  }
}

function SuppressBehaviour(object) {
  this.object = object;

  this.move = function move() {
    // Randomly fire (following a seed) if able (seed based on fireate)
    if(this.object.timeKeeper.seen - this.object.last.fire > 1000/this.object.weapon.fireRate * 5 /*firerate factor for IA*/
      && Math.floor(Math.random()*1000) > 990) {
      // Define projectile state
      var initVelN = Math.sqrt(Math.pow(this.object.target.hitbox.h - this.object.hitbox.h,2) + Math.pow(this.object.target.hitbox.v - this.object.hitbox.v,2));
      // Aim at a random point around the target
      var deviation = {h: (this.object.target.hitbox.h - this.object.hitbox.h) * (1+ (Math.floor(Math.random()*20) -10)/100),
        v: (this.object.target.hitbox.v - this.object.hitbox.v) * (1+ (Math.floor(Math.random()*20) -10)/100)};
      var initVel = initVelN == 0 ? {h:0, v:0} : {h: deviation.h / initVelN * this.object.weapon.velocity, v: deviation.v / initVelN * this.object.weapon.velocity}
      // Confirm creation of projectile
      projectileFactory.spawn(this.object.hitbox, initVel, this.weapon);
      // Update firing state
      this.object.last.fire = Date.now();
    }
  }
}

// COMPLEX BEHAVIOUR ///////////////////////////////////////////////////////////

function ComplexeBehaviourSkirmish(object) {
  this.object = object;
  this.dodgingBehaviour = new DodgingBehaviour(object);
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.fleeingBehaviour = new FleeingBehaviour(object);
  this.snipeBehaviour = new SnipeBehaviour(object);
  this.suppressBehaviour = new SuppressBehaviour(object);
  this.unleashBehaviour = new UnleashBehaviour(object);

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.object.hitbox.h - this.object.target.hitbox.h,2) + Math.pow(this.object.hitbox.v - this.object.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE * .65) {
      this.fleeingBehaviour.move();
      this.snipeBehaviour.move();
      this.inConfortZone = false;
    } else if(distance > PASSERBY_SPAWN_CIRCLE * 1.35) {
      this.dodgingBehaviour.move();
      this.suppressBehaviour.move();
      this.inConfortZone = false;
    } else {
      this.chasingBehaviour.move();
      this.unleashBehaviour.move();
      this.inConfortZone = true;
    }
  }
}

function ComplexeBehaviourHarrier(object) {
  this.object = object;
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.fleeingBehaviour = new FleeingBehaviour(object);
  this.orbitingBehaviour = new OrbitingBehaviour(object);
  this.fireAtWillBehaviour = new FireAtWillBehaviour(object);
  this.snipeBehaviour = new SnipeBehaviour(object);
  this.suppressBehaviour = new SuppressBehaviour(object);
  this.inConfortZone = false;

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.object.hitbox.h - this.object.target.hitbox.h,2) + Math.pow(this.object.hitbox.v - this.object.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE * .65) {
      this.fleeingBehaviour.move();
      this.suppressBehaviour.move();
      this.inConfortZone = false;
    } else if(distance > PASSERBY_SPAWN_CIRCLE * 1.35) {
      this.chasingBehaviour.move();
      this.snipeBehaviour.move();
      this.inConfortZone = false;
    } else {
      this.orbitingBehaviour.move();
      this.fireAtWillBehaviour.move();
      this.inConfortZone = true;
    }
  }
}

function ComplexeBehaviourHunter(object) {
  this.object = object;
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.fleeingBehaviour = new FleeingBehaviour(object);
  this.fireAtWillBehaviour = new FireAtWillBehaviour(object);
  this.unleashBehaviour = new UnleashBehaviour(object);

  this.move = function move() {
    // Determine behaviour to have dependending on the distance to target
    var distance = Math.sqrt(Math.pow(this.object.hitbox.h - this.object.target.hitbox.h,2) + Math.pow(this.object.hitbox.v - this.object.target.hitbox.v,2));
    if(distance < PASSERBY_SPAWN_CIRCLE) {
      this.fleeingBehaviour.move();
      this.unleashBehaviour.move();
    } else {
      this.chasingBehaviour.move();
      this.fireAtWillBehaviour.move();
    }
  }
}

function ComplexeBehaviourHaunt(object) {
  this.object = object;
  this.chasingBehaviour = new ChasingBehaviour(object);
  this.dodgingBehaviour = new DodgingBehaviour(object);
  this.holdBehaviour = new HoldBehaviour(object);
  this.unleashBehaviour = new UnleashBehaviour(object);

  this.move = function move() {
    // alternate randomly between chase and hold, and dodge and unleash

  }
}

function ComplexeBehaviourFairy(object) {
  this.object = object;
  this.orbitingBehaviour = new OrbitingBehaviour(object);
  this.dodgingBehaviour = new DodgingBehaviour(object);
  this.snipeBehaviour = new SnipeBehaviour(object);
  this.suppressBehaviour = new SuppressBehaviour(object);

  this.move = function move() {
    // alternate randomly between orbit and suppress, and dodge and snipe
  }
}

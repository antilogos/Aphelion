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
    var diffX = this.passerby.hitbox.h - passerby.target.position.h;
    var diffY = this.passerby.hitbox.v - passerby.target.position.v;
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffX / diffN * this.passerby.velocity.n;
    var diffV = diffY / diffN * this.passerby.velocity.n;
    // TODO smooth turn
    this.passerby.velocity.h = -diffH;
    this.passerby.velocity.v = -diffV;
  }
}

function SteeringBehaviour(passerby) {
  this.passerby = passerby;
  this.clockwise = Math.floor(Math.random() * 2) == 0;
  this.move = function move() {
    // Trajectory correction
    if(this.clockwise) {
      var orbitX = (this.passerby.target.position.v - this.passerby.hitbox.v);
      var orbitY = (this.passerby.hitbox.h - this.passerby.target.position.h);
    } else {
      var orbitX = (this.passerby.hitbox.v - this.passerby.target.position.v);
      var orbitY = (this.passerby.target.position.h - this.passerby.hitbox.h);
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
    var diffX = this.passerby.hitbox.h - passerby.target.position.h;
    var diffY = this.passerby.hitbox.v - passerby.target.position.v;
    var diffN = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    var diffH = diffX / diffN * this.passerby.velocity.n;
    var diffV = diffY / diffN * this.passerby.velocity.n;
    // TODO smooth turn
    this.passerby.velocity.h = diffH;
    this.passerby.velocity.v = diffV;
  }
}

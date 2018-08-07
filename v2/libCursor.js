
// Translate distance of mouse in pixel to velocity : smooth velocity around 0.3,
var THRUST_HEELOVER_RATIO = 1 / 400;
var HEAT_COOLDOWN_RATIO = 1 / 6000;
var SHIELD_COOLDOWN_RATIO = 1 / 6000;
var THRUST_PIXEL_RADIUS = Math.min(CANVAS_HEIGHT, CANVAS_WIDTH)/2;

/*
 * Cursor logic
 * TODO add firing and collision management
 * TODO modification to hull, engine, weapon and module
 */
function Cursor() {
  // Information to display
  this.hitbox = { h: 0, v: 0, width: 10, height: 10, radius: 5, type: COLLISION_MASK_CURSOR, shape:COLLISION_SHAPE_ROUND};
  this.velocity = {h: 0, v: 0, n: 0};
  this.last = {seen: Date.now(), update: 0, fire: 0, h: 0, v: 0};
  this.heat = 0;
  this.shield = 0;

  // Configuration of the Cursor
  this.hull = {velocity: 100, shieldCapacity: 100, heatTolerance: 100, cargo: 100, absorption: 0, width: 3, height: 3, radius : 3};
  this.engine = {thrust: 100, repair: 100, dissipation: 100, compartment: 100};
  this.weapon = [new WeaponDebug()];
  this.module = [];

  this.update = function update() {
    // Snapeshot all last info
    this.last.update = Date.now() - this.last.seen;
    this.last.seen = Date.now();
    this.last.h = this.hitbox.h;
    this.last.v = this.hitbox.v;
    // Make the acceleration not suffer from framerate drop, = Frequency of refresh
    var latencyExpectation = Math.min(this.last.update/60,1);
    // Time for the thrust to make a complete turn back, = Thrust over time over timeToTurn
    var thrustingTime = this.engine.thrust * latencyExpectation * THRUST_HEELOVER_RATIO;

    // Calculate differential movement
    // (x,y) represent the relative position of the mouse to the center in pixel
    var diffX = (inputListener.mouseX-CANVAS_WIDTH/2);
    var diffY = (inputListener.mouseY-CANVAS_HEIGHT/2);
    // t represent the normal distance of the mouse to the center, in pixel
    var diffT = Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2));
    // n represent the normal distance of the mouse to the center, in % of the Thrusting circle
    var diffN = diffT * 100 / THRUST_PIXEL_RADIUS;
    // (a,b) represent the modification of the inertia induced by T, in % of the Thrusting circle
    var diffA = diffX * 100 / THRUST_PIXEL_RADIUS;
    var diffB = diffY * 100 / THRUST_PIXEL_RADIUS;

    // Compute Velocity, bounding the % of the Thrusting circle to 100
    // (h,v) represent the inertia factor modification over time
    var diffH = Math.min(100, Math.abs(diffA)) * Math.sign(diffA);
    var diffV = Math.min(100, Math.abs(diffB)) * Math.sign(diffB);

    // dreadnaugth mode does not change trajectory
    // inertiacore does not suffer inertia

    // Change inertia, altering the factor
    this.velocity.h += diffH * thrustingTime;
    this.velocity.v += diffV * thrustingTime;

    // Normalize inertia if go out of bound
		var speedN = Math.sqrt(Math.pow(this.velocity.h,2)+Math.pow(this.velocity.v,2));
		if(speedN > this.hull.velocity) {
      // afterburner increase range of acceleration at the cost of heat
      /*
      if(this.heat > (normal/this.hull.velocity - 1) * this.heatCapacity / 50) {
        this.heat = this.heat - (normal/this.hull.velocity - 1) * this.heatCapacity / 50;
        this.inertia.h = this.hull.velocity*Math.min(normal/this.hull.velocity,1.5) / normal * this.inertia.h;
        this.inertia.v = this.hull.velocity*Math.min(normal/this.hull.velocity,1.5) / normal * this.inertia.v;
      } else {
        this.inertia.h = this.hull.velocity / normal * this.inertia.h;
        this.inertia.v = this.hull.velocity / normal * this.inertia.v;
      }
      */
			this.velocity.h = speedN == 0 ? 0 : this.hull.velocity / speedN * this.velocity.h;
			this.velocity.v = speedN == 0 ? 0 : this.hull.velocity / speedN * this.velocity.v;
    } else {
      // inertiacore is always at max speed
    }

    // Apply Movement
    this.hitbox.h += (this.velocity.h * this.last.update * ENGINE_TIME_TO_PIXEL_CELERITY);
    this.hitbox.v += (this.velocity.v * this.last.update * ENGINE_TIME_TO_PIXEL_CELERITY);

		// Firing
    if(inputListener.mouseHasClicked != null) {
      // check if weapon on cooldown
      if(this.last.seen - this.last.fire > 1000/this.weapon[0].fireRate) {
        // check if overheating
        if(this.heat > this.weapon[0].heat) {
          // Define projectile state
          var initVelN = Math.sqrt(Math.pow((inputListener.mouseX - CANVAS_WIDTH/2),2)+Math.pow((inputListener.mouseY - CANVAS_HEIGHT/2),2));
          var mouseVelN = Math.sqrt(Math.pow(this.velocity.h,2)+Math.pow(this.velocity.v,2));
          var initVel = initVelN == 0 ? {h:0, v:0} : {h: (inputListener.mouseX - CANVAS_WIDTH/2) / initVelN * mouseVelN * 1.8, v: (inputListener.mouseY - CANVAS_HEIGHT/2) / initVelN * mouseVelN * 1.8}
          // Confirm creation of projectile
          projectileFactory.spawn(this.hitbox, initVel, this.weapon[0]);
          // Update firing state
          this.heat -= this.weapon[0].heat;
          this.last.fire = Date.now();
        }
      }
    }
    // Heat dissipation
		if(this.heat < this.hull.heatTolerance) {
			this.heat = Math.min(this.heat + this.engine.dissipation * this.last.update * HEAT_COOLDOWN_RATIO, this.hull.heatTolerance);
		}

		// Shield
		if(this.shield < this.hull.shieldCapacity) {
			this.shield = Math.min(this.shield + this.engine.repair * this.last.update * HEAT_COOLDOWN_RATIO, this.hull.shieldCapacity);
			//if(this.notable / 8 & 1 && this.shield < this.shieldCapacity / 2) {
				// emergencydrive double repair speed while under halved shield
				//this.shield = Math.min(this.shield + this.engine.repair * updateTime / 60, this.shieldCapacity);
			//}
		}
  }

  this.hud = function draw() {
    var canvadHud = CANVAS_HEADUP.getContext('2d');

    // heat bar
    canvadHud.clearRect(10, 300, 100, 10);
    canvadHud.strokeStyle = "#000000";
    canvadHud.strokeRect(10, 300, 100, 10);
    // Create gradient
    gradient = canvadHud.createLinearGradient(10, 0, 10+100*this.heat/this.hull.heatTolerance, 0);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(1, "#ffff00");
    canvadHud.fillStyle = gradient;
    // Fill rectangle with gradient
    canvadHud.fillRect(10, 300, 100*this.heat/this.hull.heatTolerance, 10);

    // shield bar
    canvadHud.clearRect(460, 300, 100, 10);
    canvadHud.strokeStyle = "#000000";
    canvadHud.strokeRect(460, 300, 100, 10);
    // Create gradient
    gradient = canvadHud.createLinearGradient(560-(100*this.shield/this.hull.shieldCapacity), 300, 560, 300);
    gradient.addColorStop(1, "#ff00ff");
    gradient.addColorStop(0, "#00ffff");
    canvadHud.fillStyle = gradient;
    // Fill rectangle with gradient
    canvadHud.fillRect(560-(100*this.shield/this.hull.shieldCapacity), 300, 100*this.shield/this.hull.shieldCapacity, 10);

    // Telemeter
    canvadHud.clearRect(10, 30, 100, 20);
    canvadHud.strokeStyle = "#000000";
    canvadHud.strokeRect(10, 30, 100, 20);
    canvadHud.textAlign = "center";
    canvadHud.fillStyle = "#000000";
    canvadHud.font = GLOBAL_TEXT_SIZE.toString() + "px Times New Roman";
    canvadHud.fillText(this.hitbox.h.toFixed(0) + ":" + this.hitbox.v.toFixed(0), 60, 30 + GLOBAL_TEXT_SIZE);

    // Tachymeter
    canvadHud.clearRect(460, 30, 100, 20);
    canvadHud.strokeStyle = "#000000";
    canvadHud.strokeRect(460, 30, 100, 20);
    canvadHud.textAlign = "center";
    canvadHud.fillStyle = "#000000";
    canvadHud.font = GLOBAL_TEXT_SIZE.toString() + "px Times New Roman";
    canvadHud.fillText(this.velocity.h.toFixed(2) + ":" + this.velocity.v.toFixed(2), 510, 30 + GLOBAL_TEXT_SIZE);
  }

  this.draw = function draw() {
    // Clear cusor at center
    var canvadHud = CANVAS_HEADUP.getContext('2d');
    canvadHud.clearRect( (CANVAS_WIDTH - this.hitbox.width - 30)/2, (CANVAS_HEIGHT - this.hitbox.height - 30)/2, this.hitbox.width + 30, this.hitbox.height + 30);

    // Redraw cursor at center
    canvadHud.beginPath();
    canvadHud.arc(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
    canvadHud.lineWidth = 1;
    canvadHud.strokeStyle = '#330000';
    canvadHud.stroke();

    // emergencydrive effect

    this.hud();
  }

  this.collide = function collide(other) {
    this.shield -= 10;
    //console.log("hit!");
  }
}

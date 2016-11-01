// //////////////////////////////////////////// ENGINE ////////////////////////////////////////////

/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Engine() {

	this.prepare = function() {
		// Initialize the ship object
		this.cursor = new Cursor();
		this.cursor.init();
	}

	/*
	* Gets canvas information and context and sets up all game
	* objects.
	* Returns true if the canvas is supported and false if it
	* is not. This is to stop the animation script from constantly
	* running on older browsers.
	*/
	this.init = function() {
		// Get the canvas elements
		this.bgCanvas = document.getElementById('background');
		this.fgCanvas = document.getElementById('foreground');
		this.mainCanvas = document.getElementById('main');
		// Initialize quadTree
		this.quadTree = new QuadTree({x:-800,y:-800,width:1600,height:1600});
		// Test to see if canvas is supported. Only need to check one canvas
		if (this.bgCanvas.getContext) {
			this.bgContext = this.bgCanvas.getContext('2d');
			this.fgContext = this.fgCanvas.getContext('2d');
			this.mainContext = this.mainCanvas.getContext('2d');

			// Initialize objects to contain their context and canvas
			// information
			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;

			Cursor.prototype.context = this.fgContext;
			Cursor.prototype.canvasWidth = this.fgCanvas.width;
			Cursor.prototype.canvasHeight = this.fgCanvas.height;
			this.cursor.init();

			this.fgCanvas.addEventListener('mousemove', function(evt) {
				engine.cursor.context.clearRect(engine.cursor.mouseX-engine.cursor.width / 2, engine.cursor.mouseY-engine.cursor.height / 2, engine.cursor.width, engine.cursor.height);
				engine.cursor.mouseX = evt.clientX - engine.fgCanvas.getBoundingClientRect().left;
				engine.cursor.mouseY = evt.clientY - engine.fgCanvas.getBoundingClientRect().top;
			}, false);

			this.fgCanvas.addEventListener('mousedown', function(evt) {
				if(engine.cursor.notable / 32 & 1) {
					engine.cursor.firing=!engine.cursor.firing;
					engine.cursor.waitAutoFireToReleaseMouse = true;
				} else {
					engine.cursor.firing=true;
				}
			},false);

			this.fgCanvas.addEventListener('mouseup', function(evt) {
				if(engine.cursor.notable / 32 & 1) {
					engine.cursor.waitAutoFireToReleaseMouse = false;
				} else {
					engine.cursor.firing=false;
				}
			},false);


			// Initialize the background object
			this.background = new Background();
			this.background.init(0,0, 3000, 2000);

			// Initialize the passerby pool
			this.passerbyPool = new PasserbyFactory();
			this.passerbyPool.init();

			// Initialize the projectile pool
			this.projectilePool = new ProjectileFactory();
			this.projectilePool.init();

			// Initialize the animation pool
			this.animationPool = new AnimationFactory();
			this.animationPool.init();

			// Initialize event
			this.event = new generateEvents();

			return true;
		} else {
			return false;
		}
	};

	// Start the animation loop
	this.start = function() {
		animate();
	};
}

// ///////////////////////////////////////// END OF ENGINE ////////////////////////////////////////

/**
 * Initialize the Game and starts it.
 */
var engine = new Engine();

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			window.oRequestAnimationFrame      ||
			window.msRequestAnimationFrame     ||
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();

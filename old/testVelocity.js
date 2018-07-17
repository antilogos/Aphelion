// ////////////////////////////////////////// GAME INIT ///////////////////////////////////////////

/**
 * Initialize the Game and starts it.
 */
var engine = new Engine();
engine.prepare();
var ENGINE_TIME_TO_PIXEL_CELERITY = 1 / 100;

var CANVAS_HEIGHT = 360;
var CANVAS_WIDTH = 600;

// !--------------------------------------! ENTRY POINT !--------------------------------------! //

//var start = new MenuManager(); SKIP ALL THE MENU AND TEST MENU AS A BOARD
initGame();

function init() {
	start.initMainMenu();
	start.mainMenu.display();
}

function MenuManager() {
	var mainMenu;
	var gameMode; // 1 Local, 2 Sandbox, 3 Server
	var mainMenuItems;
	var subMenuItems;

	this.initMainMenu = function () {
		this.mainMenuItems = [{text: "Local campaign", id:1}, {text: "Local sandbox", id:2}, {text: "Server campaign", id:3}];
		this.subMenuItems = [{text: "Science facility", id:21}, {text: "Hangar", id:22}, {text: "Mission board", id:23}, {text: "Back", id:0}];
		this.mainMenu = new MenuScreen();
		this.mainMenu.init();
		this.mainMenu.canvasMenu.addEventListener('mousemove', this.mainMenu.onMouseOverListener, false);
		this.mainMenu.canvasMenu.addEventListener('mouseup', this.mainMenu.onMouseUpListener, false);
		this.mainMenu.menuItems = this.mainMenuItems;
	}
}

// !------------------------------------! END ENTRY POINT !------------------------------------! //

// /////////////////////////////////////// END OF GAME INIT ///////////////////////////////////////
// //////////////////////////////////////// MENU NAVIGATION ///////////////////////////////////////

// Display the main menu screen
function MenuScreen() {
	var canvasMenu;
	var menuItems;

	this.init = function () {
		this.canvasMenu = document.createElement('canvas');
		this.canvasMenu.id = "menu";
		this.canvasMenu.width = CANVAS_WIDTH;
		this.canvasMenu.height = CANVAS_HEIGHT;
		this.canvasMenu.innerHTML = "Your browser does not support canvas. Please try again with a different browser.";
		this.canvasMenu.style.cursor = "auto";
	};

	this.display = function () {
		// Clear the screen
		while(document.getElementById('maindiv').firstChild){
			document.getElementById('maindiv').removeChild(document.getElementById('maindiv').firstChild);
		}
		var viewport = document.createElement('div');
		viewport.className = "viewport";
		// Attach the canvas for the menu
		viewport.appendChild(this.canvasMenu);
		document.getElementById('maindiv').appendChild(viewport);
		// Clear all
		var contextMenu = this.canvasMenu.getContext('2d');
		contextMenu.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
		// Attach menu
		contextMenu.textAlign = "center";
		contextMenu.fillStyle = "Black";
		contextMenu.font = Math.floor(CANVAS_HEIGHT / 20).toString() + "px Times New Roman";
		for(var i = 0; i < this.menuItems.length; i ++) {
			contextMenu.fillText(this.menuItems[i].text, CANVAS_WIDTH / 2, (i + 1) * CANVAS_HEIGHT / (this.menuItems.length + 1));
		}
	}

	// Refresh on mouse over Menu
	this.onMouseOverListener = function(evt) {
		// get relative canvas coordinate
		var x = evt.clientX - start.mainMenu.canvasMenu.getBoundingClientRect().left;
		var y = evt.clientY - start.mainMenu.canvasMenu.getBoundingClientRect().top;
		var j = start.mainMenu.getMenuItemFromCursor(evt);
		if(j > -1) {
			// Match one of the menu item
			var contextMenu = start.mainMenu.canvasMenu.getContext('2d');
			contextMenu.textAlign = "center";
			contextMenu.fillStyle = "Black";
			for(var i = 0; i < start.mainMenu.menuItems.length; i ++) {
				// clear previews text
				contextMenu.clearRect( 0, (i + 0.7) * CANVAS_HEIGHT / (start.mainMenu.menuItems.length + 1), CANVAS_WIDTH, CANVAS_HEIGHT / (start.mainMenu.menuItems.length + 1) * 0.4 );
				if(i == j) {
					// redraw mouse over in bigger font
					contextMenu.font = Math.floor(CANVAS_HEIGHT / 16).toString() + "px Times New Roman";
					contextMenu.fillText(start.mainMenu.menuItems[i].text, CANVAS_WIDTH / 2, (i + 1) * CANVAS_HEIGHT / (start.mainMenu.menuItems.length + 1));
				} else {
					// redraw others
					contextMenu.font = Math.floor(CANVAS_HEIGHT / 20).toString() + "px Times New Roman";
					contextMenu.fillText(start.mainMenu.menuItems[i].text, CANVAS_WIDTH / 2, (i + 1) * CANVAS_HEIGHT / (start.mainMenu.menuItems.length + 1));
				}
			}
		}
	}

	// Selection Menu
	this.onMouseUpListener = function (evt) {
		// get relative canvas coordinate
		var x = evt.clientX - start.mainMenu.canvasMenu.getBoundingClientRect().left;
		var y = evt.clientY - start.mainMenu.canvasMenu.getBoundingClientRect().top;
		var i = start.mainMenu.getMenuItemFromCursor(evt);
		var j = -1;
		if(i>-1) {
			j = start.mainMenu.menuItems[i].id;
		}
		// Match one of the menu item
		if(j == 0) {
			// Back to Main Menu
			start.mainMenu.menuItems = start.mainMenuItems;
			start.mainMenu.display();
		} else if(j == 1) {
			// Main - Mode Local Campaign
			start.gameMode = 1;
			start.mainMenu.menuItems = start.subMenuItems;
			start.mainMenu.display();
		} else if(j == 2) {
			// Main - Mode Local Sandbox
			start.gameMode = 2;
			start.mainMenu.menuItems = start.subMenuItems;
			start.mainMenu.display();
		} else if(j == 3) {
			// Main - Mode Server Campaign
			start.gameMode = 3;
			start.mainMenu.menuItems = start.subMenuItems;
			start.mainMenu.display();
		} else if(j == 21) {
			// Sub Menu - Research
		} else if(j == 22) {
			// Sub Menu - Hangar
		} else if(j == 23) {
			// Sub Menu - Mission
			initGame();
		}
	};

	// Get the index of the menu selected
	this.getMenuItemFromCursor = function(evt) {
		// get relative canvas coordinate
		var x = evt.clientX - this.canvasMenu.getBoundingClientRect().left;
		var y = evt.clientY - this.canvasMenu.getBoundingClientRect().top;
		this.canvasMenu.style.cursor = "auto";
		for(var j = 0; j < this.menuItems.length; j ++) {
			if(x > CANVAS_WIDTH / 4 && x < 3 * CANVAS_WIDTH / 4) {
				if(y > (j + 0.7) * CANVAS_HEIGHT / (this.menuItems.length + 1) && y < (j + 1.1) * CANVAS_HEIGHT / (this.menuItems.length + 1)) {
					return j;
				}
			}
		}
		return -1;
	}
}

function initGame() {
	// Clear the screen
	while(document.getElementById('maindiv').firstChild){
		document.getElementById('maindiv').removeChild(document.getElementById('maindiv').firstChild);
	}
	var viewport = document.createElement('div');
	viewport.className = "viewport";
	// Attach the canvas for the menu
	var canvasBackground = document.createElement('canvas');
	canvasBackground.id = "background";
	canvasBackground.width = CANVAS_WIDTH;
	canvasBackground.height = CANVAS_HEIGHT;
	var canvasMain = document.createElement('canvas');
	canvasMain.id = "main";
	canvasMain.width = CANVAS_WIDTH;
	canvasMain.height = CANVAS_HEIGHT;
	var canvasForeground = document.createElement('canvas');
	canvasForeground.id = "foreground";
	canvasForeground.width = CANVAS_WIDTH;
	canvasForeground.height = CANVAS_HEIGHT;
	viewport.appendChild(canvasBackground);
	viewport.appendChild(canvasMain);
	viewport.appendChild(canvasForeground);
	document.getElementById('maindiv').appendChild(viewport);
	// Prepare Cursor and launch engine
	if(engine.init()) {
		engine.cursor.deployScene();
		engine.start();
	}
}

function Background() {
	this.init = function(x, y, width, height) {
		// Default variables
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	this.draw = function () {
		// Get the scrolling positive step for grid calculation
		var cornerX = (Math.floor(engine.cursor.positionH - engine.mainCanvas.clientWidth/2)%100+100)%100;
		var cornerY = (Math.floor(engine.cursor.positionV - engine.mainCanvas.clientHeight/2)%100+100)%100;
		// Deduce corners relative positions
		var relX = Math.floor(engine.cursor.positionH - engine.mainCanvas.clientWidth/2);
		var relY = Math.floor(engine.cursor.positionV - engine.mainCanvas.clientHeight/2);
	    this.context.clearRect(0, 0, this.width, this.height);
		for (var i=100-cornerX ; i<this.width ; i+= 100) {
			this.context.beginPath();
			this.context.moveTo(i, 0);
			this.context.lineTo(i, this.height);
			this.context.lineWidth = 1;
			this.context.strokeStyle = 'black';
			this.context.stroke();
			this.context.font = '8pt Calibri';
			this.context.fillStyle = 'black';
			this.context.fillText(""+(relX+i), i+10, 10);
		}
		for (var i=100-cornerY ; i<this.height ; i+= 100) {
			this.context.beginPath();
			this.context.moveTo(0, i);
			this.context.lineTo(this.width, i);
			this.context.lineWidth = 1;
			this.context.strokeStyle = 'black';
			this.context.stroke();
			this.context.font = '8pt Calibri';
			this.context.fillStyle = 'black';
			this.context.fillText(""+(relY+i), 10, 10+i);
		}
	}
}

// //////////////////////////////////// END OF MENU NAVIGATION ////////////////////////////////////
// ///////////////////////////////////////// HANGAR MENU //////////////////////////////////////////

function MenuHangar() {
	var canvasHangar;

	this.init = function () {
		this.canvasHangar = document.createElement('canvas');
		this.canvasHangar.id = "hangarCanvas";
		this.canvasHangar.width = CANVAS_WIDTH;
		this.canvasHangar.height = CANVAS_HEIGHT;
		this.canvasHangar.innerHTML = "Your browser does not support canvas. Please try again with a different browser.";
		this.canvasHangar.style.cursor = "auto";
	}

	this.display = function () {
		// Clear the screen
		while(document.getElementById('maindiv').firstChild){
			document.getElementById('maindiv').removeChild(document.getElementById('maindiv').firstChild);
		}
		var viewport = document.createElement('div');
		viewport.className = "viewport";
		// Attach the canvas for the menu
		viewport.appendChild(this.canvasHangar);
		document.getElementById('maindiv').appendChild(viewport);
		// Attach menu
	}

}

// ////////////////////////////////////// END OF HANGAR MENU //////////////////////////////////////
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
// ////////////////////////////////////////// ANIMATION ///////////////////////////////////////////

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {

	// Events
	engine.event.doEvent();

	// Collision detection
	engine.quadTree.clear();
	engine.quadTree.insert(engine.cursor);
	var obj = engine.projectilePool.getAlivePool();
	for (var i = 0, len = obj.length; i < len; i++) {
		engine.quadTree.insert(obj[i]);
	}
	var obj = engine.passerbyPool.getAlivePool();
	for (var i = 0, len = obj.length; i < len; i++) {
		engine.quadTree.insert(obj[i]);
	}
	detectCollision();

	// Animate object
	requestAnimFrame( animate );
	engine.cursor.move();
	engine.mainContext.clearRect(0,0,engine.mainCanvas.clientWidth,engine.mainCanvas.clientHeight);
	engine.projectilePool.draw();
	engine.passerbyPool.draw();
	engine.animationPool.draw();
}


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

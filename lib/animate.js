var screenStack = [];

// ////////////////////////////////////////// ANIMATION ///////////////////////////////////////////

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
/*
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
  */

  if(screenStack.length > 0) {
    var currentScreen = screenStack[0];

    // Process Input
    inputListener.readMouseInput();

    // Update States

    // Detect collision
    currentScreen.collision();

    // Generate Output
    if(currentScreen.draw) {
      currentScreen.draw();
    }

    // Release input
    inputListener.mouseHasClicked = false;
    inputListener.mouseHasRealeased = false;

  	requestAnimFrame( animate );
  }
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

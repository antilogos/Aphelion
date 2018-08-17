/**
* Creates a pseudo-random value generator. The seed must be an integer.
*
* Uses an optimized version of the Park-Miller PRNG. One liner proposed by bungu
* http://www.firstpr.com.au/dsp/rand31/
* https://gist.github.com/blixt/f17b47c62508be59987b
*/
const prng = s => (typeof s!=='undefined'&&((l=s%2147483647)<=0&&(l+=2147483646)),((l=l*16807%2147483647)-1)/2147483646);
STAR_DISTRIBUTION={X: 4, Y: 3, N: Math.pow(8,2)};
STAR_SEED=334547128;
/*
 * Background drawing, just for ambiance
 */
function Background() {
  this.context = CANVAS_BACKGROUND.getContext('2d');

  this.staryField = new StaryField();
  this.mouseCursor = new MouseCursor();
  this.DebugStar = new DebugStar();

  this.update = function update() {
    // Nothing to do for now
  }

  this.draw = function draw() {
    this.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.staryField.draw();
    this.mouseCursor.draw();
    //this.DebugStar.draw();
  }
}

function StarSector(x, y) {
  this.context = CANVAS_BACKGROUND.getContext('2d');
  this.x = x;
  this.y = y;

  this.findPosition = function algo(h, v) {
    var seed = prng(STAR_SEED+Math.pow(h+v,2));
    var nbStar = Math.floor( Math.sqrt( prng()*STAR_DISTRIBUTION.N ) );
    var starList = [];
    for (var i = 0; i < nbStar; i++) {
      var star = {dh: Math.floor( prng() * Math.floor(CANVAS_WIDTH / STAR_DISTRIBUTION.X)),
      dv: Math.floor( prng() * Math.floor(CANVAS_HEIGHT / STAR_DISTRIBUTION.Y)) };
      starList.push(star);
    }
    return starList;
  };

  this.draw = function draw() {
    var canvas = this.context;
    canvas.fillStyle = 'black';
    var relH = cursor.hitbox.h - (cursor.hitbox.h%Math.floor(CANVAS_WIDTH/STAR_DISTRIBUTION.X)) - CANVAS_WIDTH/2 + Math.floor(CANVAS_WIDTH/STAR_DISTRIBUTION.X) * x;
    var relV = cursor.hitbox.v - (cursor.hitbox.v%Math.floor(CANVAS_HEIGHT/STAR_DISTRIBUTION.Y)) - CANVAS_HEIGHT/2 + Math.floor(CANVAS_HEIGHT/STAR_DISTRIBUTION.Y) * y;
    var stars = this.findPosition(relH, relV);
    stars.forEach(function draw(star) {
      var h = relH + star.dh - cursor.hitbox.h + CANVAS_WIDTH/2;
      var v = relV + star.dv - cursor.hitbox.v + CANVAS_HEIGHT/2;
      canvas.fillRect(h,v,1,1);
    });
  };
}

function StaryField() {
  this.starSector = [];
  for (var i = -1; i < STAR_DISTRIBUTION.X+1; i++) {
    for (var j = -1; j < STAR_DISTRIBUTION.Y+1; j++) {
      this.starSector.push(new StarSector(i, j));
    }
  }

  this.draw = function draw() {
    this.starSector.forEach(function draw(s) { s.draw(); });
  };
}

function MouseCursor() {
  this.context = CANVAS_BACKGROUND.getContext('2d');

  this.draw = function draw() {
    // Display mouse pointer
    this.context.beginPath();
    this.context.strokeStyle = '#009900';
    this.context.arc(inputListener.mouseX, inputListener.mouseY, 2, 0, Math.PI*2, true);
    this.context.stroke();
  }
}

function DebugGrid() {
  this.context = CANVAS_BACKGROUND.getContext('2d');
  this.width = CANVAS_WIDTH;
  this.height = CANVAS_HEIGHT;

  this.draw = function draw() {
    // Get the scrolling positive step for grid calculation
    var cornerX = (Math.floor(cursor.hitbox.h - CANVAS_WIDTH/2)%100+100)%100;
    var cornerY = (Math.floor(cursor.hitbox.v - CANVAS_HEIGHT/2)%100+100)%100;
    // Deduce corners relative positions
    var relX = Math.floor(cursor.hitbox.h - CANVAS_WIDTH/2);
    var relY = Math.floor(cursor.hitbox.v - CANVAS_HEIGHT/2);

    // Horizontal landmark
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
    // Vertical landmark
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

function DebugStar() {
  this.context = CANVAS_BACKGROUND.getContext('2d');
  this.width = CANVAS_WIDTH;
  this.height = CANVAS_HEIGHT;

  this.draw = function draw() {
    // Get the scrolling positive step for grid calculation
    var cornerX = cursor.hitbox.h - (cursor.hitbox.h%Math.floor(CANVAS_WIDTH/STAR_DISTRIBUTION.X)) - CANVAS_WIDTH/2;
    var cornerY = cursor.hitbox.v - (cursor.hitbox.v%Math.floor(CANVAS_HEIGHT/STAR_DISTRIBUTION.Y)) - CANVAS_HEIGHT/2;
    // Deduce corners relative positions
    var relX = Math.floor(cursor.hitbox.h - CANVAS_WIDTH/2);
    var relY = Math.floor(cursor.hitbox.v - CANVAS_HEIGHT/2);

    // Horizontal landmark
    for (var i = -1; i < STAR_DISTRIBUTION.X+1; i++) {
      this.context.beginPath();
      this.context.moveTo(cornerX-relX + i*(CANVAS_WIDTH/STAR_DISTRIBUTION.X), 0);
      this.context.lineTo(cornerX-relX + i*(CANVAS_WIDTH/STAR_DISTRIBUTION.X), this.height);
      this.context.lineWidth = 1;
      this.context.strokeStyle = 'black';
      this.context.stroke();
      this.context.font = '8pt Calibri';
      this.context.fillStyle = 'black';
      this.context.fillText(""+(relX+i), i+10, 10);
    }
    // Vertical landmark
    for (var i=-1 ; i < STAR_DISTRIBUTION.Y+1; i++) {
      this.context.beginPath();
      this.context.moveTo(0, cornerY-relY + i*(CANVAS_HEIGHT/STAR_DISTRIBUTION.Y));
      this.context.lineTo(this.width, cornerY-relY + i*(CANVAS_HEIGHT/STAR_DISTRIBUTION.Y));
      this.context.lineWidth = 1;
      this.context.strokeStyle = 'black';
      this.context.stroke();
      this.context.font = '8pt Calibri';
      this.context.fillStyle = 'black';
      //this.context.fillText(""+(relY+i), 10, 10+i);
    }
  }
}

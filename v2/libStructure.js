STRUCTURE_COMPONENT_STATE_ALIVE = 1;
STRUCTURE_COMPONENT_STATE_SETTING = 2;
STRUCTURE_COMPONENT_STATE_DISABLED = 4;
STATION_NODE_ROLE_CENTRAL = 1;
STATION_NODE_ROLE_ANNEX = 2;
STATION_NODE_ROLE_BRANCH = 4;
STRUCTURE_STATION_RADIUS = 5;
STRUCTURE_ARRAY_LENGTH = 50;
STRUCTURE_SPACE = STRUCTURE_STATION_RADIUS + STRUCTURE_ARRAY_LENGTH;
/*
 *
 */
function BaseStation(size, hitbox) {
  // Split size into width and height
  var q = Math.floor(Math.sqrt(size));
  this.width = q%2 == 0? q : q+1;
  this.height = q%2 != 0? q : q+1;
  this.hitbox = hitbox;
  //console.log("q=" + q + " - w=" + this.width + " - h=" + this.height);

  this.arrays = [];
  this.nodes = [];

  // Create all nodes
  for (var j = 0; j < this.height; j++) {
    for (var i = 0; i < this.width; i++) {
      this.nodes.push(new StationNode(i, j, this.hitbox));
    }
  }
  // Central node
  var centralNode = new StationNode((q%2==0? q-1 : q)/2, (q%2!=0? q-1 : q)/2, this.hitbox);
  centralNode.status = STATION_NODE_ROLE_CENTRAL;
  centralNode.hitbox = hitbox;
  this.nodes.push(centralNode);

  // Starting with first nodes, create and pile arrays, exclude those that create loop, sort them by weight, pick first to determine nexte node
  this.build = function build(currentNode) {
    currentNode.building = STRUCTURE_COMPONENT_STATE_ALIVE;
    // Creates and adds arrays
    if(currentNode.status == STATION_NODE_ROLE_CENTRAL) {
      // Put the central array as sure
      if (this.height%2==0) {
        this.arrays.push(new StationArray(centralNode, this.nodes[(this.width-1)/2 + this.height/2 * this.width], this.hitbox));
        this.arrays.push(new StationArray(centralNode, this.nodes[(this.width-1)/2 + (this.height/2 -1) * this.width], this.hitbox));
      } else {
        this.arrays.push(new StationArray(centralNode, this.nodes[this.width/2 -1 + (this.height-1)/2 * this.width], this.hitbox));
        this.arrays.push(new StationArray(centralNode, this.nodes[this.width/2 + (this.height-1)/2 * this.width], this.hitbox));
      }
      // console.log("array locked from " + this.arrays[0].nodeA.x+":"+this.arrays[0].nodeA.y+">" +this.arrays[0].nodeB.x+":"+this.arrays[0].nodeB.y)
    } else {
      // Do not permit array that pass throught the centralNode
      // Left
      if(currentNode.x != 0 || (centralNode.x == currentNode.x+0.5 && centralNode.y == currentNode.y))
        this.arrays.push(new StationArray(currentNode, this.nodes[currentNode.x+currentNode.y*this.width -1], this.hitbox));
      // Right
      if(currentNode.x != this.width-1 || (centralNode.x == currentNode.x-0.5 && centralNode.y == currentNode.y))
        this.arrays.push(new StationArray(currentNode, this.nodes[currentNode.x+currentNode.y*this.width +1], this.hitbox));
      // Down
      if(currentNode.y != 0 || (centralNode.x == currentNode.x && centralNode.y == currentNode.y+0.5))
        this.arrays.push(new StationArray(currentNode, this.nodes[currentNode.x+(currentNode.y -1)*this.width], this.hitbox));
      // Up
      if(currentNode.y != this.height-1 || (centralNode.x == currentNode.x && centralNode.y == currentNode.y-0.5))
        this.arrays.push(new StationArray(currentNode, this.nodes[currentNode.x+(currentNode.y +1)*this.width], this.hitbox));
    }

    // Exclude looping arrays by putting a negative weight
    this.arrays.filter( function stillBuilding(a) { return a.building == STRUCTURE_COMPONENT_STATE_SETTING; } ).forEach( function filterLoop(a) {
      if(((a.nodeA.building | a.nodeB.building) & STRUCTURE_COMPONENT_STATE_SETTING) != STRUCTURE_COMPONENT_STATE_SETTING) {
        //console.log("kill " + a.nodeA.x+":"+a.nodeA.y+">" +a.nodeB.x+":"+a.nodeB.y );
        a.weight = -1;
        a.building = STRUCTURE_COMPONENT_STATE_DISABLED;
      }
    });

    // Sort by weight and pick the next node
    this.arrays.sort( function sortWeight(a, b) { return b.weight - a.weight; });

      this.nodes.forEach(function draw(n) { n.draw(); });
        this.arrays.forEach(function draw(a) { a.draw(); });

    // Pick next arrays and put its weight to negative
    var nextArray = this.arrays.find( function nextBuild(a) { return a.building == STRUCTURE_COMPONENT_STATE_SETTING && a.weight>0; });
    if(nextArray != null) {
      // console.log("next is " + nextArray.nodeA.x+":"+nextArray.nodeA.y+">" +nextArray.nodeB.x+":"+nextArray.nodeB.y );
      nextArray.weight = -1;
      nextArray.building = STRUCTURE_COMPONENT_STATE_ALIVE;
      if(nextArray.nodeB.building == STRUCTURE_COMPONENT_STATE_SETTING) {
        //console.log("choosed node " + nextArray.nodeB.x+":"+nextArray.nodeB.y);
        this.build(nextArray.nodeB);
      } else if(nextArray.nodeA.building == STRUCTURE_COMPONENT_STATE_SETTING) {
        //console.log("choosed node " + nextArray.nodeA.x+":"+nextArray.nodeA.y);
        this.build(nextArray.nodeA);
      }
    } else {
      // Time to do some cleanup
      this.arrays = this.arrays.filter( function isSet(a) { return a.building == STRUCTURE_COMPONENT_STATE_ALIVE; });
      this.nodes.forEach( function clearLinks(n) {
        n.links = n.links.filter( function isSet(a) { return a.building == STRUCTURE_COMPONENT_STATE_ALIVE; });
        if(n.links.length == 1 && n.status != STATION_NODE_ROLE_CENTRAL) n.status = STATION_NODE_ROLE_ANNEX;
      });
    }
  }

  this.build(centralNode);

  this.draw = function draw() {
    this.nodes.forEach(function draw(n) { n.draw(); });
    this.arrays.forEach(function draw(a) { a.draw(); });
  }
}

function StationArray(linkA, linkB, hitbox) {
  this.nodeA = linkA;
  this.nodeB = linkB;
  this.weight = Math.floor(Math.random() * 999);
  this.building = STRUCTURE_COMPONENT_STATE_SETTING;
  if(this.nodeA.x == this.nodeB.x) {
    // Orientation verticale
    this.hitbox = {h: hitbox.h + this.nodeA.x*STRUCTURE_SPACE -2, v: hitbox.v + Math.min(this.nodeA.y, this.nodeB.y)*STRUCTURE_SPACE +STRUCTURE_STATION_RADIUS/2,
      width: 4, height: Math.abs(this.nodeB.y-this.nodeA.y)*STRUCTURE_SPACE -STRUCTURE_STATION_RADIUS/2,
      radius: 6, type: COLLISION_MASK_PASSERBY};
  } else {
    // Orientation horizontale
    this.hitbox = {h: hitbox.h + Math.min(this.nodeA.x, this.nodeB.x)*STRUCTURE_SPACE +STRUCTURE_STATION_RADIUS/2, v: hitbox.v + this.nodeA.y*STRUCTURE_SPACE,
      width: Math.abs(this.nodeB.x-this.nodeA.x)*STRUCTURE_SPACE -STRUCTURE_STATION_RADIUS/2, height: 4,
      radius: 6, type: COLLISION_MASK_PASSERBY};
  }

  // Adds links to the nodes
  this.nodeA.links.push(this);
  this.nodeB.links.push(this);

  this.draw = function draw() {
    if(this.building == STRUCTURE_COMPONENT_STATE_ALIVE) {
      var context = CANVAS_FOREGROUND.getContext('2d');
      context.beginPath();
      context.fillStyle = "#33CCCC";
      context.strokeRect(this.hitbox.h - cursor.hitbox.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.hitbox.v + CANVAS_HEIGHT / 2, this.hitbox.width, this.hitbox.height);
      context.stroke();
    }
  }
}

function StationNode(x, y, hitbox) {
  this.x = x;
  this.y = y;
  this.links = [];
  this.building = STRUCTURE_COMPONENT_STATE_SETTING;
  this.status = STATION_NODE_ROLE_BRANCH;
  this.hitbox = {h: hitbox.h + this.x*STRUCTURE_SPACE, v: hitbox.v + this.y*STRUCTURE_SPACE,
    width: STRUCTURE_STATION_RADIUS, height:STRUCTURE_STATION_RADIUS,
    radius: STRUCTURE_STATION_RADIUS, type: COLLISION_MASK_PASSERBY};

  this.draw = function draw() {
    // Only care about in screen passerby
    if(this.hitbox.h - cursor.hitbox.h > - CANVAS_WIDTH - this.hitbox.width
      && this.hitbox.h - cursor.hitbox.h < CANVAS_WIDTH + this.hitbox.width
      && this.hitbox.v - cursor.hitbox.v > - CANVAS_HEIGHT - this.hitbox.height
      && this.hitbox.v - cursor.hitbox.v < CANVAS_HEIGHT + this.hitbox.height)
        {
        // Draw
        var canvasFg = CANVAS_FOREGROUND.getContext('2d');
        canvasFg.beginPath();
        canvasFg.arc(this.hitbox.h - cursor.hitbox.h + CANVAS_WIDTH / 2, this.hitbox.v - cursor.hitbox.v + CANVAS_HEIGHT / 2, this.hitbox.radius, 0, 2 * Math.PI, false);
        canvasFg.lineWidth = 1;
        if(this.status == STATION_NODE_ROLE_CENTRAL) canvasFg.fillStyle = "#9999FF";
        else if(this.status == STATION_NODE_ROLE_ANNEX) canvasFg.fillStyle = "#993399";
        else canvasFg.fillStyle = "#000000";

        canvasFg.stroke();
    }
  }
}

function StationFactory() {
  this.stationList = [];

  this.spawn = function() {
    var hitbox = {h: 300, v:300, width:6, height:6, type: COLLISION_MASK_PASSERBY};
    var station = new BaseStation(Math.floor(Math.random() * 40 +10), hitbox);
    this.stationList.push(station);
  }

  this.update = function update() {
    //this.stationList.forEach(function update(p) { s.update() });
    //this.stationList = this.stationList.filter( function stillAlive(p) { return p.hull.alive; });
  }

  this.draw = function draw() {
    this.stationList.forEach(function draw(s) { s.draw() });
    if(this.stationList.length == 0) this.spawn();
  }
}

var stationFactory = new StationFactory();

// TODO upgrade using prism's algorithm (fill space by expanding lowest non-looping branch, each branch with random weight)
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

  var width = 6;
  var height = 6;
  var nodes = [];
  // Define elements
  function Element(x, y) {
    this.links = [];
    this.x = x;
    this.y = y;
    this.free = true;
  }
  function Link(e) {
    this.to = e;
    this.free = true;
  }
  // Create all elements
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      nodes.push(new Element(i, j));
    }
  }
  // Create all links
  for (var i = 0; i < width; i++) {
    for (var j = 0; j < height; j++) {
      // Up
      if(i != 0) nodes[i+j*width].links.push(new Link(nodes[i-1+j*width]));
      // Down
      if(i != width-1) nodes[i+j*width].links.push(new Link(nodes[i+1+j*width]));
      // Left
      if(j != 0) nodes[i+j*width].links.push(new Link(nodes[i+(j-1)*width]));
      // Right
      if(j != height-1) nodes[i+j*width].links.push(new Link(nodes[i+(j+1)*width]));
      nodes[i+j*width].links = shuffle(nodes[i+j*width].links);
    }
  }
  // Create list of free elements
  var freeElements = shuffle(nodes);
  // Must verify that all the elements can be filled without using link A-B and B-A
  function checkConsistency(listOfElements, linkA, linkB) {
    var filled = [];
    listOfElements.forEach(function setFill(item, index) { filled.push(false) });
    //console.log("begin filling " + filled);
    function spill(e) {
      filled[e.x+e.y*width] = true;
      //console.log("node " + e.x + ":" + e.y + " is now filled");
      e.links.filter(function restrict(l) { return l !== linkA && l !== linkB }).forEach(function spillRec(item, index) { if(!filled[item.to.x+item.to.y*width]) spill(item.to) });
    }
    var e = listOfElements.find(function getUpperCorner(item) { return item.x == 0 && item.y == 0 })
    spill(e);

    return filled.every(function isFilled(f) {return f});
  }
  // Run algorithm
  while(freeElements.some(function isFree(e) { return e.free })) {
    var element = freeElements.find(function isFree(e) { return e.free });
    var linkA = element.links.find(function isFree(l) { return l.free });
    // Get revert link
    var linkedElement = linkA.to;
    var linkB = linkedElement.links.find(function locate(l) { return l.to.x == element.x && l.to.y == element.y })
    var check = checkConsistency(freeElements, linkA, linkB);
    if(!check) {
      linkA.free = false;
      linkB.free = false;
      if(element.links.every(function checkFree(l) {return !l.free})) {
        element.free = false;
      }
      if(linkA.to.links.every(function checkFree(l) {return !l.free})) {
        linkA.to.free = false;
      }
    } else {
      element.links = element.links.filter(function remove(l) { return l !== linkA});
      linkedElement.links = linkedElement.links.filter(function remove(l) { return l !== linkB});
    }
  }
  displayElements(freeElements);
  function displayElements(listOfElements) {
    for (var j = 0; j < height; j++) {
      var lineEven = "";
      var lineOdd = "";
        for (var i = 0; i < width; i++) {
        var e = listOfElements.find(function locate(e) { return e.x == i && e.y == j });
        if(e.free) {
          lineEven = lineEven + "O";
        } else {
          lineEven = lineEven + "#";
        }
        if(i != width-1) {
          if(e.links.some(function locateEast(l) { return l.to.x == e.x+1 && l.to.y == e.y })) {
            lineEven = lineEven + "—";
          } else {
            lineEven = lineEven + "·";
          }
        }
        if(j != height-1) {
          if(e.links.some(function locateSouth(l) { return l.to.x == e.x && l.to.y == e.y+1 })) {
            lineOdd = lineOdd + "|";
          } else {
            lineOdd = lineOdd + "·";
          }
          lineOdd = lineOdd + " ";
        }
      }
      console.log(lineEven);
      console.log(lineOdd);
    }
  }

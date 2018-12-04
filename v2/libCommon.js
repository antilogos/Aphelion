function stillAlive(o) { return o.state.alive || o.state.lifespan != 0; };
function checkDeath(o) { o.state.lifespan -= Math.min(o.last.update, o.state.lifespan); };
function timeUpdate(o) {
  if(lastActive == -1) {
    console.log("ERROR - updating while not active")
  } else if(o.last.seen > lastActive) {
    o.last.update = Date.now() - o.last.seen;
    o.last.seen += o.last.update;
  } else {
    o.last.update = Date.now() - o.last.seen - (lastActive - lastIddle);
    o.last.seen += o.last.update + (lastActive - lastIddle);
  }
 }

function textWrapping(context, text, x, y, maxWidth, lineHeight) {
  text.split('\n').forEach(function lineDelimiter(paragraph) {
    paragraph.split(' ').reduce(function wordDelimiter(currentLine, currentWord) {
     if(context.measureText(currentLine+' '+currentWord).width > maxWidth) {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine, x, y);
       y += lineHeight;
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentWord, x, y);
       return currentWord;
     } else {
       context.clearRect(x, y-lineHeight+4, maxWidth, lineHeight);
       context.fillText(currentLine+' '+currentWord, x, y);
       return currentLine+' '+currentWord;
     }
   });
   y += lineHeight;
 });
};

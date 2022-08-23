var nitori = function nitori() {
  CurrentResearchLevel.forEach( function unlock(k, v) {
    CurrentResearchLevel[k] = 1;
    console.log(k); });
};

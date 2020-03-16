/*
 * Dev command
 */
function hello() {
  console.log("hello");
}

function unlock_all_tech() {
  console.log(CurrentResearchLevel);
  RESEARCH_LIST.forEach( function toMap(e) { CurrentResearchLevel[e.code] = 1; });
  console.log(CurrentResearchLevel);
}

function uat() {
  unlock_all_tech();
}

var CurrentResearchLevel = [];
  RESEARCH_LIST.forEach( function toMap(e) { CurrentResearchLevel[e.code] = 0; });

var isUnlocked = function isUnlocked(research) {
  if(research.requirement != null) {
    var requirementList;
    if(!Array.isArray(research.requirement)) requirementList = new Array(research.requirement)
    else requirementList = research.requirement;
    var available = requirementList.every( function checkRequirement(req) {
      return CurrentResearchLevel[req] > 0;
    });
    return available;
  } else {
    return true;
  }
}

var topOfResearch = function filterOnlyBest(listOfResearch) {
  var bestByGroup = [];
  return listOfResearch.reduce(function (accumulator, element) {
    if(bestByGroup[element.name] == null) {
      bestByGroup[element.name] = element;
      accumulator.push(element);
    } else {
      if(bestByGroup[element.name].techlevel <= element.techlevel) {
        var indexOfBested = accumulator.indexOf(bestByGroup[element.name]);
        bestByGroup[element.name] = element;
        accumulator.splice(indexOfBested, 1);
        accumulator.push(element);
      }
    }
    return accumulator;
  }, []);
}

var thisUnlockPart = function thisUnlockPart(research) {
  var researchPart = RESEARCH_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0 && CurrentResearchLevel[current.code] == 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Research: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var hullPart = HULL_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Hull: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var enginePart = ENGINE_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Engine: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var shieldPart = SHIELD_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Shield: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var weaponPart = WEAPON_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Weapon: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var modulePart = MODULE_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Module: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  var subsystemPart = SUBSYSTEM_LIST.filter( function dependsOnThis(current) {
    if(current.requirement) {
      return current.requirement.indexOf(research.code) >= 0;
    } else return false;
  }).reduce( function format(text, current) {
    if(text == "") return "Subsystem: " + current.code + partToUnlock(current);
    else return text + ", " + current.code + " " + partToUnlock(current);
  }, "");
  return [researchPart, hullPart, enginePart, shieldPart, weaponPart, modulePart, subsystemPart].filter(function nonEmpty(t) { return t!=""; }).join("\n");
}

var partToUnlock = function partToUnlock(research) {
  if(research.requirement && Array.isArray(research.requirement)) {
    var part = research.requirement.filter( function checkRequirement(req) {
      return CurrentResearchLevel[req] > 0;
    }).length;
    if(research.requirement.length == part ) return "";
    else return " ("+part+"/"+research.requirement.length+")"
  } else {
    return "";
  }
}

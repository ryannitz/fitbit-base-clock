/*
  A simple clock which renders the current time and date in a digital format.
  Callback should be used to update your UI.
*/
import clock from "clock";
import { preferences } from "user-settings";

import { days, months, monthsShort } from "./locales/en.js";
import * as util from "/project/common/utils";

let dateFormat, baseSetting, userDefinedBase, clockCallback, curMinute, newBase;

export function initialize(granularity, dateFormatString, baseSettingString, userDefinedBaseString, callback) {
  dateFormat = dateFormatString;
  baseSetting = baseSettingString;
  userDefinedBase = userDefinedBaseString
  clock.granularity = granularity;
  clockCallback = callback;
  clock.addEventListener("tick", tickHandler);
}

export function setUserDefinedBase(userDefinedBaseString){
  userDefinedBase = userDefinedBaseString;
}

export function setBaseSetting(baseSettingString){
  baseSetting = baseSettingString;
}

function tickHandler(evt) {
  
  //only need to track minutes when random changes are occuring
  newBase = getSelectedBase(evt);
  
  let today = evt.date;
  let dayName = days[today.getDay()];
  let month = util.zeroPad(today.getMonth() + 1);
  let monthName = months[today.getMonth()];
  let monthNameShort = monthsShort[today.getMonth()];
  let dayNumber = util.zeroPad(today.getDate());

  let hours = today.getHours();
  let mins = today.getMinutes();
  
  let convertedTimeString;
  //must do the conversion before attempting the zero-pad
  if(baseSetting != "noBaseChange"){
    let convertedHours = toNBase(newBase, hours);
    let convertedMins = toNBase(newBase, mins);
    if(convertedMins == ""){
      convertedMins = "00";
    }else if(convertedMins.length == 1){
      convertedMins = "0" + convertedMins;
    }
    if(convertedHours == ""){
      convertedHours = "00";
    }else if(convertedHours.length == 1){
      convertedHours = "0" + convertedHours;
    }
    convertedTimeString = `${convertedHours}:${convertedMins}`   
  }
  
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  }else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  mins = util.zeroPad(mins);
  let timeString = `${hours}:${mins}`;
  if(baseSetting == "noBaseChange"){
    convertedTimeString = timeString;
  }
  
  let dateString = today;
  switch(dateFormat) {
    case "shortDate":
      dateString = `${dayNumber} ${monthNameShort}`;
      break;
    case "mediumDate":
      dateString = `${dayNumber} ${monthName}`;
      break;
    case "longDate":
      dateString = `${dayName} ${monthName} ${dayNumber}`;
      break;
  }
  clockCallback({time: timeString, convertedBase: newBase, convertedTime: convertedTimeString, date: dateString});
  
}

function toNBase(newBase, decimal){
  var str = "";
  while(decimal > 0){
    str += charVal(decimal % newBase);
    decimal = Math.floor(decimal/newBase);
  }
  str =  str.split('').reverse().join('');
  return str;
}
  
function charVal(val){
  if(val >= 0 && val <= 9){
    return String.fromCharCode(val + 48);
  }else{
    return String.fromCharCode(val + 55);
  }
}

//this is a random base selector until we can get settings integration
function getSelectedBase(evt){
  if(baseSetting === "randomBaseChange"){
    if(curMinute == null || (evt.date.getMinutes() != curMinute)){
      curMinute = evt.date.getMinutes();
      return Math.floor(Math.random() * 25)+2;
    }
   }else if(baseSetting === "userDefinedBaseChange"){
     return userDefinedBase;
   }else{
     return 10;
   }
}
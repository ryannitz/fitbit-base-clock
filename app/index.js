import document from "document";

import { battery } from "power";
import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleSettings from "./simple/device-settings";

let background = document.getElementById("background");
let percentText = document.getElementById("percentText");
let dividers = document.getElementsByClassName("divider");
let txtBase = document.getElementById("txtBase");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");

let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");

let statsText = document.getElementsByClassName("stat-text");
let statsIcon = document.getElementsByClassName("image");

let stepsItem = document.getElementById("steps-item");
let caloriesItem = document.getElementById("calories-item");
let distanceItem = document.getElementById("distance-item");
let floorsItem = document.getElementById("floors-item");
let activeMinsItem = document.getElementById("activemins-item");

var colors = ["deepskyblue","orangered","limegreen","fuchsia","yellow"];

/* -------- SETTINGS -------- */
let baseSetting;
let userDefinedBase;

function settingsCallback(data) {
  if (!data) {
    return;
  }
  
  if(data.baseChangeSetting["values"][0].value){
    baseSetting = data.baseChangeSetting["values"][0].value;
    simpleClock.setBaseSetting(baseSetting);
  }
  if(baseSetting === "userDefinedBaseChange" && data.userDefinedBase && data.userDefinedBase.name){
    userDefinedBase = parseInt(data.userDefinedBase.name);
    simpleClock.setUserDefinedBase(userDefinedBase);
  }
  if (data.colorBackground) {
    background.style.fill = data.colorBackground;
  }
  if(data.colorHeader){
     txtBase.style.fill = data.colorHeader;
  }
  if (data.colorDividers) {
    dividers.forEach(item => {
      item.style.fill = data.colorDividers;
    });
  }
  if (data.colorTime) {
    txtTime.style.fill = data.colorTime;
  }
  if (data.colorDate) {
    txtDate.style.fill = data.colorDate;
  }
  
  
  
  
  
  
  if (data.colorActivity) {
    statsText.forEach((item, index) => {
      item.style.fill = data.colorActivity;
    });
  }
  
  if(data.overrideStatIconColor != null){
      statsIcon.forEach((item, index) => {
        if(data.overrideStatIconColor == true){
          item.style.fill = data.colorActivity;
        }else{
          item.style.fill = colors[index];
        }
        //item.style.fill = ((data.overrideStatIconColor == true) ? data.colorActivity : colors[index]);
      });
  }
  
  if (data.colorHRM) {
    txtHRM.style.fill = data.colorHRM;
  }
  if (data.colorImgHRM) {
    imgHRM.style.fill = data.colorImgHRM;
  }
}
simpleSettings.initialize(settingsCallback);


/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.convertedTime;
  txtBase.text = data.time + " in base " + data.convertedBase + ":";
  txtDate.text = data.date;
  if(data.convertedBase <= 3){
      txtTime.style.fontSize = 50;
  }else{
      txtTime.style.fontSize = 95;
  }
}
simpleClock.initialize("minutes", "longDate", baseSetting, userDefinedBase, clockCallback);

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  // statsCycleItems.forEach((item, index) => {
  //   let img = item.firstChild;
  //   let txt = img.nextSibling;
  //   txt.text = data[Object.keys(data)[index]].pretty;
  //   console.log(txt.text);
  //   // Reposition the activity icon to the left of the variable length text
  //   img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  // });
  let img = stepsItem.firstChild;
  let txt = img.nextSibling;
  txt.text = data.steps.pretty;
  img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  
  img = caloriesItem.firstChild;
  txt = img.nextSibling;
  txt.text = data.calories.pretty;
  img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  
  img = distanceItem.firstChild;
  txt = img.nextSibling;
  txt.text = data.distance.pretty;
  img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  
  img = floorsItem.firstChild;
  txt = img.nextSibling;
  txt.text = data.elevationGain.pretty;
  img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  
  img = activeMinsItem.firstChild;
  txt = img.nextSibling;
  txt.text = data.activeMinutes.pretty;
  img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  updateBattery();
}
simpleActivity.initialize("minutes", activityCallback);

/* -------- HRM ------------- */
function hrmCallback(data) {
  txtHRM.text = `${data.bpm}`;
  if (data.zone === "out-of-range") {
    imgHRM.href = "images/heart_open.png";
  } else {
    imgHRM.href = "images/heart_solid.png";
  }
  if (data.bpm !== "--") {
    iconHRM.animate("highlight");
  }
}
simpleHRM.initialize(hrmCallback);

function updateBattery(){
  percentText.text = (Math.floor(battery.chargeLevel) + "%");
}

// import { Barometer } from "barometer";

// if (Barometer) {
//    console.log("This device has a Barometer!");
//    const barometer = new Barometer({ frequency: 1 });
//    barometer.addEventListener("reading", () => {
//      console.log(`Pressure: ${barometer.pressure} Pa`);
//    });
//    barometer.start();
// } else {
//    console.log("This device does NOT have a Barometer!");
// }

// import { Gyroscope } from "gyroscope";

// if (Gyroscope) {
//    console.log("This device has a Gyroscope!");
//    const gyroscope = new Gyroscope({ frequency: 1 });
//    gyroscope.addEventListener("reading", () => {
//      console.log(
//       `Gyroscope Reading: \
//         timestamp=${gyroscope.timestamp}, \
//         [${gyroscope.x}, \
//         ${gyroscope.y}, \
//         ${gyroscope.z}]`
//      );
//    });
//    gyroscope.start();
// } else {
//    console.log("This device does NOT have a Gyroscope!");
// }

// import { OrientationSensor } from "orientation";

// if (OrientationSensor) {
//    console.log("This device has an OrientationSensor!");
//    const orientation = new OrientationSensor({ frequency: 1 });
//    orientation.addEventListener("reading", () => {
//      console.log(
//       `Orientation Reading: \
//         timestamp=${orientation.timestamp}, \
//         [${orientation.quaternion[0]}, \
//         ${orientation.quaternion[1]}, \
//         ${orientation.quaternion[2]}, \
//         ${orientation.quaternion[3]}]`
//      );
//    });
//    orientation.start();
// } else {
//    console.log("This device does NOT have an OrientationSensor!");
// }
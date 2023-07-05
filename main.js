const selectMenu = document.querySelectorAll('select');
const currentTime = document.getElementById('current-time');
const alarmBtn = document.querySelector('button');
const listContainer = document.getElementById("list-container");
const activeAlarms = document.querySelector(".activeAlarms");
let alarmSound = new Audio('./assets/Alarm-Clock.mp3');
let alarmTime = [];
let initialHour = 'Hour',
  initialMinutes = 'Minutes',
  initialSeconds = 'Seconds',
  initialAmpm = 'AM/PM',
  alarmIndex = 0;

//Search for value in object
const searchObject = (parameter, value) => {
    let alarmObject,
      objIndex,
      exists = false;
      alarmTime.forEach((alarm, index) => {
      if (alarm[parameter] == value) {
        exists = true;
        alarmObject = alarm;
        objIndex = index;
        return false;
      }
    });
    return [exists, alarmObject, objIndex];
  };


//Loops for create Hour the select option 
for(let i= 12; i > 0; i--) {
    i= i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML('afterend', option);
}

//Loops for create minutes the select option 
for(let i= 59; i >= 0; i--) {
    i= i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML('afterend', option);
}

//Loops for create seconds the select option 
for(let i= 59; i >= 0; i--) {
    i= i < 10 ? "0" + i : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML('afterend', option);
}

//Loops for create AM/PM the select option 
for(let i= 2; i > 0; i--) {
    let val = i == 1 ? "AM" : "PM"; 
    let option = `<option value="${val}">${val}</option>`;
    selectMenu[3].firstElementChild.insertAdjacentHTML('afterend', option);
}

//Live Running Time 
setInterval(() => {
  //getting hour, mins, secs
    let d = new Date(),
    h = d.getHours(),
    m = d.getMinutes(),
    s = d.getSeconds(),
    ampm = "AM";
    if(h > 12) {
      h = h - 12;
      ampm = "PM";
    }

    // if hours value is 0, set this value to 12
    h = h == 0 ? h = 12 : h;
    //adding 0 before hr, mins, secs if this value is less then 10
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    let data = `${h}:${m}:${s} ${ampm}`;
    currentTime.innerText = data;
    
    //Alarm
    alarmTime.forEach((alarm, index) => {
        if(alarm.isActive){
            let val = `${alarm.alarmHour}:${alarm.alarmMinutes}:${alarm.alarmSeconds} ${alarm.alarmAMPM}`;
            if(val === data){
                alarmSound.play();
                alarmSound.loop = true;
                alert("Alarm is ringing!");
            }
        }
    });
},1000);


//Set Alarm Button fucntion
alarmBtn.addEventListener('click',() => {
    alarmIndex += 1;

    // getting hour, minute, second and am/pm
    if(selectMenu[0].value === 'Hour' || selectMenu[1].value === 'Minutes' || selectMenu[2].value === 'Seconds' || selectMenu[3].value === 'AM/PM'){
        alert("please select the hour, minutes, seconds and am/pm");
    } else {
        let alarmObj = {};
        alarmObj.id = `${alarmIndex}_${selectMenu[0].value}_${selectMenu[1].value}_:${selectMenu[2].value}:${selectMenu[3].value}`;
        alarmObj.alarmHour = selectMenu[0].value;
        alarmObj.alarmMinutes = selectMenu[1].value;
        alarmObj.alarmSeconds = selectMenu[2].value;
        alarmObj.alarmAMPM = selectMenu[3].value;
        alarmObj.isActive = false;
        // console.log(alarmObj);
        alarmTime.push(alarmObj);
        // console.log(alarmTime);
        createAlarm(alarmObj);
        selectMenu[0].value = initialHour;
        selectMenu[1].value = initialMinutes;
        selectMenu[2].value = initialSeconds;
        selectMenu[3].value = initialAmpm;
 
    }
});


//Create alarm div
const createAlarm = (alarmObj) => {

  //Keys from object
  const { id, alarmHour, alarmMinutes, alarmSeconds, alarmAMPM } = alarmObj;

  //Alarm div
  let alarmDiv = document.createElement("div");
  // console.log(alarmDiv);
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  let time = `${selectMenu[0].value}:${selectMenu[1].value}:${selectMenu[2].value} ${selectMenu[3].value}`;
  alarmDiv.innerHTML = time;

  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    // console.log("start somthing-", e);
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);


  //Delete button
  let deleteButton = document.createElement("span");
  deleteButton.innerHTML = "\u00d7";
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);

};




//Start Alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmTime[index].isActive = true;
    }
  };


//Stop alarm
  const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists && obj.id === searchId) {
        alarmTime[index].isActive = false;
       alarmSound.pause();
    }
  };


//delete alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
      e.target.parentElement.remove();
      alarmTime.splice(index, 1);
    }
  };

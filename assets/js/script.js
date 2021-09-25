let today = moment();
$("#currentDay").text(today.format("MMM Do, YYYY"));

$("#hourNow").text(moment().format('LTS'));
setInterval(function(){
    $("#hourNow").text(moment().format('LTS'));
},1000);

let startHour = 15;
let businessHours = 9;
let timeFormElements = $("#timeFormEl");
let dayHours = $('<form class="dayHours d-flex row">');
let listHour = $('<div class="col-md-1 text-center p-3 custom-time"></div>');
let inputText = $('<input autocomplete="off" type="text" class="col-md-10 form-input w-100 custom-input" name="shopping-input" placeholder="Add a reminder"/>');
let saveButton = $('<button class="col-md-1 btn btn-info custom-save">Save</button>');

// Cerate time notes in html
function createTimeFormEl(){
    for (i = startHour; i < startHour + businessHours; i++) {
        listHour.text(moment(i, 'hh').format("hh A"))
        dayHours.append(listHour);
        dayHours.append(inputText);
        dayHours.append(saveButton);
        timeFormElements.append(dayHours.clone());
    }
}
createTimeFormEl();

// Read data from local storage
let taskArray = [];
$(document).ready(function() {
taskArray = JSON.parse(localStorage.getItem("taskArray"));
if (taskArray === null) {
    taskArray = [];
}
// show data in html
for (i = 0; i < timeFormElements.children().length; i++) {
    for (j = 0; j < taskArray.length; j++){
        if (taskArray[j].taskHour === timeFormElements.children().eq(i).children().eq(0).text()){
            timeFormElements.children().eq(i).children().eq(1).val(taskArray[j].taskText);
        }
    }
}
});

// Sorting time notes, updating color and time in local storage
$("#timeFormEl").sortable({
    update: function() {
        updateTimeAfterSortable();
        checkTimeColors();
        updateLocalStoreage();
}});

function updateTimeAfterSortable(){
    for (i = 0; i < businessHours; i++){
        timeFormElements.children().eq(i).children().eq(0).text(moment(startHour + i, 'hh').format("hh A"));
    }
}

function updateLocalStoreage(){
    for (i = 0; i < taskArray.length; i++){
        for (j = 0; j < timeFormElements.children().length; j++){
            if (taskArray[i].taskText === timeFormElements.children().eq(j).children().eq(1).val()){
                taskArray[i].taskHour = timeFormElements.children().eq(j).children().eq(0).text();
            }
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

// Saving data to local storage
$(".custom-save").on("click", colectInput)

function colectInput(event) {
    let task = {
        taskHour: "",
        taskText: "",
    }
    event.preventDefault();
    let btnClicked = $(event.target);
    task.taskText = btnClicked.prev().val();
    task.taskHour = btnClicked.siblings(0).text();
    saveInAndCheckArray(task)
    applyTimeColors(btnClicked.parent(), task.taskHour)
}

// When start typing changes field color
$(".custom-input").on("keydown", valueEnter)

function valueEnter(event){
    $(event.target).css({backgroundColor: "orange"});
}

// Save and update data to local storage 
function saveInAndCheckArray(task){
    let foundTime = false;
        for (i = 0; i < taskArray.length; i++){
            if (taskArray[i].taskHour === task.taskHour){
                taskArray.splice(i, 1, task);
                foundTime = true;
            } 
        }
    if (!foundTime){
    taskArray.push(task);   
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

// Sets colors according the time now.
checkTimeColors()
function checkTimeColors(){
    for (i = 0; i < timeFormElements.children().length; i++){
        let timeLineEl = timeFormElements.children().eq(i);
        let timeAtLine = timeLineEl.children().eq(0).text();
        applyTimeColors(timeLineEl, timeAtLine);
    }
}

function applyTimeColors(timeLineEl, timeAtLine){
    let checkTime = moment(timeAtLine, 'hh A').isBefore(moment()); //true or false time now
    if (timeAtLine === moment().format('hh A')){
        timeLineEl.children().eq(1).css({backgroundColor: "red", color: "white"});
    }else if (checkTime){
        timeLineEl.children().eq(1).css({backgroundColor: "lightgray", color: "black"});
    } else {
        timeLineEl.children().eq(1).css({backgroundColor: " #ccd5ae", color: "black"});
    }
}
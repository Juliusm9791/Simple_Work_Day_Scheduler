let today = moment();
$("#currentDay").text(today.format("MMM Do, YYYY"));

$("#hourNow").text(moment().format('LTS'));
setInterval(function(){
    $("#hourNow").text(moment().format('LTS'));
},1000);

let startHour = 9;
let businessHours = 10;
let timeFormElements = $("#timeFormEl");
let dayHours = $('<form class="dayHours d-flex row">');
let listHour = $('<div class="col-md-1 text-center p-3 custom-time"></div>');
let inputText = $('<input autocomplete="off" type="text" class="col-md-10 form-input w-100 custom-input" name="shopping-input" placeholder="Add a reminder"/>');
let saveButton = $('<button class="col-md-1 btn btn-info custom-save">Save</button>');

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

$("#timeFormEl").sortable({
    update: function() {
        updatesAfterSortable();
        checkTimeColors();
        localStorage.removeItem("taskArray");
        updateLocalStoreage();
}});

function updatesAfterSortable(){
    for (i = 0; i < businessHours; i++){
        timeFormElements.children().eq(i).children().eq(0).text(moment(startHour + i, 'hh').format("hh A"));
    }
}

function updateLocalStoreage(){
    let task = {
        taskHour: "",
        taskText: "",
    }
    console.log(timeFormElements.length)
    for (i = 0; i < timeFormElements.children().length; i++){
        if (timeFormElements.children().eq(i).children().eq(1).val() !== ""){
            task.taskText = timeFormElements.children().eq(i).children().eq(1).val();
            task.taskHour = timeFormElements.children().eq(i).children().eq(0).text()
            taskArray = [];
            taskArray.push(task);
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

let taskArray = JSON.parse(localStorage.getItem("taskArray"));
if (taskArray === null) {
    taskArray = [];
}

for (i = 0; i < timeFormElements.children().length; i++) {
    for (j = 0; j < taskArray.length; j++){
        if (taskArray[j].taskHour === timeFormElements.children().eq(i).children().eq(0).text()){
            timeFormElements.children().eq(i).children().eq(1).val(taskArray[j].taskText);
        }
    }
}

let customInput =$(".custom-input");
let saveButtonPress = $(".custom-save");

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
saveButtonPress.on("click", colectInput)


function valueEnter(event){
    event.preventDefault();
    console.log($(event.target).val())
    // if ($(event.target).val() ==="") {
    //     $(event.target).css({backgroundColor: "lightgray"});
    // } 
    $(event.target).keydown(function() {
        if ($(event.target).val() ==="") {
            $(event.target).css({backgroundColor: "orange"});
        } 
        // if ($(event.target).val() ==="") {
        //     $(event.target).css({backgroundColor: "lightgray"});
        // }
    });
}
customInput.on("click", valueEnter)

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
checkTimeColors()

function checkTimeColors(){
    for (i = 0; i < timeFormElements.children().length; i++){
        let timeLineEl = timeFormElements.children().eq(i);
        let timeAtLine = timeLineEl.children().eq(0).text();
        applyTimeColors(timeLineEl, timeAtLine);
    }
}

function applyTimeColors(timeLineEl, timeAtLine){
    let checkTime = moment(timeAtLine, 'hh A').isBefore(moment()); //true or false
    if (timeAtLine === moment().format('hh A')){
        timeLineEl.children().eq(1).css({backgroundColor: "red", color: "white"});
    }else if (checkTime){
        timeLineEl.children().eq(1).css({backgroundColor: "lightgray", color: "black"});
    } else {
        timeLineEl.children().eq(1).css({backgroundColor: " #ccd5ae", color: "black"});
    }
}

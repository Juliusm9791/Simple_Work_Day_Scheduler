let today = moment();
$("#currentDay").text(today.format("MMM Do, YYYY"));

$("#hourNow").text(moment().format('LTS'));
setInterval(function(){
    $("#hourNow").text(moment().format('LTS'));
},1000);

let startHour = 9;
let businesHours = 20;
let timeFormElements = $("#timeFormEl");
let dayHours = $('<form class="dayHours d-flex row">');
let listHour = $('<div class="col-md-1 text-center p-3"></div>');
let inputText = $('<input type="text" class="col-md-10 form-input w-100 custom-input" name="shopping-input" placeholder="Add a reminder"/>');
let saveButton = $('<button class="col-md-1 btn btn-info custom-save">Save</button>');

function createTimeFormEl(){
    for (i = startHour; i < startHour + businesHours ; i++) {
        listHour.text(moment(i, 'hh').format("hh A"))
        dayHours.append(listHour);
        dayHours.append(inputText);
        dayHours.append(saveButton);
        timeFormElements.append(dayHours.clone());
    }
}
createTimeFormEl();

// let task = {
    //     taskHour: 0,
    //     taskText: "",
    // }
    let customInput =$(".custom-input");
    let saveButtonPress = $(".custom-save");
    
    function colectInput(event) {
        event.preventDefault();
        let btnClicked = $(event.target);
        let taskText = btnClicked.prev().val();
        let arr = saveData();
        console.log(arr + " LLL " + taskText);
    }
    saveButtonPress.on("click", colectInput)
    
    
    for (i = 0; i < timeFormElements.children().length; i++){
        let timeLineEl  = document.getElementById("timeFormEl").children[i];
        let timeAtLine = timeLineEl.children[0].textContent;
        let checkTime = moment(timeAtLine, 'hh A').isBefore(moment()); //true or false
        if (timeAtLine === moment().format('hh A')){
            timeLineEl.children[1].setAttribute("style", "background-color: red; color: white;");
        }else if (checkTime){
            timeLineEl.children[1].setAttribute("style", "background-color: lightgray;");
        } else {
            timeLineEl.children[1].setAttribute("style", "background-color: green");
        }
    }
// console.log(timeFormElements.children().children().siblings().eq(0).text())
// console.log(timeFormElements.children().length)
function saveData(){
    let taskArray =[];
    for (i = 0; i < timeFormElements.children().length; i++){
      let timeLineEl  = document.getElementById("timeFormEl").children[i];
      let textAtLine = timeLineEl.children[1].value;
      taskArray.push(textAtLine);
    }
    console.log(textAtLine + "hi");
    return taskArray;
}
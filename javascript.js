var firebaseConfig = {
    apiKey: "AIzaSyDd7ftV2s81ju5j3Kz9W4wILjQZokXuPmM",
    authDomain: "tawnys-testing-app.firebaseapp.com",
    databaseURL: "https://tawnys-testing-app.firebaseio.com",
    projectId: "tawnys-testing-app",
    storageBucket: "tawnys-testing-app.appspot.com",
    messagingSenderId: "846836473423",
    appId: "1:846836473423:web:8d17b5acdd2350d941143a"
};

// 1. Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Create a variable to reference the database.
var database = firebase.database();

// If any errors are experienced, log them to console.
function checkError(errorObject) {
    console.log("The read failed: " + errorObject.code);
};

// 2. Whenever a user clicks the submit-bid button
$("#submitInfo").on("click", function (event) {
    event.preventDefault();

    // get input values
    var tName = $("#data-name").val().trim();
    var tDest = $("#data-dest").val().trim();
    var tTime = $("#data-time").val().trim();
    var tFreq = $("#data-rate").val().trim();


    // temp varibales to hold train data
    var newTrain = {
        trainName: tName,
        trainDestination: tDest,
        trainTime: tTime,
        trainFrequency: tFreq
    }
    // save new data in firebase
    database.ref().push(newTrain);

    //check console log for errors 
    console.log(newTrain.trainName);
    console.log(newTrain.trainDestination);
    console.log(newTrain.trainTime);
    console.log(newTrain.trainFrequency);

    //clears text boxes
    $("#data-name").val("");
    $("#data-dest").val("");
    $("#data-time").val("");
    $("#data-rate").val("");


});

//3. create firebase event for adding train times to database

database.ref().on("child_added", function (childSnapshot) {

    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDestination);
    console.log(childSnapshot.val().trainTime);
    console.log(childSnapshot.val().trainFrequency);

    //store it all in a variable 

    // calculate train times using hard math 
    // to calculate the next train time: 

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(childSnapshot.val().trainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % childSnapshot.val().trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = childSnapshot.val().trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



    //create new row
    var tableRow = $("<tr>")

    var nameTD = $("<td>").text(childSnapshot.val().trainName);
    var destTD = $("<td>").text(childSnapshot.val().trainDestination);
    var timeTD = $("<td>").text(childSnapshot.val().trainTime);
    var freqTD = $("<td>").text(childSnapshot.val().trainFrequency);

    var timeTilTrain = $("<td>").text(moment(nextTrain).format ("hh:mm"));
    var minutesAway = $("<td>").text(tMinutesTillTrain);


    // append tablerow to the table 
    tableRow.append(nameTD, destTD, timeTD, freqTD, timeTilTrain, minutesAway);
    $("tbody").append(tableRow);




});
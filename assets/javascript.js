


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDxUhypGDArjVtf18bOF4qsd--isqeRsVw",
    authDomain: "train-times-1f2d6.firebaseapp.com",
    databaseURL: "https://train-times-1f2d6.firebaseio.com",
    projectId: "train-times-1f2d6",
    storageBucket: "train-times-1f2d6.appspot.com",
    messagingSenderId: "578214349047"
  };
  firebase.initializeApp(config);


// Create a variable to reference the database
var database = firebase.database();

var name = "";
var firstTime ;
var dest = "";
var freq ;


//send the new stuff to the db
$("#submit-button").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    firstTime = $("#date-input").val().trim();
    dest = $("#dest-input").val().trim();
    freq = $("#freq-input").val().trim();
    console.log(name);

    // Code for handling the push
    if(name.length>0 && firstTime.length>0 && dest.length>0 && freq.length>0){
    database.ref().push({
        name: name,
        firstTime: firstTime,
        dest: dest,
        freq: freq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
    $("#name-input").val("");
    $("#date-input").val("");
    $("#dest-input").val("");
    $("#freq-input").val("");
}

});


//get the stuff from the db
database.ref().on("child_added", function(childSnapshot) {
    //log one thing to make sure its working
    console.log(childSnapshot.val().name);
     nextTime= childSnapshot.val().firstTime;

firstTime=childSnapshot.val().firstTime;
freq=childSnapshot.val().freq;

// calcTimes();

console.log("firstTime= "+firstTime);
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
console.log(freq);
    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));



    $("#worker-table").append(`
        <tr>
        	<td scope=row>${childSnapshot.val().name}</td>
        	<td>${childSnapshot.val().dest}</td>
        	
            <td>${childSnapshot.val().freq}</td>
            <td>${moment(nextTrain).format("hh:mm")}</td>
            <td>${tMinutesTillTrain}</td>
        </tr>
        `
    );
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});

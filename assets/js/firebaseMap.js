$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyD5DZVh3UbeZo7C4syMGFA-887mJQMH00o",
        authDomain: "project-01-tn-pr-1556395373720.firebaseapp.com",
        databaseURL: "https://project-01-tn-pr-1556395373720.firebaseio.com",
        projectId: "project-01-tn-pr-1556395373720",
        storageBucket: "project-01-tn-pr-1556395373720.appspot.com",
        messagingSenderId: "14048652699",
        appId: "1:14048652699:web:2bae55ee46bd85b7"
    };

    firebase.initializeApp(config);

    var database = firebase.database();

    // click event for pushing address to database when clicking the submit button
    $("#locate-button").on("click", function (event) {
        event.preventDefault();

        // variables to store user inputs
        var addressInput = $("#location-input").val().trim();

        // Creates local "temporary" object for holding address data
        var newAddress = {
            address: addressInput,
        };

        // pushes address data to firebase
        database.ref().push(newAddress);

    });

    // event listener that adds new data into firebase when user submits new entry
    database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        // stores firebase values into variables
        var addressInput = sv.address;

        // handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

});

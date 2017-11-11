$(function(){
   

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCZI7-GNlZg4V3g2HquIu2hVIn1s9YciYw",
    authDomain: "campusmarketplace-d8706.firebaseapp.com",
    databaseURL: "https://campusmarketplace-d8706.firebaseio.com",
    projectId: "campusmarketplace-d8706",
    storageBucket: "campusmarketplace-d8706.appspot.com",
    messagingSenderId: "39930550082"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  
  //firebase.auth().signOut();
  
  
//   dbRef.on('value', snap => test.innerText =  snap.val());

$('#provideSubmit').click(function(e){
    console.log("submitted")
    e.preventDefault();
    var provider = $("#provider").val();
    var service = $("#service1").val();
    console.log(provider,service)
    console.log("clicked")
    var dbRef = firebase.database().ref().child("servicsAvailable");
    console.log(dbRef)
    dbRef.push({
      service,
      provider
    }
    );
    $("#output1").addClass(" alert alert-success animated fadeInUp").html("Submitted!");
});


$('#retrieveSubmit').click(function(e){
    console.log("submitted")
    e.preventDefault();
    var requester = $("#buyer").val();
    var service = $("#service2").val();
    console.log(provider,service)
    console.log("clicked")
    var dbRef = firebase.database().ref().child("servicsAvailable");
    console.log(dbRef)
    var contacts = []
    dbRef.once('value').then(function(snapshot){
      console.log(snapshot.val())
      for (var key in snapshot.val()){
        var obj = snapshot.val()[key].service;
        console.log(obj)
        if(obj == service){
          contacts.push(snapshot.val()[key].provider)
          console.log(contacts)
        }
      }
    console.log("contacts" + contacts)
    var str = "Contact the following for \"" + service + "\":"
    for (var n in contacts){
      str+="\n"
      str+=contacts[n]
    }
    console.log(str)
    $("#output2").addClass(" alert alert-success animated fadeInUp").html(str);
    console.log("displayed")
      // for each (var item in snapshot.val()) {
      //   console.log(item)
      // }
    //displayContacts(contacts, service)
    }) 
    
});

});

function displayContacts(contacts, service){
  console.log("contacts" + contacts)
    var str = "Contact the following for \"" + service + "\":"
    for (var n in contacts){
      str+="\n"
      str+=contacts[n]
    }
    console.log(str)
    console.log($("#output2"))
    $("#output2").addClass(" alert alert-success animated fadeInUp").html(str);
    console.log("displayed")
}
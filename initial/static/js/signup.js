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
  
  var test = document.getElementById('bigger')
  var dbRef = firebase.database().ref().child('text')
  
  const auth = firebase.auth();
  //firebase.auth().signOut();
  
  
//   dbRef.on('value', snap => test.innerText =  snap.val());

$('#signup').click(function(e) {
    
    e.preventDefault();
    var temp = $("#first-name")
    var first_name = $("#first-name").val();
    var last_name = $("#last-name").val();
    var email = $("input[name=email]");
    var username = $("input[name=username]");
    var password = $("input[name=password]");
    console.log(first_name,last_name)
    console.log(temp)
    var fullname = first_name + " " + last_name
    console.log("clicked")
    //little validation just to check username
    if (email.val() != "") {
        // TODO: Check for Real email
        var user = email.val()
        var pass = password.val()
        console.log(user,pass)
        const promise = auth.createUserWithEmailAndPassword(user,pass)
        promise.catch(e => console.log(e.message))
        firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser){
                    $("#output").removeClass(' alert-danger');
                    $("input").css({
                        "height":"0",
                        "padding":"0",
                        "margin":"0",
                        "opacity":"0"
                    });
                    // console.log(firebaseUser)
                    $('button[type="submit"]').html("continue")
                    var current = firebase.auth().currentUser;
                    console.log(fullname)
                    current.updateProfile({
                        displayName: fullname
                    }).then(function(){
                        console.log("Success")
                    }, function(error){
                        console.log(error)
                    });
                    current.sendEmailVerification().then(function() {
                        console.log("Email was sent.")
                        window.location = "index.html";
                    }, function(error) {
                        console.log(error)
                    });
                    console.log(current)
                    
                    // window.location.replace("index.html")
                }
                else{
                    console.log('not logged in',promise)
                    if(promise!= null){
                        $("#output").removeClass(' alert alert-success');
                        $("#output").addClass("alert alert-danger animated fadeInUp").html("Incorrect Password or Email");
                    }
                    // $("#output").fadeOut(4000,linear);
                }
            })
    } 
    else {
        //remove success mesage replaced with error message
        $("#output").removeClass(' alert alert-success');
        $("#output").addClass("alert alert-danger animated fadeInUp").html("Pleae Enter a Username");
    }
    //console.log(textfield.val());

});
});

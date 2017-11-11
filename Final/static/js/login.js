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
  //firebase.auth().signOut();\
  
  var provider = new firebase.auth.GoogleAuthProvider();

  
  
//   dbRef.on('value', snap => test.innerText =  snap.val());

var textfield = $("input[name=user]");
            $('button[type="login"]').click(function(e) {
                e.preventDefault();
                //little validation just to check username
                if (textfield.val() != "") {
                    var user = $("#user").val()
                    var pass = $("#pass").val()
                    
                    console.log(user,pass)
                    if(pass == null)
                        $("#output").addClass("alert alert-danger animated fadeInUp").html("Please Enter in Password");

                    try{
                        const promise = auth.signInWithEmailAndPassword(user,pass)
                        promise.catch(function(error){
                            console.log(error.message)
                            $("#output").removeClass(' alert alert-success');
                            $("#output").addClass("alert alert-danger animated fadeInUp").html("Incorrect Password or Email");
                        })
                        
                        firebase.auth().onAuthStateChanged(firebaseUser => {
                            if (firebaseUser){
                                $("#output").removeClass(' alert-danger');
                                $("input").css({
                                    "height":"0",
                                    "padding":"0",
                                    "margin":"0",
                                    "opacity":"0"
                                });
                                console.log(firebaseUser)
                                $('button[type="submit"]').html("continue")
                                window.location = "index.html";
                                // window.location.replace("index.html")
                            }
                            else{
                                console.log('not logged in')
                                // if(promise != null){
                                //     $("#output").removeClass(' alert alert-success');
                                //     $("#output").addClass("alert alert-danger animated fadeInUp").html("Incorrect Password or Email");
                                // }
                                // $("#output").fadeOut(4000,linear);
                            }
                        })
                        
                    }
                    catch(e){
                        console.log(e.message)
                    }
                    
                } else {
                    //remove success mesage replaced with error message
                    $("#output").removeClass(' alert alert-success');
                    $("#output").addClass("alert alert-danger animated fadeInUp").html("Sorry Please Enter a Username ");
                    $("#output").fadeOut(1000);
                }
                //console.log(textfield.val());

            });
$('#signup').click(function(e) {
    window.location = "signup.html"
    return false
});
    
$("#google").click(function(e) {
        firebase.auth().signInWithRedirect(provider);
        
        firebase.auth().getRedirectResult().then(function(result) {
          if (result.credential) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // ...
          }
      // The signed-in user info.
          var user = result.user;
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    })

});

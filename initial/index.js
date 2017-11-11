$(function(){
    var signedout = false
    window.onload = function(){
        var config = {
        apiKey: "AIzaSyCZI7-GNlZg4V3g2HquIu2hVIn1s9YciYw",
        authDomain: "campusmarketplace-d8706.firebaseapp.com",
        databaseURL: "https://campusmarketplace-d8706.firebaseio.com",
        projectId: "campusmarketplace-d8706",
        storageBucket: "campusmarketplace-d8706.appspot.com",
        messagingSenderId: "39930550082"
        };
        firebase.initializeApp(config);
    
        // window.location = "login.html"
        
        firebase.auth().onAuthStateChanged(firebaseUser => {
                if (firebaseUser){
                    console.log(firebaseUser)
                    console.log(document.getElementById("sign").innerHTML)
                    document.getElementById("sign").innerHTML = "Your Account" //"Welcome  " + firebaseUser.displayName
                }
                else{
                    document.getElementById("sign").innerHTML = "Log In"
                    console.log("No one logged in")
                }
        })
        
        $('#sign').click(function(e) {
            console.log("clicked")
            // document.getElementById("sign").innerHTML = "Sign Out"
            // window.location = "login.html"
            firebase.auth().onAuthStateChanged(firebaseUser => {
                    if (firebaseUser){
                        console.log(firebaseUser)
                        window.location = "account.html"
                        // $(this).attr("href","index.html");
                        // document.getElementById("sign").innerHTML = "Welcome  " + firebaseUser.displayName
                        // const auth = firebase.auth();
                        // const promise = firebase.auth().signOut();
                        // signedout = true
                        // promise.catch(e => console.log(e.message, "Couldn't log out"))
                        // console.log("User: ", firebase.auth().currentUser)
                        // console.log("Signed Out")
                    }
                    else{
                        if(!signedout){
                            console.log('not logged in')
                            window.location = "login.html"
                            document.getElementById("sign").innerHTML = "Log In"
                        }
                    }
                })
                
            if(document.getElementById("sign").innerHTML === "Log In") window.location = "login.html"
            
            return false
        });
    };
    
    
});





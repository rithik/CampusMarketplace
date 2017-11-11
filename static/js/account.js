$(function(){
    var signedout = false
    var clicked = false
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
                    
                    var userId = firebase.auth().currentUser.uid;
                    
                    var username, birthday, gender, phoneNumber;
                    
                    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                        username = snapshot.val().username;
                        birthday = snapshot.val().date_of_birth
                        gender = snapshot.val().gender
                        phoneNumber = snapshot.val().phone_number
                        console.log(phoneNumber)
                    
                    

                        document.getElementById("sign").innerHTML = "Sign Out" //"Welcome  " + firebaseUser.displayName
                        if(name) document.getElementById("user").innerHTML = name
                        if(name) document.getElementById("name").innerHTML = name
                        if(firebaseUser.email) document.getElementById("email").innerHTML = firebaseUser.email
                        if(phoneNumber) document.getElementById("phone").innerHTML = phoneNumber
                        if(firebaseUser.photoURL != null) $("#picture").attr("src", "https://avatars0.githubusercontent.com/u/9752535?v=4&s=460")
                        if(gender) document.getElementById("gender").innerHTML = gender
                        if(birthday) document.getElementById("birth").innerHTML = birthday
                        var string = "mailto:" + firebaseUser.email
                        $("#email").attr("href", string);
                    
                    });
                    
                }
                else{
                    console.log("No one logged in")
                    document.getElementById("sign").innerHTML = "Log In"
                }
        })
        
        $('#sign').click(function(e) {
            console.log("clicked")
            // document.getElementById("sign").innerHTML = "Sign Out"
            // window.location = "login.html"
            firebase.auth().onAuthStateChanged(firebaseUser => {
                    if (firebaseUser){
                        console.log(firebaseUser)
                        $(this).attr("href","index.html");
                        document.getElementById("sign").innerHTML = "Welcome  " + firebaseUser.displayName
                        const auth = firebase.auth();
                        const promise = firebase.auth().signOut();
                        signedout = true
                        promise.catch(e => console.log(e.message, "Couldn't log out"))
                        console.log("User: ", firebase.auth().currentUser)
                        console.log("Signed Out")
                        window.location = "index.html"
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
    
    $("#edit").click(function(){
        if(clicked){
            $("#name").removeClass("hidden")
            // $("#user").addClass("hidden")
            $("#email").removeClass("hidden")
            $("#picture").removeClass("hidden")
            $("#birth").removeClass("hidden")
            $("#gender").removeClass("hidden")
            $("#phone").removeClass("hidden")
            
            $('#editbirth').addClass('hidden')
            $('#editphone').addClass('hidden')
            $('#editname').addClass('hidden')
            $('#editgender').addClass('hidden')
            $('#editemail').addClass('hidden')
            
            const firebaseUser = firebase.auth().currentUser
            firebaseUser.updateProfile({
                displayName: $('#editname').val() ,
                email: $('#editemail').val(),
                photoURL: "https://avatars0.githubusercontent.com/u/9752535?v=4&s=460"
            }).then(function(){
                console.log("success")
                firebase.database().ref('users/' + firebaseUser.uid).set({
                    username: $('#editname').val(),
                    email: $('#editemail').val(),
                    date_of_birth : $('#editbirth').val(),
                    phone_number : $('#editphone').val(),
                    gender : $('#editgender').val()
                });
                var name = $('#editname').val() 
                var gender = $('#editgender').val() 
                var birthday = $('#editbirth').val() 
                if(name) document.getElementById("user").innerHTML = name
                if(name) document.getElementById("name").innerHTML = name
                if(firebaseUser.email) document.getElementById("email").innerHTML = $('#editemail').val()
                if(firebaseUser.phone) document.getElementById("phone").innerHTML = $('#editphone').val()
                if(firebaseUser.photoURL) $("#picture").attr("src", firebaseUser.photoURL)
                if(gender) document.getElementById("gender").innerHTML = gender
                if(birthday) document.getElementById("birth").innerHTML = birthday
                var string = "mailto:" + firebaseUser.email
                $("#email").attr("href", string);
                
            },function(error) {
                // An error happened.
                console.log(error)
            });
            clicked = false
        }
        
        else{
            clicked = true
            $("#name").addClass("hidden")
            // $("#user").addClass("hidden")
            $("#email").addClass("hidden")
            $("#picture").addClass("hidden")
            $("#birth").addClass("hidden")
            $("#gender").addClass("hidden")
            $("#phone").addClass("hidden")
            
            $('#editbirth').removeClass('hidden')
            $('#editphone').removeClass('hidden')
            $('#editname').removeClass('hidden')
            $('#editgender').removeClass('hidden')
            $('#editemail').removeClass('hidden')
            
            $("#editname").attr("value", $('#name').text());
            $("#editemail").attr("value", $('#email').text());
            $("#editbirth").attr("value", $('#birth').text());
            $("#editgender").attr("value", $('#gender').text());
            $('#editphone').attr('value',$('#phone').text())
            
        }
    })
    
    
});





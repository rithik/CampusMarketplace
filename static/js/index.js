$(function() {

    var dimmerButton = $('.dim');
    var dimmer = $('.dimmer');
    var exit = $('.exit');
    dimmerButton.on('click', function() {
        dimmer.show();
    });
    exit.on('click', function() {
        dimmer.hide();
    });
    
    $('#login').click(function(e){
        
    });

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});

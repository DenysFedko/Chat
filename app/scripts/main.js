$(document).ready(function() {

	$('.sign-in .button').click(function(){
		$('.sign-in').hide();
	});

	$('.chat-container').click(function(){
		$('.sidebar').toggleClass('opened');
	});

	$('.msg-send').click(function () {
		if($('.msg-field').val() != '') {
			var message =  $('.msg-field').val();

			$('.main').prepend("<div class=\"message-box my-message\">\n" +
				"<img src=\"images/img1.jpeg\" alt=\"myavatar\" class=\"avatar\">\n" +
				"<p class=\"message\">" + message + "</p></div>").animate({height: 'show'}, 500);
			$('.msg-field').val('');

			setTimeout(function () {
				$('.main').prepend("<div class=\"message-box his-message\">\n" +
					"<img src=\"images/img2.jpg\" alt=\"myavatar\" class=\"avatar\">\n" +
					"<p class=\"message\">" + textAnswer() + "</p></div>");
			}, 700); // время в мс

		

		} else alert("Empty message");
	});
	
	function textAnswer() {
		switch(randomInteger(0,4)) {
			case 0: return 'ok';
			case 1: return 'good';
			case 2: return 'very well';
			case 3: return 'It\'s cool!';
			case 4: return 'Thank\'s!';
		}
	}

	function randomInteger(min, max) {
		var rand = min + Math.random() * (max + 1 - min);
		rand = Math.floor(rand);
		return rand;
	}
});

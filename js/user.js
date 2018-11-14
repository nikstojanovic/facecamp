// Fetch user id from get parameter
var url = new URL(window.location.href);
var user_id = url.searchParams.get("id");

// Load user data
function loadUserData() {
	getUsers(true);
	$.when(getStatuses(user_id)).done(getImages(user_id));
	// getStatuses(user_id);
}

function displayUser() {
	user_list.forEach(function(user) {
        if(user.id == user_id) {
			$('#user-image').html('<img src="img/' + user.image + '" />');
			$('#user-data').html("<p>" + user.name + "</p><br>"
				+ "Phone: " + user.phone + "<br>"
				+ "Email: " + user.mail + "<br>"
				+ "Birthday: " + user.birth.substring(8, 10) + "-" + user.birth.substring(5, 7) + "-" + user.birth.substring(0, 4) + "<br>"
				+ "Sex: " + user.sex + "<br>");
        }
    });
}
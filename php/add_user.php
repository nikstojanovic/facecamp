<?php
	include 'functions.php';

	// Accessing users data sent from frontend
	$user = json_decode(file_get_contents("php://input"));
	
	// Convert array to json and send it to frontend
	echo json_encode(add_data('users', $user));
?>
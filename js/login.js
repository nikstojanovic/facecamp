// center the content vertically on page load, and restrict the date selector
$(document).ready(function() {
    centerVertically("wrapper");
    dynamicDateSelector();
});

// center the content vertically on window resize
$(window).resize(function() {
    centerVertically("wrapper");
});

// function to center content vertically
function centerVertically(element) {
    let windowHeight = window.innerHeight;
    let contentHeight = $("#" + element).height();

    if (windowHeight > contentHeight) {
        $("#" + element).css('margin-top', ((windowHeight - contentHeight) / 2) + "px");
    }
}

// restricts date input so only people between 18 and 100 years of age can register
function dynamicDateSelector() {
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    
    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    $("#birthday").attr({
        "max" : (year-18) + "-" + month + "-" + day,
        "min" : (year-100) + "-" + month + "-" + day
    });
}

// sign up function
function signUp() {
    let user = {
        id: makeId(),
        first_name: $("#fname").val(),
        last_name: $("#lname").val(),
        telephone: $("#tel").val(),
        email: $("#email").val(),
        password: $("#pass").val(),
        birthday: $("#birthday").val(),
        sex: $("input[name='sex']:checked").attr("id"),
        image: "no-img.png"
    }

    let validationError = true;
    
    // check if any registration field is empty
    if(user.first_name === "" || user.last_name === "" || user.telephone === "" || user.email === "" || user.password === "" || user.birthday === "") {
        $("#statusBox").html("All fields must contain data");
        validationError = true;
    } else {
        $("#statusBox").html("");
        validationError = false;
    }

    // only lowercase and uppercase letters are allowed in name
    let namePattern = /[\d\W]/g;
    if(namePattern.test(user.first_name) || namePattern.test(user.last_name)) {
        $("#statusBox").html("Only lowercase and uppercase letters are allowed in first and last name");
        validationError = true;
    }

    // phone pattern is +381-xx-xx-xx-xxx
    let phonePattern = /^\+381\-\d{2}\-\d{2}\-\d{2}\-\d{1,3}/g;
    if(!phonePattern.test(user.telephone)) {
        $("#statusBox").html("Telephone number should be in format +381-xx-xx-xx-xxx");
        validationError = true;
    }

    // email pattern is x@x.xx
    let emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    if(!emailPattern.test(user.email)) {
        $("#statusBox").html("Please enter a valid email address, format x@x.xx");
        validationError = true;
    }

    // password must contain one uppercase letter, one number and one special character
    let passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/g;
    if(!passwordPattern.test(user.password)) {
        $("#statusBox").html("Password must contain at least 8 characters, one uppercase letter, one number and one special character");
        validationError = true;
    }

    // check if person is older than 18 years
    let d = new Date();
    let year = d.getFullYear() - 18;
    let month = d.getMonth() + 1;
    let day = d.getDate();

    if(year < Number(user.birthday.substring(0, 4))) {
        $("#statusBox").html("You must be at least 18 years old to register!");
        validationError = true;
    } else if (year === Number(user.birthday.substring(0, 4)) && month < Number(user.birthday.substring(5, 7))) {
        $("#statusBox").html("You must be at least 18 years old to register!");
        validationError = true;
    } else if (year === Number(user.birthday.substring(0, 4)) && month === Number(user.birthday.substring(5, 7)) && day < Number(user.birthday.substring(8, 10))) {
        $("#statusBox").html("You must be at least 18 years old to register!");
        validationError = true;
    }

    if(!validationError) {
        let userExists = false;

        $.get("php/get_users.php", function(receivedData) {
            // check if user email already exists in database
            let data = JSON.parse(receivedData);
            for (let e in data.data) {
                if(data.data[e].email == $("#email").val()) {
                    $("#statusBox").html('User with same email already exists');
                    userExists = true;
                }
            }
            // create a new user if email doesn't exist in database and automatically log in
            if (!userExists) {
                user.password = md5(user.password);
                $.ajax({
                    type: "POST",
                    url: "php/add_user.php",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(user)
                })
                .done(logIn(user.email, user.password));
            }
        });
    }
}

// generate a random ID
function makeId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// login function
function logIn(eml, pass) {
    let user = {
        email: "",
        password: ""
    }

    if (arguments.length === 0) {
        // login parameters by clicking login button
        user.email = $("#logEmail").val();
        user.password = md5($("#logPassword").val());
    } else {
        // login parameters by clicking signup button
        user.email = eml;
        user.password = pass;
    }

    // check if email and password exist in database
    $.get("php/get_users.php", function(receivedData) {
        let data = JSON.parse(receivedData);
        for (let e in data.data) {
            if(data.data[e].email == user.email && data.data[e].password == user.password) {
                localStorage.setItem('user_id', data.data[e].id);
                document.location.replace('home.html');
                break;
            }
        }
        if (!localStorage.getItem('user_id')) {
            $("#statusBox").html('Wrong username and password combination.');
        }
    });
}
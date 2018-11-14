// Reloading current image
function refreshPage() {
    location.reload();
}

// Sort feeds by timestamp
function sortFeeds() {
    feed_list.sort(function(x, y){
        return y.timestamp - x.timestamp;
    });
    if((image_loaded || status_loaded) && users_loaded) {
        displayFeeds();
    }
}

// Sort comments by timestamp
function sortComments() {
    comment_list.sort(function(x, y){
        return x.timestamp - y.timestamp;
    });
    if(comments_loaded) {
        displayComments();
    }
}

// Return current datetime string
function getDateTime() {
    let currentDate = new Date();
    let months = currentDate.getMonth() + 1;
    let minutes = currentDate.getMinutes();

    if (months < 10) {
        months = "0" + months;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    return currentDate.getDate() + "/"
            + months + "/" 
            + currentDate.getFullYear() + " "  
            + currentDate.getHours() + ":"  
            + minutes;
}

// Return current timestamp as numeric record
function getTimestamp() {
    return new Date().getTime();
}

// Generate random characters for id
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

// Function for logging out user
function logout() {
    localStorage.removeItem('user_id');
    document.location.replace('index.html');
}

// Function for checking if user is logged in
function checkLogin(){
    if(user_id == null) {
        document.location.replace('index.html');
    } else {
        $('nav').append('<a href="#" onclick="logout()">Logout</a>');
    }
}
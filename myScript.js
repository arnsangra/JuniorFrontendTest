
function searchUser() {

    var username = document.getElementById('github_username_form').value;
    if(username != '') {
        var url = 'https://api.github.com/users/' + username;
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url , true);
        xhr.send();
        var results = document.getElementById('result');
        results.innerHTML = '';
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 ) {
                if (xhr.status == 200) {

                    var response = JSON.parse(xhr.responseText);
                    renderUserDescription(response);
                    getUserRepositories(response.repos_url);

                }
                else if (xhr.status == 404) {
                    var user_not_found = document.createElement('div');
                    user_not_found.className = "alert alert-danger";
                    user_not_found.innerHTML = "Does not exist";
                    document.getElementById("result").appendChild(user_not_found);
                }
                else {
                    alert('There was an error');
                }
            }
        }
    }
    else {
        console.log("empty username");
    }

}
function getUserRepositories(url_reps) {

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url_reps , true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 ) {
            console.log("DONE");
            if (xhr.status == 200) {
                var repos = JSON.parse(xhr.responseText);
                renderUserRepositories(repos);
            }
        }
    }
}

function renderUserDescription(resp) {

    var user_desc     = document.createElement("div"),
        user_avatar   = '<a href="' + resp.html_url + '"><img src="' + resp.avatar_url + '" class="col-sm-3 user_avatar"></a>',
        user_login    = '<a href="' + resp.html_url + '"><p class="user_login">@' + resp.login + '</p></a>',
        user_fullname = '<h3>' + resp.name + '</h3>',
        user_bio      = '<p>' + resp.bio + '</p>';

    if (!resp.bio) {
        console.log('inside');
        user_bio = "<p></p>";
    }

    user_desc.setAttribute('id', 'userDescription' );
    user_desc.setAttribute('class', 'row');
    user_desc.innerHTML = user_avatar + '<div class="col-sm-9">' + user_login + user_fullname + user_bio + '</div>';

    document.getElementById("result").appendChild(user_desc);
}

function renderUserRepositories(repos) {

    var userReps = document.createElement("div");
    userReps.setAttribute('id', 'userReps');
    userReps.setAttribute('class', 'row');
    document.getElementById("result").appendChild(userReps);

    var reps_header = document.createElement("div");
    reps_header.className = "reps_header";
    reps_header.innerHTML = '<h3>Repositories</h3>';
    document.getElementById("userReps").appendChild(reps_header);


    var fork_icon = '<span class="octicon octicon-star"></span>';
    var star_icon = '<span class="octicon octicon-git-branch"></span>';

    for(rep in repos) {

        var repo = document.createElement("div");

        var rep_name = '<a href="' + repos[rep].html_url + '"><span class="rep_name">' + repos[rep].name + '</span></a>';

        var rep_stars = '<i class="fa fa-star" aria-hidden="true"></i>' + repos[rep].stargazers_count;
        var rep_forks = '<i class="fa fa-code-fork" aria-hidden="true"></i>' + repos[rep].forks_count;

        var rep_details = '<span class="rep_details">' + rep_stars + ' ' + rep_forks + "</span><hr>";

        repo.innerHTML = rep_name + ' ' + rep_details;
        document.getElementById("userReps").appendChild(repo);
    }
}

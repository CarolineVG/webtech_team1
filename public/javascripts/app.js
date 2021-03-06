var url = "/";

primus = Primus.connect(url, {
    reconnect: {
        max: Infinity // Number: The max delay before we try to reconnect.
      , min: 500 // Number: The minimum delay before we try reconnect.
      , retries: 10 // Number: How many times we should try to reconnect.
    }
  });

  document.querySelector(".react__a").addEventListener("click", function(e) {
    var reactie = document.querySelector(".react__input").value;
    primus.write(reactie);
    console.log("clicked");
    
});

document.querySelector(".likes__like--a").addEventListener("click", function(e) {
    e.preventDefault();
    var likes = document.querySelector(".likes__like--p").value;

    primus.write(likes);
    console.log("clicked likesss");
});


function addReaction(data){
    // create new article / give class 'comments'
    var article = document.createElement("article");
    article.classList.add('comments');

    //create new paragraph / insert value from textfield into paragraph / append paragraph to article
    var par = document.createElement("p"); 
    par.innerHTML = data;
    article.appendChild(par);

    //create profile image / give image source / add class / append image to article
    var profileimage = document.createElement("img");
    profileimage.src = "img/user9.png";
    profileimage.classList.add('comments__pic');
    article.appendChild(profileimage);

    //create new link (name of user) / add class / insert name of user / append to article
    var usernameLink = document.createElement("a");
    usernameLink.classList.add('.comments__a');
    usernameLink.innerHTML = "Som Wan";
    article.appendChild(usernameLink);

    //add new article to comments
    var container = document.getElementById("listcomments");
    container.appendChild(article);
}



primus.on("data", function message(data) {
    addReaction(data);
    console.log("Adding reaction");
});



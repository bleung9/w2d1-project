// c1c6a20f0c56c39b79173ae172089dad1e90a4c9

//require the requisite libraries
var request = require("request");
var secrets = require("./secrets.js");
var fs = require('fs');

//invoked from main fxn w/ an anon callback
function getRepoContributors(repoOwner, repoName, cb) {

  //options is...a thing for the request library to parse through?  if i recall correctly?
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "request",
      "Authorization": secrets.GITHUB_TOKEN
    }
  }

  //parse the JSON string into an object, and pass the object into
  //the callback function (retrieves URL from array of objects for each user)
  //and produces a filePath to send that picture to on my computer
  request(options, function(err, res, body) {
    let obj = JSON.parse(body);
    cb(err, obj);
  });
};




//download images based on URL and sends them to a filepath on my computer
function downloadImageByURL(url, filePath) {
  request.get(url)
       .on("error", function(err) {
          throw err;
       })
       .on("response", function(response) {
          console.log("Downloading image...");
       })
       .pipe(fs.createWriteStream(filePath))
       .on("finish", function() {
          console.log("Download complete");
       })
}



console.log("HELLO FELLOW DENIZEN OF THE INTERNET! WELCOME TO THE GITHUB AVATAR DOWNLOADER!");

//input reponame and repo owner to retrieve pictures from
let input = process.argv;

//check for two names (strings)
if (input.length === 3) {
  console.log("YOU'RE AN IDIOT, YOU'RE MISSING A REPO NAME/OWNER!!!!!!!!!!!!!!!!!!");
} else if (input.length === 2) {
  console.log("YOU'RE A MASSIVE IDIOT, YOU'RE MISSING BOTH THE REPO NAME AND OWNER!!!!!!!!!!!!!!!!!!");
} else {
  //take input reponame and username
  let owner = process.argv[2];
  let name = process.argv[3];

  //get repo contributors, pass an anon callback that will download images into getRepoContributors.
  //the callback is invoked by request on line 25 "cb(err,obj)"
  getRepoContributors(owner, name, function(err, result) {
    // console.log("Errors:", err);
    for (element of result) {
      downloadImageByURL(element.avatar_url, "avatars/" + element.login + ".jpg");
    }
    // console.log("Result:", result);
  });
}



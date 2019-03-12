// c1c6a20f0c56c39b79173ae172089dad1e90a4c9

var request = require("request");
var secrets = require("./secrets.js");
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      "User-Agent": "request",
      "Authorization": secrets.GITHUB_TOKEN
    }
  }
  request(options, function(err, res, body) {
    let obj = JSON.parse(body);
    cb(err, obj);
  });
};

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

let input = process.argv;

if (input.length === 3) {
  console.log("YOU'RE AN IDIOT, YOU'RE MISSING A REPO NAME/OWNER!!!!!!!!!!!!!!!!!!");
} else if (input.length === 2) {
  console.log("YOU'RE A MASSIVE IDIOT, YOU'RE MISSING BOTH THE REPO NAME AND OWNER!!!!!!!!!!!!!!!!!!");
} else {
  let owner = process.argv[2];
  let name = process.argv[3];
  getRepoContributors(owner, name, function(err, result) {
    // console.log("Errors:", err);
    for (element of result) {
      downloadImageByURL(element.avatar_url, "avatars/" + element.login + ".jpg");
    }
    // console.log("Result:", result);
  });
}



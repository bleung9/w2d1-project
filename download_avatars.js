// c1c6a20f0c56c39b79173ae172089dad1e90a4c9

var request = require("request");
var secrets = require("./secrets.js");
var fs = require('fs');


console.log("HELLO FELLOW DENIZEN OF THE INTERNET! WELCOME TO THE GITHUB AVATAR DOWNLOADER!");

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

getRepoContributors("jquery", "jquery", function(err, result) {
  // console.log("Errors:", err);
  for (element of result) {
    downloadImageByURL(element.avatar_url, "avatars/" + element.login + ".jpg");
  }
  // console.log("Result:", result);
});


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
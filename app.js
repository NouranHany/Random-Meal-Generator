const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");

//Creating an express server application
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
})); //using the bodyparser in our app to parse data from post html forms
app.use(express.static('public')); //using express static to serve static files
app.set("view engine","ejs"); //using ejs as our view engine

//request to the home page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  https.get("https://www.themealdb.com/api/json/v1/1/random.php", function(apiResponse) {
    //note that: data event can be fired multiple times, so you have to collect the all data values
    // Then concatenate them all on the firing of the end event
    var chuncks = [];
    apiResponse.on("data", function(data) {
      chuncks.push(data);
    }).on("end", function() {
      var data = Buffer.concat(chuncks);
      var dataObj = JSON.parse(data);

      //Extracting data from the JS Object
      var mealName = dataObj.meals[0].strMeal;
      var imageUrl = dataObj.meals[0].strMealThumb;
      var videoUrl = dataObj.meals[0].strYoutube;
      var recipe = dataObj.meals[0].strInstructions;

      //Passing the values to the template to be filled with
      res.render("result", {
        mealName: mealName,
        imageUrl: imageUrl,
        recipe: recipe
      });
    });
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server Started on port 3000");
});

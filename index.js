const express = require("express");
const app = express();
const port = 3000;
//const request1 = require('request')
const request = require("request");

app.set('view engine','ejs');
var admin = require("firebase-admin");

var serviceAccount = require("./key.json");  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());


app.use(express.urlencoded({extended:true}));

const db = admin.firestore();


app.use( express.static( "views" ) );


app.get("/",(req,res)=>{
    res.render('homePage');
});


app.get("/signup",(req,res)=>{
    res.render('signup');
});




app.get("/signupsubmit",(req,res)=>{
    
    const full_name = req.query.full_name;
    const email = req.query.email;
    const password = req.query.password;
    const repeatpassword = req.query.repeatpassword;
    


    if(password === repeatpassword) {
        db.collection("users")
        .add({
          name: full_name,
          email: email,
          password: password,
          repeatpassword : repeatpassword,

          
        })
        .then(() => {
          res.render("successSignup");
        });
      } 
      else {
        res.send("<center><h1 style=\"padding-top: 20%\">PASSWORD AND RE-ENTER PASSWORD SHOULD BE SAME</h1></center>")
      } 
});
app.get("/loginPage",(req,res)=>{
    res.render('loginPage');
});

app.get('/loginSubmit', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    db.collection("users")
        .where("email", "==", email)
        .where("password", "==", password)
        .get()
        .then((docs) => {
            if(docs.size>0){
              res.sendFile(__dirname + "/htmlPage.html");
            }else{
                res.render("failed");
            }
        
        });
 });


app.get("/forgetPassword",(req,res)=>{
    res.render('forgetPassword');
});

app.get("/getMovie", function (req, res) {
    res.sendFile(__dirname + "/htmlPage.html");
  });

  app.get("/movieName", function (req, res) {
    const movieNameeee = req.query.name_of_movie;
  
    request(
      "http://www.omdbapi.com/?t=" + movieNameeee + "&apikey=68022b8e",
      function (error, response, body) {
        console.log(JSON.parse(body));
        if (JSON.parse(body).Response == "True") {
          
          const director = JSON.parse(body).Director;
          const actors = JSON.parse(body).Actors;
          const year = JSON.parse(body).Year;
          const writer = JSON.parse(body).Writer;
          const language = JSON.parse(body).Language;
          const awards = JSON.parse(body).Awards;
          const genre = JSON.parse(body).Genre;
          
          res.render("movie", {
            
            director: director,
            moveiName: movieNameeee,
            yearOfrelease: year,
            actors: actors,
            writerOfMovie: writer,
            languages: language,
            awards : awards,
            genre : genre,

          });
  
          // res.send("<h1>" + JSON.parse(body).Director + "</h1>");
        } else {
          res.send("SOmethig went wrong");
        }
      }
    );
  });

app.listen(port ,() =>{
    console.log(`example app running ${port}`)
});
const express=require('express');
const bodyParser= require('body-parser')
const { MongoClient, ObjectId } = require('mongodb');


const app= express()
const cors=require('cors')

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended:true
}));

let dbo;
const url_mongodb = 'mongodb+srv://Huzair13:Huz%402002@cluster0.bioliew.mongodb.net/';

MongoClient.connect(url_mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        dbo = client.db('Movies'); // specify the database name here
        console.log('Connected to the movies database');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

// SHOW ALL MOVIES FROM MONGODB
app.get('/', async (req, res) => {
    try {
        const movies = await dbo.collection('MoviesData').find().toArray();
        const movieNames = movies.map(movie => movie.movieName);
        res.json(movieNames);
    } catch (error) {
        console.error("Error fetching movie names:", error);
        res.status(500).json({ error: 'Error' });
    }
});


// ADD NEW MOVIE TO THE MONGODB DATABASE
app.post('/addMovies', async (req, res) => {
    let movieName=req.body.movieName;
    let director=req.body.director;
    let relaseYear= req.body.relaseYear;
    let language=req.body.language;
    let rating =req.body.rating;

    const newMovie={
        movieName : movieName,
        director : director,
        relaseYear :relaseYear,
        language :language,
        rating:rating
    };

    dbo.collection("MoviesData").insertOne(newMovie)
    .then(()=>{
        console.log("One Movie Inserted Successfully !!!!");
        res.send("Insert Successfull :)")
    })
    .catch(()=>{
        console.log("Error at Insert !!!");
    });

  });


//UPDATE MOVIES
app.put('/movies/:movieName', async (req, res) => {
    const { movieName } = req.params;
    const update = req.body;

    if (Object.keys(update).length === 0) {
        return res.status(400).json({ error: 'No update fields provided' });
    }

    try {
        const result = await dbo.collection('MoviesData').updateOne({ movieName : movieName }, { $set: update });
        if (result.modifiedCount > 0) {
            console.log("Update Sucessfull :)")
            res.send("Update Successfull :)")
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error("Error updating movie details:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//FILTER THE MOVIE DETAILS
app.get('/filter', async (req, res) => {
    const { name, director, releaseYear, language, rating } = req.query;
    const filter = {};
  
    if (name) filter.name = new RegExp(name, 'i');
    if (director) filter.director = new RegExp(director, 'i');
    if (releaseYear) filter.releaseYear = parseInt(releaseYear);
    if (language) filter.language = new RegExp(language, 'i');
    if (rating) filter.rating = parseInt(rating);
  
    try {
      const filteredMovies = await dbo.collection('MoviesData').find(filter).toArray();
      res.json(filteredMovies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


//DELETE A MOVIE BY GETTING MOVIE
app.delete('/delete',(req,res)=>{
    const movieName=req.body.movieName;

    dbo.collection('MoviesData').deleteOne({movieName : movieName})
    .then(function(result){
        if(result.deletedCount ==1){
            console.log("Movie Deleted Successfully :)");
            res.send("Movie Deleted Successfully :)")
        }
        else{
            console.log("Movie Data Not Found :(");
            res.send("Movie Data Not Found :(");
        }
    })
    .catch(function(err){
        console.log(err);
    })
});

//SEARCH FOR THE MOVIE
app.get('/search',(req,res)=>{
    const movieName=req.body.movieName;
    dbo.collection('MoviesData').find({movieName : movieName}).toArray()
    .then(function(result){
        if(result.length !=0){
            res.send(result);
        }
        else{
            res.send("Movie Not Found :(")
        }
    })
    .catch(function(err){
        res.send(err);
    });
});

//NUMBER OF MOVIES BASED ON CERTAIN LANGUAUES
app.get('/number',(req,res)=>{
    const {language}= req.query;
    dbo.collection("MoviesData").find({language : language}).toArray()
    .then(function(result){
        const count=result.length;
        res.send({[`Number of ${language} movies`] : count});
    })
    .catch(function(err){
        res.send(err);
    });
})
  


app.listen(5000,()=>{
    console.log("Server started at the port 5000");
});
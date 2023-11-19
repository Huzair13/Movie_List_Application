const express = require('express');
const router = express.Router();
const movieService = require('./movieServices');

//DISPLAY 
router.get('/display', (req, res) => {
    const movies = movieService.getAllMovies();
    const length=movies.length;

    if(length!==0){
        res.status(200).send([
            {'Number of movies Found :' : length},
            movies
        ])
    }
    else{
        res.status(404).send("No Movies Found :(");
    }
});

//ADD MOVIES
router.post('/addMovies',(req,res)=>{
    const movieDetails=req.body;
    const addStatus=movieService.addMovies(movieDetails);
    if(addStatus){
        res.status(200).send("Movie Added Successfully :)")
    }
    else{
        res.status(404).send("Movie is not added or Movie Already Exists :(")
    }
    
})

//UPDATE MOVIES
router.put('/updateMovies/:movieName',(req,res)=>{
    const {movieName}= req.params;
    const update=req.body;
    const updateStatus = movieService.updateMovies(movieName,update);
    if (updateStatus){
        res.status(200).send("Movie details updated successfully :)");
    }
    else{
        res.status(404).send("Movie not found :(");
    }
})

//FILTERS BASED ON CONDITIONS WE PASS
router.get('/filter',(req,res)=>{
    const { name, director, releaseYear, language, rating } = req.query;
    const filter = {};

    if (name) filter.name = new RegExp(name, 'i');
    if (director) filter.director = new RegExp(director, 'i');
    if (releaseYear) filter.releaseYear = parseInt(releaseYear);
    if (language) filter.language = new RegExp(language, 'i');
    if (rating) filter.rating = parseInt(rating);
    console.log(filter);

    const filteredResponse =  movieService.filterMovies(filter);   
    try {
        res.status(200).send(filteredResponse);
    }
    catch(err){
        res.status(404).send(err);
    }
    
})

//SEARCH A MOVIE
router.get('/search', (req, res) => {
    const { movieName } = req.query;
    const movieNameRegex = new RegExp(movieName, 'i');
    const moviesSearched = movieService.searchMovies({ movieName: movieNameRegex });
    const length = moviesSearched.length;

    if(length!==0){
        res.status(200).send(moviesSearched);
    }
    else{
        res.status(404).send("Movie Not Found :(");
    }
    
});

//NUMBER OF MOVIES IN A SPECIFIED LANGUAGE
router.get('/number',(req,res)=>{
    const {language} =req.query;
    const languageRegex = new RegExp(language,'i');
    const searchedResponse= movieService.numberOfMovies({language : languageRegex});
    const length=searchedResponse.length;
    try{
        res.status(200).send([{language : language},{count : length}]);
    }
    catch(err){
        res.send(404).send(err);
    }
});

//DELETE MOVIES BY GETTING NAME OF THE MOVIE
router.delete('/delete',(req,res)=>{
    const {movieName}=req.query;
    const deleted= movieService.deleteMovies(movieName);
    if(deleted){
        res.status(200).send('Movie Deleted Successfully :)');
    }
    else{
        res.status(404).send("Deeletion is not successfull or Movie Data is not found:(");
    }
    
});

module.exports = router;

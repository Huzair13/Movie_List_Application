const fs=require('fs');
const moviesFilePath ='movies.json';

//GET ALL MOVIES 
const getAllMovies=()=>{
    return readMoviesFromFile();
}

//READ MOVIES FROM FILE
const readMoviesFromFile=()=>{
    try{
        const moviesData = fs.readFileSync(moviesFilePath,'utf-8');
        return JSON.parse(moviesData);
    }
    catch(error){
        return [];
    }
};

//WRITE MOVIES
const writeMovies=(movies)=>{
    fs.writeFileSync(moviesFilePath,JSON.stringify(movies,null,2));
}


//ADD MOVIES
const addMovies=(movieDetails)=>{
    let movieName=movieDetails.movieName;
    let director=movieDetails.director;
    let relaseYear= movieDetails.relaseYear;
    let language=movieDetails.language;
    let rating =movieDetails.rating;

    const newMovie={
        movieName : movieName,
        director : director,
        relaseYear :relaseYear,
        language :language,
        rating:rating
    };

    const movies = readMoviesFromFile();

    const movieAlreadyExists = movies.some(function(movie){
        return movie.movieName.toLowerCase() === movieName.toLowerCase();
    });

    if (!movieAlreadyExists) {
        movies.push(newMovie);
        writeMovies(movies);
        return true; 
    } else {
        return false; 
    }
}

//UPDATE MOVIES
const updateMovies = (movieName, updatedDetails) => {
    const movies = readMoviesFromFile();
    const index = movies.findIndex(movie => movie.movieName === movieName);
    console.log(movieName);

    let updateStatus = false;
    if (index !== -1) {
        const updatedMovie = { ...movies[index], ...updatedDetails };
        console.log(updatedMovie);
        movies[index] = updatedMovie;
        writeMovies(movies);
        updateStatus=true;
    } 

    return updateStatus;
}

//FILTER MOVIES BASED ON CRETERIA
const filterMovies=(filter)=>{
    const movies = readMoviesFromFile();
    try {
        const filteredMovies = movies.filter(movie => {
            return Object.entries(filter).every(([key, value]) => {

                if (key === 'releaseYear' || key === 'rating') {
                    
                    return Number(movie[key]) === Number(value);
                } else {
                    return new RegExp(value, 'i').test(movie[key]);
                }

            });
        });
        return filteredMovies;
    } catch (error) {
        console.error(error);
        return [];
    }
}

//SEARCH MOVIES
const searchMovies = (moviesInputJson) => {
    const movies = readMoviesFromFile();

    const moviesSearched = movies.filter(function (movie) {
        return new RegExp(moviesInputJson.movieName, 'i').test(movie.movieName);
    });

    return moviesSearched;
};

// NUMBER OF MOVIES IN A SPECIFIED LANGUAGE
const numberOfMovies = (languageIputJson) => {
    const movies = readMoviesFromFile();

    const moviesOnLang = movies.filter(function (movie) {
        return new RegExp(languageIputJson.language, 'i').test(movie.language);
    });

    return moviesOnLang;
};


//DELETE MOVIES
const deleteMovies=(movieName)=>{
    movies = readMoviesFromFile();

    const indexToDelete = movies.findIndex(function(movie){
        return movie.movieName === movieName;
    });

    let deletedStatus = false;

    if(indexToDelete!=-1){
        const deleted = movies.splice(indexToDelete,1);
        const length=deleted.length;
        if(length!==0){
            writeMovies(movies);
            deletedStatus=true;
        }
        return deleted;
    }
}

module.exports={
    getAllMovies,
    addMovies,
    updateMovies,
    filterMovies,
    searchMovies,
    numberOfMovies,
    deleteMovies
}
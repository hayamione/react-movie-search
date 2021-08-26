import {useState, useEffect} from 'react';
import './App.css';

function App() {

  
let [movieinfo,setMovieinfo]=useState(null);
let [title,setTitle]=useState("harry potter and the chamber of secrets");

useEffect(()=>{

  getmoviedata();
  
},[])


function readTitle(value) {
    setTitle(value);
    // console.log(value);
}

function getmoviedata() {
  let url = `https://omdbapi.com/?t=${title}&plot=full&apikey=4926feba`;

  fetch(url)
  .then((response)=>response.json())
  .then((movie)=>{
    setMovieinfo(movie);
    console.log(movie);
})
.catch((err)=>{
  console.log(err);
})
}

  return (
    <div className="App">
      <div className="container">
        <div className="padd">
          <h1>Movie Search App With React JS Using OMDB Api</h1>
          <div className="search">
            <input type="text" placeholder="Enter Movie Name" onChange={(event)=>{readTitle(event.target.value)}} className="inp"/>
            <button type="button" onClick={getmoviedata} className="btn">Search</button>
          </div>

        {
          movieinfo?.Error===undefined?(
        
          <div class="movie">
            
              <div class="poster">
                <img src={movieinfo?.Poster} alt="Poster" className="img" />
              </div>
              <div class="details">
                <div className="padd">
                  <h2>{movieinfo?.Title}</h2>
                  <p><strong>Genre :</strong> {movieinfo?.Genre}</p>
                  <p><strong>Plot :</strong> {movieinfo?.Plot}</p>
                  <p><strong>Actors :</strong> {movieinfo?.Actors}</p>
                  <p><strong>Director :</strong> {movieinfo?.Director}</p>
                  <p><strong>Writer :</strong> {movieinfo?.Writer}</p>
                  <p><strong>Box Office :</strong> {movieinfo?.BoxOffice}</p>
                  <p><strong>Release Date :</strong> {movieinfo?.Released}</p>
                  <p><strong>Runtime :</strong> {movieinfo?.Runtime}</p>
                  <p><strong>Language :</strong> {movieinfo?.Language}</p>
                  <p><strong>Country :</strong> {movieinfo?.Country}</p>
                  <p><strong>Awards :</strong> {movieinfo?.Awards}</p>
                  <p><strong>Production :</strong> {movieinfo?.Production}</p>
                  <p><strong>Ratings</strong></p>

                  <div className="rating">
                    {   
                  movieinfo?.Ratings.map((rating,index)=>(

                    <div key={index}>
                        <strong>{rating.Source}</strong>
                        <p>{rating.Value}</p>
                    </div>
                  ))
                    }
                  </div>

                </div>
              </div>
          </div>
          
          ):

          (
            <h1>Movie Not Found</h1>
          )   

      }
        </div>
        <footer><strong>Developed and Designed By : </strong>Haya Zubair</footer>
      </div>
      {/*<header className="App-header">
         <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
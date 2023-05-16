import { useState, useEffect } from "react";
import "./App.css";
import { Button } from "react-bootstrap";
import Plotpopup from "./Plotpopup";
import notfound from "./img/not-found.png";
import posternotfound from "./img/poster-not-found.png";

function App() {
  let [movieinfo, setMovieinfo] = useState(null);
  let [title, setTitle] = useState("harry potter");
  let [popup, setPopup] = useState("");

  useEffect(() => {
    getmoviedata();
  }, []);

  function readTitle(value) {
    setTitle(value);
    // console.log(value);
  }

  function getmoviedata() {
    let url = `https://omdbapi.com/?t=${title}&plot=full&apikey=4926feba`;

    fetch(url)
      .then((response) => response.json())
      .then((movie) => {
        setMovieinfo(movie);
        console.log(movie);
        console.log("this is title: ", title);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <div className="App">
        <div className="container">
          <div className="padd">
            <h1>Movie Search App With React JS Using OMDB Api</h1>
            <div className="search">
              <input
                type="text"
                placeholder="Enter Movie Name"
                onChange={(event) => {
                  readTitle(event.target.value);
                }}
                className="inp"
              />
              <Button type="button" onClick={getmoviedata} className="btn">
                Search
              </Button>
            </div>

            {movieinfo?.Error === undefined ? (
              <div class="movie">
                <div class="poster">
                  <img
                    src={
                      movieinfo?.Poster !== "N/A"
                        ? movieinfo?.Poster
                        : posternotfound
                    }
                    alt="Poster"
                    className="img"
                  />
                  <Button className="btn" onClick={() => setPopup("Poster")}>
                    View Poster
                  </Button>
                </div>
                <div class="details">
                  <div className="">
                    <h2>{movieinfo?.Title}</h2>
                    <p>
                      <strong>Genre :</strong> {movieinfo?.Genre}
                    </p>
                    <p>
                      <strong>Plot :</strong> {movieinfo?.Plot.slice(0, 200)}{" "}
                      <span className="more" onClick={() => setPopup("Plot")}>
                        more...
                      </span>
                    </p>
                    <p>
                      <strong>Actors :</strong> {movieinfo?.Actors}
                    </p>
                    <p>
                      <strong>Director :</strong> {movieinfo?.Director}
                    </p>
                    <p>
                      <strong>Writer :</strong> {movieinfo?.Writer}
                    </p>
                    <p>
                      <strong>Box Office :</strong> {movieinfo?.BoxOffice}
                    </p>
                    <p>
                      <strong>Release Date :</strong> {movieinfo?.Released}
                    </p>
                    <p>
                      <strong>Runtime :</strong> {movieinfo?.Runtime}
                    </p>
                    <p>
                      <strong>Language :</strong> {movieinfo?.Language}
                    </p>
                    <p>
                      <strong>Country :</strong> {movieinfo?.Country}
                    </p>
                    <p>
                      <strong>Awards :</strong> {movieinfo?.Awards}
                    </p>
                    <p>
                      <strong>Production :</strong> {movieinfo?.Production}
                    </p>
                    <p>
                      <strong>Ratings</strong>
                    </p>

                    <div className="rating">
                      {movieinfo?.Ratings.map((rating, index) => (
                        <div key={index}>
                          <strong>{rating.Source}</strong>
                          <p>{rating.Value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="not-found">
                <img src={notfound} alt="not-found" />
                Movie Not Found
                <Button
                  onClick={() => window.location.reload(true)}
                  className="btn"
                >
                  {" "}
                  Try Again{" "}
                </Button>
              </div>
            )}
          </div>
          <footer>
            <strong>Developed and Designed By : </strong>Haya Zubair
          </footer>
        </div>
      </div>
      <Plotpopup
        show={popup}
        onHide={() => setPopup(false)}
        plot={movieinfo?.Plot}
        img={movieinfo?.Poster !== "N/A" ? movieinfo?.Poster : posternotfound}
      />
    </>
  );
}

export default App;

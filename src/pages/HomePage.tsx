import { useState, useEffect, ChangeEvent } from 'react';
import '../App.css';
import { Button } from 'react-bootstrap';
import PlotPopup from '../components/PlotPopup';
import { getMovieData } from '../services/movieService';
import type { MovieInfo } from '../types/api';
import notfound from '../assets/images/not-found.png';
import posternotfound from '../assets/images/poster-not-found.png';
import loadingImg from '../assets/images/loading.gif';

type PopupState = 'Plot' | 'Poster' | false;

function App() {
  const [movieinfo, setMovieinfo] = useState<MovieInfo | null>(null);
  const [title, setTitle] = useState<string>('harry potter');
  const [popup, setPopup] = useState<PopupState>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    void getmoviedata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readTitle(value: string) {
    setTitle(value);
  }

  async function getmoviedata() {
    setLoading(true);

    try {
      const movie = await getMovieData(title);
      setMovieinfo(movie);
      console.log(movie);
      console.log('this is title: ', title);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  readTitle(event.target.value);
                }}
                className="inp"
              />
              <Button type="button" onClick={getmoviedata} className="btn">
                Search
              </Button>
            </div>

            {loading ? (
              <div className="not-found loading">
                <img src={loadingImg} alt="loading" />
              </div>
            ) : movieinfo?.Error === undefined ? (
              <div className="movie">
                <div className="poster">
                  <img
                    src={
                      movieinfo?.Poster && movieinfo.Poster !== 'N/A'
                        ? movieinfo.Poster
                        : posternotfound
                    }
                    alt="Poster"
                    className="img"
                  />
                  <Button className="btn" onClick={() => setPopup('Poster')}>
                    View Poster
                  </Button>
                </div>
                <div className="details">
                  <div className="">
                    <h2>{movieinfo?.Title}</h2>
                    <p>
                      <strong>Genre :</strong> {movieinfo?.Genre}
                    </p>
                    <p>
                      <strong>Plot :</strong>{' '}
                      {movieinfo?.Plot ? movieinfo.Plot.slice(0, 200) : ''}{' '}
                      <span className="more" onClick={() => setPopup('Plot')}>
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
                      {movieinfo?.Ratings?.map((rating, index) => (
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
                <Button onClick={() => window.location.reload()} className="btn">
                  Try Again
                </Button>
              </div>
            )}
          </div>
          <footer>
            <strong>Developed and Designed By : </strong>Haya Zubair
          </footer>
        </div>
      </div>
      <PlotPopup
        show={popup}
        onHide={() => setPopup(false)}
        plot={movieinfo?.Plot}
        img={
          movieinfo?.Poster && movieinfo.Poster !== 'N/A'
            ? movieinfo.Poster
            : posternotfound
        }
      />
    </>
  );
}

export default App;

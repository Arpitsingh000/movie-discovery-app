import React, { useState, useEffect } from 'react';
import { getPopularMovies, getTopRatedMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './HomePage.css';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [popularData, topRatedData] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies()
        ]);
        
        setPopularMovies(popularData.results);
        setTopRatedMovies(topRatedData.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1>Discover Amazing Movies</h1>
          <p>Explore the latest and greatest films from around the world</p>
        </div>
      </div>
      
      <div className="container">
        <section className="movie-section">
          <h2 className="section-title">Popular Movies</h2>
          <div className="movie-grid">
            {popularMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        <section className="movie-section">
          <h2 className="section-title">Top Rated Movies</h2>
          <div className="movie-grid">
            {topRatedMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
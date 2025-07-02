import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../services/tmdbApi';
import LoadingSpinner from '../components/LoadingSpinner';
import './MovieDetailsPage.css';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-container"><div className="error-message">{error}</div></div>;
  if (!movie) return <div className="error-container"><div className="error-message">Movie not found</div></div>;

  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image+Available';

  // Format currency with commas
  const formatCurrency = (amount) => {
    return amount ? `$${amount.toLocaleString()}` : 'N/A';
  };

  return (
    <div className="movie-details-page">
      {backdropPath && (
        <div className="backdrop-container">
          <div 
            className="backdrop" 
            style={{ backgroundImage: `url(${backdropPath})` }}
          ></div>
        </div>
      )}
      
      <div className="container">
        <button className="back-button" onClick={handleGoBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        
        <div className="movie-details-content">
          <div className="movie-poster-container">
            <img src={posterPath} alt={movie.title} className="movie-poster" />
          </div>
          
          <div className="movie-info">
            <h1>{movie.title} 
              {movie.release_date && (
                <span className="year">({new Date(movie.release_date).getFullYear()})</span>
              )}
            </h1>
            
            <div className="movie-meta">
              <div className="rating">{movie.vote_average.toFixed(1)}</div>
              {movie.runtime > 0 && <span className="runtime">{movie.runtime} min</span>}
              {movie.release_date && (
                <span className="release-date">{new Date(movie.release_date).toLocaleDateString()}</span>
              )}
            </div>
            
            <div className="genres">
              {movie.genres.map(genre => (
                <span key={genre.id} className="genre">{genre.name}</span>
              ))}
            </div>
            
            {movie.tagline && <div className="tagline">"{movie.tagline}"</div>}
            
            <div className="overview">
              <h3>Overview</h3>
              <p>{movie.overview || 'No overview available.'}</p>
            </div>
            
            <div className="additional-info">
              <div className="info-item">
                <h4>Status</h4>
                <p>{movie.status || 'N/A'}</p>
              </div>
              
              <div className="info-item">
                <h4>Budget</h4>
                <p>{formatCurrency(movie.budget)}</p>
              </div>
              
              <div className="info-item">
                <h4>Revenue</h4>
                <p>{formatCurrency(movie.revenue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;
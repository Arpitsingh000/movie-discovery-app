import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Image+Available';

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };


  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'Unknown';

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-poster-wrapper">
        <img src={posterPath} alt={movie.title} className="movie-poster" loading="lazy" />
        <div className="movie-rating">
          <span>★</span> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{releaseYear}</p>
      </div>
    </div>
  );
};


export default memo(MovieCard);
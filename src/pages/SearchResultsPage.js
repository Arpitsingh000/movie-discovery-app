import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbApi';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await searchMovies(query, page);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch search results. Please try again later.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  
    if (query) {
      setPage(1);
    }
  }, [query, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  if (!query) return (
    <div className="container">
      <div className="empty-state">
        <h2>Search for Movies</h2>
        <p>Enter a search term in the search box above to find movies</p>
      </div>
    </div>
  );
  
  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="search-results-page">
      <div className="container">
        <h2 className="page-title">Search Results for "{query}"</h2>
        <p className="results-count">{totalResults} movies found</p>
        
        {movies.length === 0 ? (
          <div className="empty-state">
            <h3>No movies found</h3>
            <p>Try a different search term or check your spelling</p>
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="pagination-button"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                  <span>Previous</span>
                </button>
                
                <div className="page-info">
                  <span className="current-page">{page}</span>
                  <span className="total-pages">of {totalPages}</span>
                </div>
                
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-button"
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
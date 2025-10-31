import React, { useState, useEffect } from "react";
import "./styles.css";

const API_KEY = "ff9a3655cd618452b6400e4a2a3e1d91";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    fetchMovies(page);
  }, [page, query, sortOption]);

  async function fetchMovies(pageNum = 1) {
    let apiURL;

    if (query.trim() !== "") {
      apiURL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        query
      )}&page=${pageNum}`;
    } else {
      apiURL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${pageNum}`;
    }

    try {
      const res = await fetch(apiURL);
      const data = await res.json();
      let results = data.results || [];
      setTotalPages(data.total_pages || 1);

      // Sorting logic
      if (sortOption === "release_desc")
        results.sort((a, b) => (b.release_date > a.release_date ? 1 : -1));
      else if (sortOption === "release_asc")
        results.sort((a, b) => (a.release_date > b.release_date ? 1 : -1));
      else if (sortOption === "rating_desc")
        results.sort((a, b) => b.vote_average - a.vote_average);
      else if (sortOption === "rating_asc")
        results.sort((a, b) => a.vote_average - b.vote_average);

      setMovies(results.slice(0, 16));
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  }

  const handleSearch = () => {
    setPage(1);
    fetchMovies(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <header>
        <h1>Movie Explorer</h1>
      </header>

      {/* 🔍 Search + Sort Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>Search</button>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="release_desc">Release Date (Newest → Oldest)</option>
          <option value="release_asc">Release Date (Oldest → Newest)</option>
          <option value="rating_desc">Rating (Highest → Lowest)</option>
          <option value="rating_asc">Rating (Lowest → Highest)</option>
        </select>
      </div>

      {/* 🎬 Movie Grid */}
      <div className="box-container">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="box" key={movie.id}>
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={movie.title}
              />
              <p>
                <strong>{movie.title}</strong>
              </p>
              <p>
                ⭐ {movie.vote_average || "N/A"} | 📅{" "}
                {movie.release_date || "Unknown"}
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            No results found.
          </p>
        )}
      </div>

      {/* 📄 Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1}>
          ⬅ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

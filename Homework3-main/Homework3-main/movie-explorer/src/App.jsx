import { useEffect, useMemo, useState } from "react";
import "./styles.css";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

// ✅ Directly include your TMDb API key here
const TMDB_API_KEY = "ff9a3655cd618452b6400e4a2a3e1d91";

export default function App() {
  const [apiKey] = useState(TMDB_API_KEY);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [pendingInput, setPendingInput] = useState("");
  const [sortBy, setSortBy] = useState(""); // release_desc | release_asc | rating_desc | rating_asc | ""

  const pageSize = 16;

  const apiURL = useMemo(() => {
    return query.trim() !== ""
      ? `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=${currentPage}`
      : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${currentPage}`;
  }, [apiKey, query, currentPage]);

  useEffect(() => {
    if (!apiKey) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiURL);
        const data = await res.json();
        if (cancelled) return;

        const results = Array.isArray(data?.results) ? data.results : [];
        setTotalPages(data?.total_pages || 1);
        setMovies(results.slice(0, pageSize)); // keep a 4x4 grid
      } catch (e) {
        console.error("Error fetching movies:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [apiKey, apiURL]);

  const sortedMovies = useMemo(() => {
    const m = [...movies];
    switch (sortBy) {
      case "release_desc":
        m.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
        break;
      case "release_asc":
        m.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
        break;
      case "rating_desc":
        m.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
        break;
      case "rating_asc":
        m.sort((a, b) => (a.vote_average ?? 0) - (b.vote_average ?? 0));
        break;
      default:
        break;
    }
    return m;
  }, [movies, sortBy]);

  const handleSearch = () => {
    setQuery(pendingInput.trim());
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <div>
      <header>
        <h1>Movie Explorer</h1>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={pendingInput}
          onChange={(e) => setPendingInput(e.target.value)}
          onKeyDown={handleKeyPress}
          id="search-input"
        />
        <button id="search-btn" onClick={handleSearch}>
          Search
        </button>

        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="release_desc">Release Date (Newest → Oldest)</option>
          <option value="release_asc">Release Date (Oldest → Newest)</option>
          <option value="rating_desc">Rating (Highest → Lowest)</option>
          <option value="rating_asc">Rating (Lowest → Highest)</option>
        </select>
      </div>

      <div className="box-container" id="movies-container">
        {sortedMovies.length === 0 ? (
          <p style={{ textAlign: "center", fontWeight: "bold", width: "100%" }}>
            No results found.
          </p>
        ) : (
          sortedMovies.map((movie) => {
            const poster = movie.poster_path
              ? `${TMDB_IMG}${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image";
            return (
              <div className="box" key={`${movie.id}-${poster}`}>
                <img src={poster} alt={movie.title} />
                <p>
                  <strong>{movie.title}</strong>
                </p>
                <p>
                  Rating {movie.vote_average?.toFixed?.(1) ?? "N/A"} | Release date{" "}
                  {movie.release_date || "N/A"}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div className="pagination" id="pagination">
        <button id="prev-btn" onClick={goPrev} disabled={currentPage <= 1}>
          ⬅ Prev
        </button>
        <span id="page-info">
          Page {totalPages ? currentPage : 0} {totalPages ? `of ${totalPages}` : ""}
        </span>
        <button id="next-btn" onClick={goNext} disabled={currentPage >= totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
}

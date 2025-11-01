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
      cancelled = tr

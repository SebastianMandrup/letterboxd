import { Route, Routes } from "react-router-dom";
import IndexPage from './pages/Index';
import MoviesPage from './pages/Movies';
import MoviesBrowsePage from './pages/MoviesBrowsePage';
import SearchPage from './pages/SearchPage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/search/:query" element={<SearchPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/browse" element={<MoviesBrowsePage />} />
        </Routes>
    );
}
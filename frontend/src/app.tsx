import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/Index';
import MoviesPage from './pages/MoviesPage';
import MoviesBrowsePage from './pages/MoviesBrowsePage';
import MoviePage from './pages/MoviePage';
import { useRestoreUser } from './hooks/useRestoreUser';
import ListsPage from './pages/ListsPage';
import Layout from './Layout';

export default function App() {
  useRestoreUser();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/movies/browse" element={<MoviesBrowsePage />} />
        <Route path="/movie/:title" element={<MoviePage />} />
        <Route path="/lists" element={<ListsPage />} />
      </Route>
    </Routes>
  );
}

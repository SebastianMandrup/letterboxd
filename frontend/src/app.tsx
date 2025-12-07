import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/Index';
import MoviesPage from './pages/MoviesPage';
import MoviesBrowsePage from './pages/MoviesBrowsePage';
import MoviePage from './pages/MoviePage';
import ListsPage from './pages/ListsPage';
import Layout from './Layout';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';
import ListPage from './pages/ListPage';
import { useRestoreUser } from './hooks/useRestoreUser';

export default function App() {
    useRestoreUser();

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<IndexPage />} />
                <Route path="/lists" element={<ListsPage />} />
                <Route path="/lists/:name" element={<ListPage />} />
                <Route path="/movie/:title" element={<MoviePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/browse" element={<MoviesBrowsePage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/user/:username" element={<UserPage />} />
            </Route>
        </Routes>
    );
}

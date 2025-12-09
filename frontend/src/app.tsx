import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/Index';
import MoviesPage from './pages/movies/MoviesPage';
import MoviesBrowsePage from './pages/movies-browse/MoviesBrowsePage';
import MoviePage from './pages/movie/MoviePage';
import ListsPage from './pages/lists/ListsPage';
import Layout from './Layout';
import UsersPage from './pages/users/UsersPage';
import UserPage from './pages/user/UserPage';
import ListPage from './pages/list/ListPage';
import { useRestoreUser } from './hooks/useRestoreUser';
import CreateListPage from './pages/create-list/CreateListPage';
import AuthLayout from './AuthLayout';

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
                <Route element={<AuthLayout />}>
                    <Route path="/lists/new" element={<CreateListPage />} />
                </Route>
            </Route>
        </Routes>
    );
}

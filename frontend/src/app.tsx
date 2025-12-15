import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/index/Index';
import MoviesPage from './pages/movies/MoviesPage';
import MoviesBrowsePage from './pages/movies-browse/MoviesBrowsePage';
import MoviePage from './pages/movie/MoviePage';
import ListsPage from './pages/lists/ListsPage';
import Layout from './Layout';
import UsersPage from './pages/users/UsersPage';
import UserPage from './pages/user/UserPage';
import ListPage from './pages/list/ListPage';
import { useRestoreUser } from './hooks/auth/useRestoreUser';
import CreateListPage from './pages/create-list/CreateListPage';
import AuthLayout from './AuthLayout';
import NotFoundPage from './pages/not-found/NotFoundPage';

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
                {/* Catch-all route for 404 pages */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

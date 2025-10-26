import { Route, Routes } from "react-router-dom";
import IndexPage from './pages';
import FilmsPage from './pages/Films';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/films" element={<FilmsPage />} />
        </Routes>
    );
}
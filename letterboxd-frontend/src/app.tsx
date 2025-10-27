import { Route, Routes } from "react-router-dom";
import FilmsPage from './pages/Films';
import IndexPage from './pages/Index';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/films" element={<FilmsPage />} />
        </Routes>
    );
}
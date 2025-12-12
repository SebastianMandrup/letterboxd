import { Outlet } from 'react-router-dom';
import Header from './pages/shared/header/Header';
import Footer from './pages/shared/footer/Footer';

export default function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

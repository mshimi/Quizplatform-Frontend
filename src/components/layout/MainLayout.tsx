import { Outlet } from 'react-router-dom';
import Header from './Header';
import AppBar from './AppBar';

const MainLayout = () => {
    return (
        <div className="min-h-screen w-full ">
            <Header />
            <AppBar />
            <main>
                {/* Hier werden die spezifischen Seiteninhalte (Dashboard, etc.) gerendert */}
                <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;

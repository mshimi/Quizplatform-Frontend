import { Outlet } from 'react-router-dom';
import Header from './Header';
import AppBar from './AppBar';
import Footer from "./Footer.tsx";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen w-full bg-gray-50 ">
            <Header />
            <AppBar />
            <main className={"flex-grow"}>
                {/* Hier werden die spezifischen Seiteninhalte (Dashboard, etc.) gerendert */}
                <div className="max-w-screen-xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

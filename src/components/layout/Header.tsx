import { useAuth } from '../../hooks/useAuth';

// --- Icon-Komponenten ---
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


const Header = () => {
    const { logout } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20 w-full">
            {/* Dieser innere div zentriert und beschränkt den Inhalt */}
            <div className="max-w-screen-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo und Titel */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <p className="font-bold text-white text-xl">IU</p>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">IU Quiz-Plattform</h1>
                            <p className="text-xs text-gray-500">Kollaborativer Lern-Hub</p>
                        </div>
                    </div>


                    <div className="flex items-center space-x-5 text-gray-500">
                        <button className="hover:text-indigo-600 transition-colors">
                            <BellIcon />
                        </button>
                        <button className="hover:text-indigo-600 transition-colors">
                            <UserCircleIcon />
                        </button>
                        <button onClick={logout} className="hover:text-indigo-600 transition-colors" title="Ausloggen">
                            <LogoutIcon />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// --- Icon-Komponenten (Icons are now smaller for the dropdown) ---
const BellIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const UserCircleIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = ({ className = "h-6 w-6" }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


const Header = () => {
    const { logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-20 w-full">
            <div className="max-w-screen-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Title (unchanged) */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <p className="font-bold text-white text-xl">IU</p>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">IU Quiz-Plattform</h1>
                            <p className="text-xs text-gray-500">Kollaborativer Lern-Hub</p>
                        </div>
                    </div>

                    {/* --- Desktop Icons --- */}
                    <div className="hidden md:flex items-center space-x-5 text-gray-500">
                        <button className="hover:text-indigo-600 transition-colors">
                            <BellIcon />
                        </button>
                        <Link to="/profile" className="hover:text-indigo-600 transition-colors" title="Profil">
                            <UserCircleIcon />
                        </Link>
                        <button onClick={logout} className="hover:text-indigo-600 transition-colors" title="Ausloggen">
                            <LogoutIcon />
                        </button>
                    </div>

                    {/* --- Mobile Icons --- */}
                    <div className="flex md:hidden items-center space-x-4 text-gray-500">
                        <button className="hover:text-indigo-600 transition-colors">
                            <BellIcon />
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button onClick={() => setIsDropdownOpen(prev => !prev)} className="hover:text-indigo-600 transition-colors">
                                <UserCircleIcon />
                            </button>

                            {/* Redesigned Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 ring-1 ring-black ring-opacity-5 origin-top-right
                                               transition ease-out duration-100 transform opacity-100 scale-100"
                                >
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <UserCircleIcon className="h-5 w-5" />
                                        <span>Profil</span>
                                    </Link>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <LogoutIcon className="h-5 w-5" />
                                        <span>Ausloggen</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
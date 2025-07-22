// components/layout/Navbar.tsx
import { NavLink, Link } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated: boolean;
    username?: string;
    onLogout: () => void;
}

const Navbar = ({ isAuthenticated, username, onLogout }: NavbarProps) => {
    // Style for active NavLink
    const activeLinkStyle = {
        color: '#4f46e5', // indigo-600
        textDecoration: 'underline',
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo or Brand Name */}
                    <div className="flex-shrink-0">
                        <Link to={isAuthenticated ? "/dashboard" : "/login"} className="text-2xl font-bold text-indigo-600">
                            QuizApp
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {isAuthenticated ? (
                                <>
                                    <NavLink
                                        to="/dashboard"
                                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </NavLink>
                                    <NavLink
                                        to="/quiz"
                                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        New Quiz
                                    </NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Info and Logout Button */}
                    <div className="hidden md:block">
                        {isAuthenticated && (
                            <div className="ml-4 flex items-center md:ml-6">
                <span className="text-gray-700 mr-4">
                  Welcome, {username}!
                </span>
                                <button
                                    onClick={onLogout}
                                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Mobile menu button can be added here if needed */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

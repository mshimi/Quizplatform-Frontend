import { NavLink } from 'react-router-dom';

// --- Icon-Komponenten ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
// Fügen Sie hier bei Bedarf weitere Icons hinzu

const navLinks = [
    { to: "/", text: "Dashboard", icon: <DashboardIcon /> },

    { to: "/explore-modules", text: "Explore Modules", icon: <CollectionIcon /> },
    { to: "/quizes", text: "Quizes", icon: <PlayIcon /> },
];

const AppBar = () => {
    const activeStyle = {
        backgroundColor: '#4338ca', // indigo-700
        color: 'white',
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-10">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ">
                <div className="flex items-center space-x-2 h-14">
                    {navLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            style={({ isActive }) => (isActive ? activeStyle : undefined)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                            {link.icon}
                            <span>{link.text}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default AppBar;

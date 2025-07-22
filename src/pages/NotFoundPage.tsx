// pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
            <div className="bg-white px-2 text-sm rounded rotate-12 absolute">
                Page Not Found
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-800 md:text-3xl">
                    Oops! You've found a page that doesn't exist.
                </p>
                <p className="mt-2 text-gray-500">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>
            <Link
                to="/"
                className="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors"
            >
                Go to Dashboard
            </Link>
        </div>
    );
};

export default NotFoundPage;

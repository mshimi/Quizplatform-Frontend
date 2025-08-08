
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 w-full">
            <div className="max-w-screen-2xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
                    <p className="text-sm text-gray-500">
                        &copy; {currentYear} IUHB Quiz Platform. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                        <Link to="/privacy-policy" className="text-gray-500 hover:text-indigo-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <Link to="/terms-of-service" className="text-gray-500 hover:text-indigo-600 transition-colors">
                            Terms of Service
                        </Link>
                        <Link to="/contact" className="text-gray-500 hover:text-indigo-600 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

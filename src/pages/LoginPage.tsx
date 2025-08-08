import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AuthenticationRequest } from '../types';
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
    const [credentials, setCredentials] = useState<AuthenticationRequest>({ email: '', password: '' });
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(credentials);
    };

    return (
        <div className="min-h-screen  flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full -mt-30">
                <div className="text-center">
                    <div className="inline-block bg-indigo-600 p-3 rounded-xl mb-4">
                        <p className="font-bold text-white text-3xl">IU</p>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Anmelden bei Ihrem Konto
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Oder <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">erstellen Sie ein neues Konto</Link>
                    </p>
                </div>
            </div>
            <div className="max-w-md w-full mx-auto mt-8 bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
                            E-Mail-Adresse
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="ihr.name@iubh.de"
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
                                Passwort
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Passwort vergessen?
                            </Link>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Anmelden
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

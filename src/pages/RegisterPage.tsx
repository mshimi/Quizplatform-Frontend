import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterRequest } from '../types';
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        firstName: '',
        name: '', // Entspricht lastName
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password.length < 6) {
            setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
            return;
        }
        register(formData);
    };

    return (
        <div className="min-h-screen  flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full -mt-30">
                <div className="text-center">
                    <div className="inline-block bg-indigo-600 p-3 rounded-xl mb-4">
                        <p className="font-bold text-white text-3xl">IU</p>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        Erstellen Sie Ihr Konto
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Oder <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">melden Sie sich bei Ihrem Konto an</Link>
                    </p>
                </div>
            </div>
            <div className="max-w-md w-full mx-auto mt-8 bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="text-sm font-bold text-gray-600 block">Vorname</label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Nachname</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">E-Mail-Adresse</label>
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
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Passwort</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
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
                            Konto erstellen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;

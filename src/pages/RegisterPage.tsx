// pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { RegisterRequest } from '../types';
import {useAuth} from "../hooks/useAuth.ts";

const RegisterPage = () => {
    // State to hold form data, matching the backend DTO (firstName, name)
    const [formData, setFormData] = useState<RegisterRequest>({
        firstName: '',
        name: '', // Corresponds to lastName
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        // Basic validation
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        // The register function is called from the AuthContext
        register(formData);
    };

    return (
        <div className="min-h-screen  flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <div className="text-center">
                    {/* You can replace this with an SVG logo */}
                    <h1 className="text-4xl font-bold text-indigo-600">QuizApp</h1>
                    <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                </div>
            </div>
            <div className="max-w-md w-full mx-auto mt-8 bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="text-sm font-bold text-gray-600 block">First Name</label>
                            <input
                                id="firstName"
                                name="firstName" // Matches state and DTO
                                type="text"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Last Name</label>
                            <input
                                id="name"
                                name="name" // Matches state and DTO
                                type="text"
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Password</label>
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
                            Sign Up
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already a member?{' '}
                    <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

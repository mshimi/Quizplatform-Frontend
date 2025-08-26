import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfile } from '../hooks/useUserMutations';
import SpinnerIcon from '../common/icons/SpinnerIcon';

const ProfilePage = () => {
    const { user } = useAuth();
    const updateProfileMutation = useUpdateProfile();
    const [formData, setFormData] = useState({
        firstName: '',
        name: '',
    });

    // When the user data is loaded, populate the form
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                name: user.name,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(formData);
    };

    if (!user) {
        return <div>Lade Benutzerdaten...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Profil bearbeiten</h1>
                <p className="text-gray-500 mb-6">Aktualisieren Sie hier Ihre Kontoinformationen.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-bold text-gray-600 block">E-Mail-Adresse</label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            disabled
                            className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="firstName" className="text-sm font-bold text-gray-600 block">Vorname</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="text-sm font-bold text-gray-600 block">Nachname</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="flex items-center justify-center gap-2 w-48 h-11 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400"
                        >
                            {updateProfileMutation.isPending ? <SpinnerIcon /> : 'Änderungen speichern'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
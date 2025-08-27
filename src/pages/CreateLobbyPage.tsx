import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCreateLobby } from '../hooks/useLobbyQueries.ts';
import { getAllModulesAsSummary } from '../service/moduleService';
import type { ModuleSummary } from '../types';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import { Link } from 'react-router-dom';

const CreateLobbyPage = () => {
    // --- FIX: Initialize state to a more descriptive default ---
    const [selectedModule, setSelectedModule] = useState<string>('default');
    const createLobbyMutation = useCreateLobby();

    const { data: modules, isLoading } = useQuery({
        queryKey: ['moduleSummary'],
        queryFn: getAllModulesAsSummary,
    });

    const handleSubmit =  (e: React.FormEvent) => {
        e.preventDefault();
        // The check can now be simplified. The `required` attribute will prevent submission
        // if the value is still "default".
        if (selectedModule && selectedModule !== 'default') {
             createLobbyMutation.mutate(selectedModule);
        } else {
            console.error("No module was selected.");
            // Optionally, show an error message to the user here.
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit}>
                    <div className="pb-6 border-b">
                        <h1 className="text-3xl font-bold text-gray-800">Neue Lobby erstellen</h1>
                        <p className="mt-2 text-gray-600">Wähle ein Modul aus, um ein Quiz gegen andere zu starten.</p>
                    </div>
                    <div className="py-6">
                        <label htmlFor="module-select" className="text-sm font-bold text-gray-600 block mb-2">
                            Modul
                        </label>
                        {isLoading ? (
                            <div className="w-full p-2 border rounded-md bg-gray-200 animate-pulse h-10"></div>
                        ) : (
                            <select
                                id="module-select"
                                value={selectedModule}
                                onChange={(e) => setSelectedModule(e.target.value)}
                                className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            >
                                {/* --- FIX: Use a consistent value for the disabled option --- */}
                                <option value="default" disabled>Bitte auswählen...</option>
                                {modules?.map((module: ModuleSummary) => (
                                    <option key={module.id} value={module.id}>
                                        {module.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex justify-end items-center pt-6 border-t">
                        <Link to="/quizzes" className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50 shadow-sm">
                            Abbrechen
                        </Link>
                        <button
                            type="submit"
                            disabled={createLobbyMutation.isPending || selectedModule === 'default'}
                            className="ml-3 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 shadow-sm"
                        >
                            {createLobbyMutation.isPending ? <SpinnerIcon /> : 'Lobby erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLobbyPage;
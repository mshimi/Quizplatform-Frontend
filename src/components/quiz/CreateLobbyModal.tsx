
import { useQuery } from '@tanstack/react-query';
import { useCreateLobby } from '../../hooks/useLobbyQueries';
import { getAllModulesAsSummary } from '../../service/moduleService';
import type { ModuleSummary } from '../../types';
import SpinnerIcon from '../../common/icons/SpinnerIcon';
import { useNavigate } from 'react-router-dom';
import React from "react"; // --- ADD THIS IMPORT ---

interface CreateLobbyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLobbyModal = ({ isOpen, onClose }: CreateLobbyModalProps) => {
    const [selectedModule, setSelectedModule] = React.useState<string>('');
    const createLobbyMutation = useCreateLobby();
    const navigate = useNavigate(); // --- ADD THIS HOOK ---

    const { data: modules, isLoading } = useQuery({
        queryKey: ['moduleSummary'],
        queryFn: getAllModulesAsSummary,
        enabled: isOpen, // Only fetch when the modal is open
    });

    // --- THIS IS THE FIX ---
    // The submit handler is now an async function.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedModule) {
            try {
                // Use mutateAsync to wait for the mutation to complete.
                const newLobby = await createLobbyMutation.mutateAsync(selectedModule);
                // On success, navigate to the new lobby's page.
                navigate(`/lobbies/${newLobby.id}`);
                onClose(); // Close the modal after successful navigation.
            } catch (error) {
                // You can add more specific error handling here if needed
                console.error("Failed to create lobby:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Neue Lobby erstellen</h2>
                    </div>
                    <div className="p-6">
                        <label htmlFor="module-select" className="text-sm font-bold text-gray-600 block mb-2">
                            Wähle ein Modul
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
                                <option value="" disabled>Bitte auswählen...</option>
                                {modules?.map((module: ModuleSummary) => (
                                    <option key={module.id} value={module.id}>
                                        {module.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex justify-end items-center p-6 bg-gray-50">
                        <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50 shadow-sm">
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={createLobbyMutation.isPending || !selectedModule}
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

export default CreateLobbyModal;
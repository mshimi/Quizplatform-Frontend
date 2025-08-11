import  { useState } from 'react';
import AddQuestionModal from '../question/AddQuestionModal';
import { useCreateQuestion } from '../../hooks/useQuestionMutations'; // 1. Import the new hook
import type { CreateQuestionRequest } from '../../types';

interface ContributeQuestionButtonProps {
    moduleId: string;
}

const ContributeQuestionButton = ({ moduleId }: ContributeQuestionButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const createQuestionMutation = useCreateQuestion(); // 2. Use the hook

    const handleFormSubmit = (formData: CreateQuestionRequest) => {
        // 3. Call the mutation with the module ID and form data
        createQuestionMutation.mutate(
            { moduleId, questionData: formData },
            {
                // 4. On success, close the modal
                onSuccess: () => {
                    setIsModalOpen(false);
                },
            }
        );
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="h-12 px-4 flex items-center justify-center gap-2 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 whitespace-nowrap"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <span>Frage beisteuern</span>
            </button>

            <AddQuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
              //  moduleId={moduleId}
                // 5. Pass the loading state to the modal to disable buttons during submission
                isSubmitting={createQuestionMutation.isPending}
            />
        </>
    );
};

export default ContributeQuestionButton;
import React, { useState, useEffect } from 'react';

// --- Type Definitions ---
interface AnswerInput {
    id: number; // Temporary ID for mapping
    text: string;
    isCorrect: boolean;
}

interface AddQuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { questionText: string; answers: Omit<AnswerInput, 'id'>[] }) => void;

    isSubmitting: boolean;
}

// --- Main Component ---
const AddQuestionModal = ({ isOpen, onClose, onSubmit }: AddQuestionModalProps) => {
    // --- State Management ---
    const [questionText, setQuestionText] = useState('');
    const [answers, setAnswers] = useState<AnswerInput[]>([
        { id: 1, text: '', isCorrect: true },
        { id: 2, text: '', isCorrect: false },
    ]);
    const [error, setError] = useState<string | null>(null);

 //   console.log(moduleId);

    useEffect(() => {
        if (isOpen) {
            setQuestionText('');
            setAnswers([
                { id: 1, text: '', isCorrect: true },
                { id: 2, text: '', isCorrect: false },
            ]);
            setError(null);
        }
    }, [isOpen]);

    // --- Event Handlers ---
    const handleAnswerTextChange = (id: number, text: string) => {
        setAnswers(answers.map(a => (a.id === id ? { ...a, text } : a)));
    };

    const handleCorrectAnswerChange = (id: number) => {
        setAnswers(answers.map(a => ({ ...a, isCorrect: a.id === id })));
    };

    const addAnswer = () => {
        setAnswers([...answers, { id: Date.now(), text: '', isCorrect: false }]);
    };

    const removeAnswer = (id: number) => {
        if (answers.length > 2) {
            setAnswers(answers.filter(a => a.id !== id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!questionText.trim()) {
            setError('Fragentext darf nicht leer sein.');
            return;
        }
        if (answers.some(a => !a.text.trim())) {
            setError('Alle Antwortfelder müssen ausgefüllt sein.');
            return;
        }
        if (!answers.some(a => a.isCorrect)) {
            setError('Es muss mindestens eine korrekte Antwort markiert sein.');
            return;
        }

        // Prepare data for submission (removing temporary ID)
        const submissionData = {
            questionText,
            answers: answers.map(({ text, isCorrect }) => ({ text, isCorrect })),
        };
        onSubmit(submissionData);
    };


    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl m-4 relative max-h-[90vh] flex flex-col">
                {/* --- Modal Header --- */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Neue Frage beisteuern</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* --- Modal Body & Form --- */}
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    {error && <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">{error}</div>}

                    {/* Question Text Input */}
                    <div className="mb-6">
                        <label htmlFor="questionText" className="text-sm font-bold text-gray-600 block mb-2">Fragentext</label>
                        <textarea
                            id="questionText"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Wie lautet die Frage?"
                        />
                    </div>

                    {/* Dynamic Answers Section */}
                    <div className="space-y-4">
                        {answers.map((answer, index) => (
                            <div key={answer.id} className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    checked={answer.isCorrect}
                                    onChange={() => handleCorrectAnswerChange(answer.id)}
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                                    placeholder={`Antwort ${index + 1}`}
                                    className="flex-grow px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeAnswer(answer.id)}
                                    className={`text-gray-400 hover:text-red-600 transition ${answers.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={answers.length <= 2}
                                    aria-label="Remove answer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button

                        type="button"
                        onClick={addAnswer}
                        disabled={answers.length >= 4}
                        className={`mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition ${answers.length === 4 ?   'opacity-50 cursor-not-allowed': ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

                        Weitere Antwort hinzufügen
                    </button>
                </form>

                {/* --- Modal Footer --- */}
                <div className="flex justify-end items-center p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        form="add-question-form" // This is a trick to link the button to the form
                        onClick={handleSubmit}
                        className="ml-3 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
                    >
                        Frage speichern
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddQuestionModal;
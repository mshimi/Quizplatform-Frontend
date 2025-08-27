import React from 'react';
import type { Answer } from '../../types';

interface AnswerEditorProps {
    proposedAnswers: Answer[];
    setProposedAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

const AnswerEditor = ({ proposedAnswers, setProposedAnswers }: AnswerEditorProps) => {

    const handleAnswerTextChange = (id: string, text: string) => {
        setProposedAnswers(prev => prev.map(a => (a.id === id ? { ...a, text } : a)));
    };

    const handleCorrectAnswerChange = (id: string) => {
        setProposedAnswers(prev => prev.map(a => ({ ...a, isCorrect: a.id === id })));
    };

    const addAnswer = () => {
        if (proposedAnswers.length < 4) {
            const newAnswer: Answer = {
                id: `new-${Date.now()}`, // Temporary unique ID for a new answer
                text: '',
                isCorrect: false,
                questionId: '', // Not needed on the frontend for this operation
            };
            setProposedAnswers(prev => [...prev, newAnswer]);
        }
    };

    const removeAnswer = (id: string) => {
        if (proposedAnswers.length > 2) {
            setProposedAnswers(prev => {
                const newAnswers = prev.filter(a => a.id !== id);
                // If the removed answer was the correct one, make the first one correct by default
                if (!newAnswers.some(a => a.isCorrect) && newAnswers.length > 0) {
                    newAnswers[0].isCorrect = true;
                }
                return newAnswers;
            });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="font-bold text-gray-600">Korrigierte Antworten</label>
                <p className="text-xs text-gray-500">Mindestens 2, maximal 4 Antworten. Eine Antwort muss als korrekt markiert sein.</p>
            </div>

            <div className="space-y-3">
                {proposedAnswers.map((answer) => (
                    <div key={answer.id} className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="correctAnswer"
                            checked={answer.isCorrect}
                            onChange={() => handleCorrectAnswerChange(answer.id)}
                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 flex-shrink-0"
                        />
                        <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                            placeholder="Antworttext eingeben"
                            className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => removeAnswer(answer.id)}
                            disabled={proposedAnswers.length <= 2}
                            className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Antwort entfernen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addAnswer}
                disabled={proposedAnswers.length >= 4}
                className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Antwort hinzufügen
            </button>
        </div>
    );
};

export default AnswerEditor;
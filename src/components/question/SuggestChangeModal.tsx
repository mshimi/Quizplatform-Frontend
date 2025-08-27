import React, { useState, useEffect } from 'react';
import type { Answer, ChoiceQuestion, CreateChangeRequest } from '../../types';
import { useAddChangeRequest } from '../../hooks/useQuestionChangeQueries';
import SpinnerIcon from '../../common/icons/SpinnerIcon';
import AnswerEditor from './AnswerEditor'; // Import the new component

// Defines the types of suggestions this modal can handle
type SuggestionType = 'INCORRECT_QUESTION_TEXT' | 'INCORRECT_ANSWER';

interface SuggestChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: ChoiceQuestion;
}

const SuggestChangeModal = ({ isOpen, onClose, question }: SuggestChangeModalProps) => {
    const [subType, setSubType] = useState<SuggestionType>('INCORRECT_QUESTION_TEXT');
    const [justification, setJustification] = useState('');
    const [proposedText, setProposedText] = useState('');
    const [proposedAnswers, setProposedAnswers] = useState<Answer[]>([]);
    const [error, setError] = useState<string | null>(null);

    const addChangeRequestMutation = useAddChangeRequest();

    // Effect to reset the modal's state whenever it's opened
    useEffect(() => {
        if (isOpen) {
            setSubType('INCORRECT_QUESTION_TEXT');
            setJustification('');
            setProposedText(question.questionText);
            // Create a deep copy of answers to prevent direct state mutation
            setProposedAnswers(JSON.parse(JSON.stringify(question.answers)));
            setError(null);
        }
    }, [isOpen, question]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // --- VALIDATION LOGIC ---
        if (!justification.trim()) {
            setError('Eine Begründung ist erforderlich.');
            return;
        }

        if (subType === 'INCORRECT_ANSWER') {
            if (proposedAnswers.some(a => !a.text.trim())) {
                setError('Alle Antwortfelder müssen ausgefüllt sein.');
                return;
            }
            if (!proposedAnswers.some(a => a.isCorrect)) {
                setError('Es muss mindestens eine korrekte Antwort markiert sein.');
                return;
            }
        }
        // --- END VALIDATION ---

        const payload: CreateChangeRequest = {
            type: subType,
            justification,
        };

        if (subType === 'INCORRECT_QUESTION_TEXT') {
            payload.newQuestionText = proposedText;
        } else if (subType === 'INCORRECT_ANSWER') {
            // Map the proposed answers, removing the temporary 'id' for new answers
            payload.newAnswers = proposedAnswers.map(({ text, isCorrect }) => ({
                text,
                isCorrect,
            }));
        }

        addChangeRequestMutation.mutate({ questionId: question.id, requestDto: payload }, {
            onSuccess: () => onClose(),
            onError: (err) => setError(err.message || 'Ein Fehler ist aufgetreten.'),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl m-4 relative max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Änderung vorschlagen</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

                    <div className="mb-6">
                        <label className="font-bold block mb-2">Art des Vorschlags</label>
                        <select value={subType} onChange={(e) => setSubType(e.target.value as SuggestionType)} className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="INCORRECT_QUESTION_TEXT">Fragentext korrigieren</option>
                            <option value="INCORRECT_ANSWER">Antworten korrigieren</option>
                        </select>
                    </div>

                    {subType === 'INCORRECT_QUESTION_TEXT' && (
                        <div className="mb-6">
                            <label className="font-bold text-gray-600">Korrigierter Fragentext</label>
                            <textarea value={proposedText} onChange={(e) => setProposedText(e.target.value)} rows={3} className="w-full p-2 border rounded-md mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    )}

                    {subType === 'INCORRECT_ANSWER' && (
                        <div className="mb-6">
                            <AnswerEditor
                                proposedAnswers={proposedAnswers}
                                setProposedAnswers={setProposedAnswers}
                            />
                        </div>
                    )}

                    <div>
                        <label className="font-bold text-gray-600">Begründung</label>
                        <textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} className="w-full p-2 border rounded-md mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                </form>
                <div className="flex justify-end items-center p-6 border-t bg-gray-50 mt-auto">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50 shadow-sm">Abbrechen</button>
                    <button type="submit" onClick={handleSubmit} disabled={addChangeRequestMutation.isPending} className="ml-3 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 shadow-sm">
                        {addChangeRequestMutation.isPending ? <SpinnerIcon /> : 'Vorschlag einreichen'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuggestChangeModal;
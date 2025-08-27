import React, { useState, useEffect } from 'react';
import type { ChoiceQuestion, CreateChangeRequest } from '../../types';
import { useAddChangeRequest } from '../../hooks/useQuestionChangeQueries';
import SpinnerIcon from '../../common/icons/SpinnerIcon';

// Defines the types of reports this modal can handle
type ReportType = 'SUGGEST_DELETION' | 'DUPLICATE_QUESTION';

interface ReportProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    question: ChoiceQuestion;
}

const ReportProblemModal = ({ isOpen, onClose, question }: ReportProblemModalProps) => {
    const [subType, setSubType] = useState<ReportType>('SUGGEST_DELETION');
    const [justification, setJustification] = useState('');
    const [duplicateId, setDuplicateId] = useState('');
    const [error, setError] = useState<string | null>(null);

    const addChangeRequestMutation = useAddChangeRequest();

    // Effect to reset the modal's state whenever it's opened
    useEffect(() => {
        if (isOpen) {
            setSubType('SUGGEST_DELETION');
            setJustification('');
            setDuplicateId('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!justification.trim()) {
            setError('Eine Begründung ist erforderlich.');
            return;
        }

        const payload: CreateChangeRequest = {
            type: subType,
            justification,
        };

        if (subType === 'DUPLICATE_QUESTION') {
            if (!duplicateId.trim()) {
                setError('Die ID der doppelten Frage ist erforderlich.');
                return;
            }
            payload.duplicateQuestionId = duplicateId;
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
                    <h2 className="text-2xl font-bold text-gray-800">Problem melden</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}

                    <div className="mb-4">
                        <label className="font-bold block mb-2">Art des Problems</label>
                        <select value={subType} onChange={(e) => setSubType(e.target.value as ReportType)} className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="SUGGEST_DELETION">Löschung vorschlagen</option>
                            <option value="DUPLICATE_QUESTION">Duplikat melden</option>
                        </select>
                    </div>

                    {subType === 'DUPLICATE_QUESTION' && (
                        <div>
                            <label className="font-bold text-gray-600">ID der doppelten Frage</label>
                            <input type="text" value={duplicateId} onChange={(e) => setDuplicateId(e.target.value)} placeholder="Fragen-ID hier einfügen" className="w-full p-2 border rounded-md mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="font-bold text-gray-600">Begründung</label>
                        <textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3} className="w-full p-2 border rounded-md mt-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                    </div>
                </form>
                <div className="flex justify-end items-center p-6 border-t bg-gray-50">
                    <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-semibold text-gray-700 bg-white border rounded-md hover:bg-gray-50 shadow-sm">Abbrechen</button>
                    <button type="submit" onClick={handleSubmit} disabled={addChangeRequestMutation.isPending} className="ml-3 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 shadow-sm">
                        {addChangeRequestMutation.isPending ? <SpinnerIcon /> : 'Problem melden'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportProblemModal;

interface ChangeRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionId: string;
}

// A placeholder icon component
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ChangeRequestModal = ({ isOpen, onClose, questionId }: ChangeRequestModalProps) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-8 m-4 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    aria-label="Close modal"
                >
                    <CloseIcon />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Änderungsvorschläge</h2>
                <p className="text-gray-600 mb-6">
                    Hier sehen Sie alle Vorschläge zur Verbesserung dieser Frage (ID: {questionId}).
                </p>
                {/* TODO: Implement the detailed view of change requests here */}
                <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">Detaillierte Ansicht der Vorschläge wird hier implementiert.</p>
                </div>
            </div>
        </div>
    );
};

export default ChangeRequestModal;
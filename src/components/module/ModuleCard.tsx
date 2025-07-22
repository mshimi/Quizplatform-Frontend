import BookOpenIcon from "../../common/icons/BookOpenIcon.tsx";
import UsersIcon from "../../common/icons/UsersIcon.tsx";
import StarIcon from "../../common/icons/StarIcon.tsx";
import type {ModuleListItem} from "../../types";
import SpinnerIcon from "../../common/icons/SpinnerIcon.tsx";

interface ModuleCardProps {
    module: ModuleListItem;
    onToggleFollow: (moduleId: string) => void;
    isToggling:boolean
}


// --- Die Hauptkomponente ModuleCard ---
const ModuleCard = ({ module, onToggleFollow, isToggling }: ModuleCardProps) => {
    // Der Zustand der Karte wird nun direkt von den übergeordneten Props gesteuert.
    // Das macht die Komponente vorhersehbarer und einfacher mit TanStack Query zu verwalten.
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out overflow-hidden flex flex-col group">
            {/* Karten-Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800 leading-tight pr-4">{module.title}</h3>
                <button
                    onClick={() => onToggleFollow(module.id)}
                    disabled={isToggling} // Button deaktivieren während des Ladens
                    className={`flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-full transition-all duration-300 w-28 h-9 ${
                        isToggling
                            ? 'bg-teal-500 cursor-not-allowed'
                            : module.isFollowed
                                ? 'bg-teal-500 text-white shadow-md hover:bg-teal-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {isToggling ? (
                        <SpinnerIcon />
                    ) : (
                        <>
                            <StarIcon className="w-4 h-4" />
                            {module.isFollowed ? 'Gefolgt' : 'Folgen'}
                        </>
                    )}
                </button>
            </div>

            {/* Karten-Körper */}
            <div className="p-6 flex-grow">
                <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>
            </div>

            {/* Karten-Fußzeile */}
            <div className="px-6 pt-4 pb-6 mt-auto bg-gray-50/75">
                {/* Metadaten */}
                <div className="flex items-center justify-start text-sm text-gray-500 space-x-6 mb-6">
                    <div className="flex items-center gap-2" title={`${module.numberOfQuestions} Fragen in diesem Modul`}>
                        <BookOpenIcon className="w-5 h-5 text-gray-400" />
                        <span>{module.numberOfQuestions} Fragen</span>
                    </div>
                    <div className="flex items-center gap-2" title={`${module.likeCount} Follower`}>
                        <UsersIcon className="w-5 h-5 text-gray-400" />
                        <span>{module.likeCount} Follower</span>
                    </div>
                </div>

                {/* Aktions-Buttons */}
                <div className="flex items-center space-x-4">
                    <button className="flex-1 text-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-transform transform hover:scale-105">
                        Quiz starten
                    </button>
                    <button className="flex-1 text-center bg-white text-indigo-600 font-semibold py-3 px-4 rounded-lg border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 transition-colors">
                        Mehr Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModuleCard;
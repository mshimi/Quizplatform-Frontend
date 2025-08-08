// src/components/module/ModuleListItem.tsx

import type { ModuleListItem as ModuleListItemType } from '../../types';
import BookOpenIcon from '../../common/icons/BookOpenIcon';
import UsersIcon from '../../common/icons/UsersIcon';
import StarIcon from '../../common/icons/StarIcon';
import SpinnerIcon from '../../common/icons/SpinnerIcon';

interface ModuleListItemProps {
    module: ModuleListItemType;
    onToggleFollow: (moduleId: string) => void;
    isToggling: boolean;
}

const ModuleListItem = ({ module, onToggleFollow, isToggling }: ModuleListItemProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex items-center p-4 gap-4">
        <div className="flex-grow">
        <h3 className="font-bold text-lg text-gray-800">{module.title}</h3>
            <p className="text-sm text-gray-500 truncate">{module.description}</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600 flex-shrink-0">
    <div className="flex items-center gap-2" title={`${module.numberOfQuestions} Fragen`}>
    <BookOpenIcon className="w-5 h-5 text-gray-400" />
        <span>{module.numberOfQuestions}</span>
        </div>
        <div className="flex items-center gap-2" title={`${module.likeCount} Follower`}>
    <UsersIcon className="w-5 h-5 text-gray-400" />
        <span>{module.likeCount}</span>
        </div>
        </div>

        <div className="w-32 flex-shrink-0">
    <button
        onClick={() => onToggleFollow(module.id)}
    disabled={isToggling}
    className={`flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-full transition-all w-full h-9 ${
        isToggling
            ? 'bg-teal-500 cursor-not-allowed'
            : module.isFollowed
                ? 'bg-teal-500 text-white hover:bg-teal-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
>
    {isToggling ? <SpinnerIcon /> : (
        <>
            <StarIcon className="w-4 h-4" />
            {module.isFollowed ? 'Gefolgt' : 'Folgen'}
            </>
    )}
    </button>
    </div>
    </div>
);
};

export default ModuleListItem;

// You should also create a corresponding ModuleListItemSkeleton component for loading states.

const ModuleCardSkeleton = () => {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
            {/* Card Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-grow space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>

            {/* Card Footer */}
            <div className="px-6 pt-4 pb-6 mt-auto bg-gray-50/75">
                {/* Metadata */}
                <div className="flex items-center justify-start space-x-6 mb-6">
                    <div className="h-5 w-28 bg-gray-200 rounded"></div>
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                    <div className="h-12 flex-1 bg-gray-300 rounded-lg"></div>
                    <div className="h-12 flex-1 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default ModuleCardSkeleton;

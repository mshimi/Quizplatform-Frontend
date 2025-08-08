const QuizHistorySkeleton = () => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div>
                <div className="h-5 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div className="text-right">
            <div className="h-6 w-12 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
        </div>
    </div>
);
export default QuizHistorySkeleton;
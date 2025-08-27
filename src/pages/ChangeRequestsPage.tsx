import { useState, useEffect } from 'react';
import { useChangeRequestsForFollowedModules } from '../hooks/useQuestionChangeQueries';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import PaginationControls from '../common/pagination/PaginationControls';
import ChangeRequestCardSummary from '../components/question/ChangeRequestCardSummary';
import ChangeRequestCardDetails from '../components/question/ChangeRequestCardDetails';
import type { QuestionChangeRequest, ChangeRequestStatus } from '../types';
//import QuestionCard from '../components/question/QuestionCard';

// Define the filter options for the tabs
const filterOptions: { label: string; value: ChangeRequestStatus }[] = [
    { label: 'Offen', value: 'PENDING' },
    { label: 'Angenommen', value: 'APPROVED' },
    { label: 'Abgelehnt', value: 'REJECTED' },
];

const ChangeRequestsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    // State for the status filter, defaulting to 'PENDING'
    const [statusFilter, setStatusFilter] = useState<ChangeRequestStatus>('PENDING');
    // Pass the statusFilter to the hook
    const { data, isLoading, isError, isFetching } = useChangeRequestsForFollowedModules(currentPage, 15, statusFilter);
    const [selectedRequest, setSelectedRequest] = useState<QuestionChangeRequest | null>(null);

    // Effect to select the first request in the list when data loads or filter changes
    useEffect(() => {
        if (data?.content && data.content.length > 0) {
            if (!selectedRequest || !data.content.find(r => r.id === selectedRequest.id)) {
                setSelectedRequest(data.content[0]);
            }
        } else {
            setSelectedRequest(null);
        }
    }, [data, selectedRequest]);

    // Handler to change the filter and reset pagination
    const handleFilterChange = (status: ChangeRequestStatus) => {
        setCurrentPage(0);
        setStatusFilter(status);
    };

    const renderList = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center py-20"><SpinnerIcon /></div>;
        }
        if (isError) {
            return <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">Vorschläge konnten nicht geladen werden.</div>;
        }
        if (!data || data.content.length === 0) {
            return <div className="text-center p-4 bg-blue-50 text-blue-700 rounded-lg">Keine Vorschläge für diesen Status gefunden.</div>;
        }
        return (
            <div className="space-y-2">
                {data.content.map(request => (
                    <ChangeRequestCardSummary
                        key={request.id}
                        request={request}
                        isSelected={selectedRequest?.id === request.id}
                        onClick={() => setSelectedRequest(request)}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Änderungsvorschläge</h1>
                    <p className="text-lg text-gray-500 mt-2">Bewerte Vorschläge aus deinen gefolgten Modulen.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: List of Requests */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                            {/* Filter Tabs */}
                            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg mb-4">
                                {filterOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleFilterChange(option.value)}
                                        className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-all ${
                                            statusFilter === option.value ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                            {renderList()}
                            {data && data.totalPages > 1 && (
                                <PaginationControls
                                    currentPage={currentPage}
                                    totalPages={data.totalPages}
                                    onPageChange={setCurrentPage}
                                    isFetching={isFetching}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Column: Detailed View */}
                    <div className="lg:col-span-2">
                        {selectedRequest ? (
                            <div className="space-y-8">

                                <ChangeRequestCardDetails request={selectedRequest} />
                            </div>
                        ) : (
                            !isLoading && <div className="flex items-center justify-center h-full bg-white rounded-xl shadow-lg border border-gray-200 p-6"><p className="text-gray-500">Wähle einen Vorschlag aus der Liste aus, um die Details anzuzeigen.</p></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeRequestsPage;

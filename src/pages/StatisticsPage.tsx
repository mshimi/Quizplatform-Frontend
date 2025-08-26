import {useState} from 'react';

import StatCard from '../components/statistics/StatCard';
import ModuleStatRow from '../components/statistics/ModuleStatRow';
import SpinnerIcon from '../common/icons/SpinnerIcon';
import ActivityChart from "../components/statistics/ActivityChart.tsx";
import {useStatistics} from "../hooks/useStatisticsQueries.ts";

// --- Icon Components for Cards ---
const CheckBadgeIcon = () => <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
</svg>;
const TrophyIcon = () => <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
</svg>;
const ClipboardListIcon = () => <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
</svg>;
const QuestionMarkCircleIcon = () => <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
                                          stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
</svg>;

const timeFilters = ['Gesamt', 'Heute', 'Letzte Woche', 'Letzter Monat'];
const scopeFilters = ['Allgemein', 'Nach Modul'];

const StatisticsPage = () => {
    const [timeFilter, setTimeFilter] = useState('Gesamt');
    const [scopeFilter, setScopeFilter] = useState('Allgemein');

    const {data: stats, isLoading} = useStatistics(timeFilter);


    return (
        <div className="space-y-8">
            {/* --- Page Header --- */}
            <div>
                <h1 className="text-4xl font-bold text-slate-900">Deine Lernstatistik</h1>
                <p className="mt-2 text-lg text-slate-600">Ein Überblick über deinen Fortschritt und deine
                    Leistungen.</p>
            </div>

            {/* --- Filter Controls --- */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200 space-y-4">
                {/* Timeframe Filter */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                    {timeFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-all ${
                                timeFilter === filter ? 'bg-indigo-600 text-white shadow' : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                {/* Scope Filter */}
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
                    {scopeFilters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setScopeFilter(filter)}
                            className={`flex-1 px-3 py-2 text-sm font-bold rounded-md transition-all ${
                                scopeFilter === filter ? 'bg-white text-indigo-600 shadow' : 'text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Content Area --- */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <SpinnerIcon/>
                </div>
            ) : !stats ? (
                <div className="text-center py-10 bg-white rounded-lg">Keine Daten verfügbar.</div>
            ) : (
                <div className="transition-opacity">
                    {scopeFilter === 'Allgemein' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Durchschnittsnote" value={`${stats.overall.averageScore}%`}
                                          icon={<TrophyIcon/>} colorClass="bg-amber-500"/>
                                <StatCard title="Abgeschlossene Quiz" value={stats.overall.quizzesCompleted}
                                          icon={<ClipboardListIcon/>} colorClass="bg-indigo-500"/>
                                <StatCard title="Fragen beantwortet" value={stats.overall.totalQuestionsAnswered}
                                          icon={<QuestionMarkCircleIcon/>} colorClass="bg-sky-500"/>
                                <StatCard title="Richtige Antworten" value={`${stats.overall.correctAnswerRatio}%`}
                                          icon={<CheckBadgeIcon/>} colorClass="bg-teal-500"/>
                            </div>
                            <div className={"my-12"}>
                                <h2 className="text-2xl font-bold text-slate-800 mb-4 ">Deine Aktivität</h2>
                                <ActivityChart data={stats.activity}/>
                            </div>
                        </>
                    )}

                    {scopeFilter === 'Nach Modul' && (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 text-left text-sm font-semibold text-slate-600">Modul</th>
                                    <th className="p-4 text-center text-sm font-semibold text-slate-600">Gespielte
                                        Quiz
                                    </th>
                                    <th className="p-4 text-center text-sm font-semibold text-slate-600">Ø Note</th>
                                    <th className="p-4 text-center text-sm font-semibold text-slate-600">Richtige /
                                        Gesamt
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {stats.byModule.map(moduleStat => (
                                    <ModuleStatRow key={moduleStat.moduleId} moduleStat={moduleStat}/>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatisticsPage;
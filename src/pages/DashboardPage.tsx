import { useAuth } from '../hooks/useAuth';
import FollowedModulesSection from '../components/module/FollowedModulesSection';
import QuizHistorySection from "../components/quiz/QuizHistorySection.tsx";

// --- Icon-Komponenten ---
const LearnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
const CollaborateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CompeteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;

const WelcomeBanner = ({ name }: {name:string}) => (
    <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-lg mb-12">
        <h1 className="text-4xl font-bold">Willkommen zurück, {name}!</h1>
        <p className="mt-2 text-indigo-200 max-w-2xl">Bereit, dein Wissen zu erweitern? Entdecke Module, fordere Freunde heraus und trage zu unserer kollaborativen Lerngemeinschaft bei.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-indigo-700/50 p-4 rounded-lg flex items-center gap-4">
                <LearnIcon />
                <div>
                    <h3 className="font-bold">Lernen</h3>
                    <p className="text-sm text-indigo-200">Übe mit Quizfragen</p>
                </div>
            </div>
            <div className="bg-indigo-700/50 p-4 rounded-lg flex items-center gap-4">
                <CollaborateIcon />
                <div>
                    <h3 className="font-bold">Kollaborieren</h3>
                    <p className="text-sm text-indigo-200">Erstelle & bewerte Inhalte</p>
                </div>
            </div>
            <div className="bg-indigo-700/50 p-4 rounded-lg flex items-center gap-4">
                <CompeteIcon />
                <div>
                    <h3 className="font-bold">Messen</h3>
                    <p className="text-sm text-indigo-200">Fordere andere Studierende heraus</p>
                </div>
            </div>
        </div>
    </div>
);


const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div>
            <WelcomeBanner name={user?.firstName || 'Student'} />
            <FollowedModulesSection />
            <QuizHistorySection/>

            {/* Hier können Sie weitere Dashboard-Sektionen hinzufügen */}
        </div>
    );
};

export default DashboardPage;

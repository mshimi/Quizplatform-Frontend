// routes/AppRouter.tsx
import {BrowserRouter, Route, Routes} from 'react-router-dom';

// Layout Components
import ProtectedRoute from '../components/layout/ProtectedRoute';
import PublicRoute from '../components/layout/PublicRoute';
// Page Components
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import {useAuth} from "../hooks/useAuth.ts";
import MainLayout from "../components/layout/MainLayout.tsx";
import ExploreModulesPage from "../pages/ExploreModulesPage.tsx";
import ModuleDetailPage from "../pages/ModuleDetailPage.tsx";
import ComponentDiagramm from "../pages/ComponenetDiagram.tsx";
import QuizPage from "../pages/QuizPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import StatisticsPage from "../pages/StatisticsPage.tsx";
import ChangeRequestsPage from "../pages/ChangeRequestsPage.tsx";
import QuizLobbyPage from "../pages/QuizLobbyPage.tsx";
import QuizLobbiesPage from "../pages/QuizLobbiesPage.tsx";
import CreateLobbyPage from "../pages/CreateLobbyPage.tsx";
// Context

const AppRouter = () => {
    const {isLoading} = useAuth();

    // To prevent flicker, we can wait until the initial auth check is done.
    if (isLoading) {
        return <div>Loading Application...</div>; // Or a full-page spinner
    }

    return (
        <BrowserRouter>
            {/* Navbar is outside the Routes to be persistent */}


            <main className="">
                <Routes>
                    {/* == PUBLIC ROUTES == */}
                    {/* Only accessible to unauthenticated users. */}
                    {/* Authenticated users will be redirected to "/" */}
                    <Route element={<PublicRoute/>}>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/register" element={<RegisterPage/>}/>
                        <Route path="/components" element={<ComponentDiagramm/>}/>
                    </Route>

                    {/* Geschützte Routen, die das neue MainLayout verwenden */}
                    <Route element={<ProtectedRoute/>}>
                        <Route element={<MainLayout/>}>
                            <Route path="/" element={<DashboardPage/>}/>
                            <Route path="/explore-modules" element={<ExploreModulesPage/>}/>
                            <Route path="/modules/:moduleId" element={<ModuleDetailPage />} />
                            <Route path="/quizzes/:quizId" element={<QuizPage />} />
                            <Route path="/quizzes" element={<QuizLobbiesPage />} />
                            <Route path="/lobbies/create" element={<CreateLobbyPage />} /> {/* --- ADD THIS --- */}
                            <Route path="/lobbies/:lobbyId" element={<QuizLobbyPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/statistics" element={<StatisticsPage />} />
                            <Route path="/change-requests" element={<ChangeRequestsPage />} /> {/* Add this new route */}

                        </Route>
                    </Route>
                    {/* == NOT FOUND == */}
                    {/* Catch-all route for any other path */}
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default AppRouter;

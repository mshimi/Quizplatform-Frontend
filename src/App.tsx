
import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./context/AuthContext.tsx";
import AppRouter from "./routes/AppRouter.tsx";


const queryClient = new QueryClient();


function App() {
    return (
        <div >
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </QueryClientProvider>
        </div>
    );
}

export default App

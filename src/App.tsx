import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {AuthProvider} from "./context/AuthContext.tsx";
import AppRouter from "./routes/AppRouter.tsx";
import {WebSocketProvider} from "./context/WebSocketContext.tsx";


const queryClient = new QueryClient();


function App() {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <WebSocketProvider>
                    <AuthProvider>
                        <AppRouter/>
                    </AuthProvider>
                </WebSocketProvider>

            </QueryClientProvider>
        </div>
    );
}

export default App

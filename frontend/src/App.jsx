import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// A temporary placeholder for Home/Dashboard
const DashboardPlaceholder = () => (
    <div className="card text-center p-12">
        <h2 className="text-2xl font-bold mb-4">Dashboard Coming Soon</h2>
        <p>You are successfully authenticated!</p>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-background">
                    <Toaster position="top-right" />
                    <main className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold text-primary-600 mb-8 text-center">Decision Ledger System</h1>

                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPlaceholder />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>

                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

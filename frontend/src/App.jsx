import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { DecisionList } from './pages/DecisionList';
import { DecisionDetail } from './pages/DecisionDetail';
import { DecisionForm } from './pages/DecisionForm';
import { UserManagement } from './pages/UserManagement';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

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
                            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/decisions" element={<DecisionList />} />
                                <Route path="/decisions/new" element={<DecisionForm />} />
                                <Route path="/decisions/:id" element={<DecisionDetail />} />
                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute allowedRoles={['Admin']}>
                                            <UserManagement />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        </Routes>

                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

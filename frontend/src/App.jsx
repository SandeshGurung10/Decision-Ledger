import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
                <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes — inside MainLayout */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
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

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;

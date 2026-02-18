import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { DecisionList } from './pages/DecisionList';
import { DecisionDetail } from './pages/DecisionDetail';
import { DecisionForm } from './pages/DecisionForm';
import { UserManagement } from './pages/UserManagement';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProfilePage } from './pages/ProfilePage';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" richColors expand={false} />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Core Shell */}
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
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Admin Restricted Route */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

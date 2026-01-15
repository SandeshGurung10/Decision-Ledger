import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background">
                <Toaster position="top-right" />
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-primary-600">Decision Ledger System</h1>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;

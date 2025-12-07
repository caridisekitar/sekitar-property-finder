
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ConfirmOTPPage from './pages/ConfirmOTPPage';
import CariKosPage from './pages/CariKosPage';
import MapsPage from './pages/MapsPage';
import WishlistPage from './pages/WishlistPage';
import KalkulatorBudgetPage from './pages/KalkulatorBudgetPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname.startsWith('/login') ||
                             location.pathname === '/confirm-otp' ||
                             location.pathname === '/register';

    return (
        <div className="bg-white text-brand-dark">
            {!hideHeaderFooter && <Header />}
            <main className={hideHeaderFooter ? '' : 'min-h-screen'}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/confirm-otp" element={<ConfirmOTPPage />} />
                    <Route path="/cari-kost" element={<CariKosPage />} />
                    <Route path="/maps" element={<MapsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/kalkulator-budget" element={<KalkulatorBudgetPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
  );
};

export default App;

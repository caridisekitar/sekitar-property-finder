
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CariKosPage from './pages/CariKosPage';
import MapsPage from './pages/MapsPage';
import WishlistPage from './pages/WishlistPage';
import KalkulatorBudgetPage from './pages/KalkulatorBudgetPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/profile/FavoritesPage';
import SubscriptionsPage from './pages/profile/SubscriptionsPage';
import ContributionsPage from './pages/profile/ContributionsPage';
import LatestPage from './pages/profile/LatestPage';
import DaftarkanBisnismu from "./pages/DaftarkanBisnismu";
import KostDetailPage from './pages/kost/KostDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ScrollToTop from "@/components/ScrollToTop";
import UpgradePlanPage from './pages/profile/UpgradePlanPage';
import CallbackPage from '@/pages/CallbackPage';
import FAQPage from '@/pages/FAQPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicy';
import PaymentSuccess from "@/pages/PaymentSuccess";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import RegisterKos from './pages/RegisterKos';

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname.startsWith('/login') ||
                             location.pathname === '/reset-password' ||
                             location.pathname === '/register';

    return (
        <div className="bg-white">
            {!hideHeaderFooter && <Header />}
            <main className={hideHeaderFooter ? '' : 'md:min-h-[600px] lg:min-h-[600px]'}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/cari-kost" element={<CariKosPage />} />
                    <Route path="/maps" element={<MapsPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/kalkulator-budget" element={<KalkulatorBudgetPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/favorites" element={<FavoritesPage />} />
                    <Route path="/profile/subscriptions" element={<SubscriptionsPage />} />
                    <Route path="/profile/contributions" element={<ContributionsPage />} />
                    <Route path="/profile/latest" element={<LatestPage />} />
                    <Route path="/profile/upgrade" element={<UpgradePlanPage />} />
                    <Route path="/daftar-bisnis" element={<DaftarkanBisnismu />} />
                    <Route path="/daftar-kos" element={<RegisterKos />} />
                    <Route path="/kost/:slug" element={<KostDetailPage />} />
                    <Route path="/callback" element={<CallbackPage />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
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
        <ScrollToTop />
        <AppContent />
    </BrowserRouter>
  );
};

export default App;

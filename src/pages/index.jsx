import Layout from "./Layout.jsx";
import Home from "./Home";
import Funnel1 from "./funnel-1";
import FunnelAff from "./funnel-aff";
import FunnelEspNew from "./funnel-esp";
import FunnelTrialVSL from "./funnel-trialvsl";
import FunnelStar2 from "./funnel-star2";
import FunnelStar3 from "./funnel-star3";
import FunnelStar4 from "./funnel-star4";
import FunnelStar5 from "./funnel-star5";
import Checkout from "./Checkout";
import AdminLogin from "./AdminLogin";
import Analytics from "./Analytics";
import AnalyticsAB from "./AnalyticsAB";
import FileManager from "./FileManager";
import Dashboard from "./admin/dashboard/Dashboard";
import FunnelsList from "./admin/funnels/FunnelsList";
import FunnelEditor from "./admin/funnels/FunnelEditor";
import ABTestsManager from "./admin/ab-tests/ABTestsManager";
import Settings from "./admin/settings/Settings";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

const PAGES = {
    Home: Home,
    "funnel-1": Funnel1,
    "funnel-aff": FunnelAff,
    "funnel-esp": FunnelEspNew,
    "funnel-trialvsl": FunnelTrialVSL,
    "funnel-star2": FunnelStar2,
    "funnel-star3": FunnelStar3,
    "funnel-star4": FunnelStar4,
    "funnel-star5": FunnelStar5,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/analytics');
    const isCheckoutRoute = location.pathname.startsWith('/checkout');

    if (isCheckoutRoute) {
        return (
            <Routes>
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
        );
    }

    if (isAdminRoute) {
        return (
            <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/funnels" element={<ProtectedRoute><FunnelsList /></ProtectedRoute>} />
                <Route path="/admin/funnels/:id/edit" element={<ProtectedRoute><FunnelEditor /></ProtectedRoute>} />
                <Route path="/admin/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/admin/ab-tests" element={<ProtectedRoute><ABTestsManager /></ProtectedRoute>} />
                <Route path="/admin/files" element={<ProtectedRoute><FileManager /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/analytics-ab" element={<ProtectedRoute><AnalyticsAB /></ProtectedRoute>} />
            </Routes>
        );
    }

    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/funnel-1" element={<Funnel1 />} />
                <Route path="/funnel-aff" element={<FunnelAff />} />
                <Route path="/funnel-esp" element={<FunnelEspNew />} />
                <Route path="/funnel-trialvsl" element={<FunnelTrialVSL />} />
                <Route path="/funnel-star2" element={<FunnelStar2 />} />
                <Route path="/funnel-star3" element={<FunnelStar3 />} />
                <Route path="/funnel-star4" element={<FunnelStar4 />} />
                <Route path="/funnel-star5" element={<FunnelStar5 />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <AdminAuthProvider>
                <PagesContent />
            </AdminAuthProvider>
        </Router>
    );
}
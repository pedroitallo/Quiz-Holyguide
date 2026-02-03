import Layout from "./Layout.jsx";
import Home from "./Home";
import Funnel1 from "./funnel-1";
import FunnelAff from "./funnel-aff";
import FunnelEspNew from "./funnel-esp";
import Funnel2 from "./funnel-2";
import Funnel21 from "./funnel-2.1";
import Funnel22 from "./funnel-2.2";
import Funnel23 from "./funnel-2.3";
import Funnel2Aff from "./funnel-2aff";
import Funnel3 from "./funnel-3";
import FunnelVsl1 from "./funnel-vsl1";
import FunnelVsl2 from "./funnel-vsl2";
import FnShortVsl1 from "./fnshort-vsl1";
import FunnelAff2 from "./funnel-aff2";
import Funnel2Esp from "./funnel2-esp";
import PaywallSms from "./paywall-sms";
import FnGads from "./fn-gads";
import Fn1Dsv from "./fn1-dsv";
import Fn1Org from "./fn1-org";
import Fn2SmFb from "./fn2-sm-fb";
import FunnelGads2 from "./funnel-gads2";
import FnShorts2 from "./fn-shorts2";
import Fn2Tiktok from "./fn2-tiktok";
import Checkout from "./Checkout";
import AdminLogin from "./AdminLogin";
import Analytics from "./Analytics";
import AnalyticsAB from "./AnalyticsAB";
import FileManager from "./FileManager";
import Dashboard from "./admin/dashboard/Dashboard";
import FunnelsList from "./admin/funnels/FunnelsList";
import FunnelEditor from "./admin/funnels/FunnelEditorNew";
import FunnelDetail from "./admin/funnels/FunnelDetail";
import QuizBuilder from "./admin/funnels/QuizBuilder";
import OfferDetail from "./admin/offers/OfferDetail";
import ABTestsManager from "./admin/ab-tests/ABTestsManager";
import Settings from "./admin/settings/Settings";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

const PAGES = {
    Home: Home,
    "funnel-1": Funnel1,
    "funnel-2": Funnel2,
    "funnel-2.1": Funnel21,
    "funnel-2.2": Funnel22,
    "funnel-2.3": Funnel23,
    "funnel-2aff": Funnel2Aff,
    "funnel-3": Funnel3,
    "funnel-vsl1": FunnelVsl1,
    "funnel-vsl2": FunnelVsl2,
    "fnshort-vsl1": FnShortVsl1,
    "funnel-aff": FunnelAff,
    "funnel-aff2": FunnelAff2,
    "funnel2-esp": Funnel2Esp,
    "funnel-esp": FunnelEspNew,
    "paywall-sms": PaywallSms,
    "fn-gads": FnGads,
    "fn1-dsv": Fn1Dsv,
    "fn1-org": Fn1Org,
    "fn2-sm-fb": Fn2SmFb,
    "funnel-gads2": FunnelGads2,
    "fn-shorts2": FnShorts2,
    "fn2-tiktok": Fn2Tiktok,
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
                <Route path="/admin/funnels/:id" element={<ProtectedRoute><FunnelDetail /></ProtectedRoute>} />
                <Route path="/admin/funnels/:id/edit" element={<ProtectedRoute><FunnelEditor /></ProtectedRoute>} />
                <Route path="/admin/funnels/:id/builder" element={<ProtectedRoute><QuizBuilder /></ProtectedRoute>} />
                <Route path="/admin/offers/:id" element={<ProtectedRoute><OfferDetail /></ProtectedRoute>} />
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
                <Route path="/funnel-2" element={<Funnel2 />} />
                <Route path="/funnel-2.1" element={<Funnel21 />} />
                <Route path="/funnel-2.2" element={<Funnel22 />} />
                <Route path="/funnel-2.3" element={<Funnel23 />} />
                <Route path="/funnel-2aff" element={<Funnel2Aff />} />
                <Route path="/funnel-3" element={<Funnel3 />} />
                <Route path="/funnel-vsl1" element={<FunnelVsl1 />} />
                <Route path="/funnel-vsl2" element={<FunnelVsl2 />} />
                <Route path="/fnshort-vsl1" element={<FnShortVsl1 />} />
                <Route path="/funnel-aff" element={<FunnelAff />} />
                <Route path="/funnel-aff2" element={<FunnelAff2 />} />
                <Route path="/funnel2-esp" element={<Funnel2Esp />} />
                <Route path="/funnel-esp" element={<FunnelEspNew />} />
                <Route path="/paywall-sms" element={<PaywallSms />} />
                <Route path="/fn-gads" element={<FnGads />} />
                <Route path="/fn1-dsv" element={<Fn1Dsv />} />
                <Route path="/fn1-org" element={<Fn1Org />} />
                <Route path="/fn2-sm-fb" element={<Fn2SmFb />} />
                <Route path="/funnel-gads2" element={<FunnelGads2 />} />
                <Route path="/fn-shorts2" element={<FnShorts2 />} />
                <Route path="/fn2-tiktok" element={<Fn2Tiktok />} />
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
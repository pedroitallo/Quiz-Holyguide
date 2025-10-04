import Layout from "./Layout.jsx";
import Home from "./Home";
import Funnel1 from "./funnel-1";
import FunnelEsp from "./funnelesp";
import FunnelTt from "./funnel-tt";
import FunnelVsl from "./funnel-vsl";
import FunnelStar2 from "./funnel-star2";
import FunnelStar3 from "./funnel-star3";
import FunnelStar4 from "./funnel-star4";
import FunnelStar5 from "./funnel-star5";
import AdminLogin from "./AdminLogin";
import Analytics from "./Analytics";
import AnalyticsAB from "./AnalyticsAB";
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

const PAGES = {
    Home: Home,
    "funnel-1": Funnel1,
    funnelesp: FunnelEsp,
    "funnel-tt": FunnelTt,
    "funnel-vsl": FunnelVsl,
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

    if (isAdminRoute) {
        return (
            <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Analytics />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics-ab" element={<AnalyticsAB />} />
            </Routes>
        );
    }

    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/funnel-1" element={<Funnel1 />} />
                <Route path="/funnelesp" element={<FunnelEsp />} />
                <Route path="/funnel-tt" element={<FunnelTt />} />
                <Route path="/funnel-vsl" element={<FunnelVsl />} />
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
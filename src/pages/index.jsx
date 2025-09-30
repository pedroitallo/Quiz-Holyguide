import Layout from "./Layout.jsx";
import Home from "./Home";
import Funnel1 from "./funnel-1";
import FunnelEsp from "./funnelesp";
import Up1Soulmate from "./Up1Soulmate";
import Up2Soulmate from "./Up2Soulmate";
import Up3Soulmate from "./Up3Soulmate";
import FunnelTt from "./funnel-tt";
import FunnelVsl from "./funnel-vsl";
import Refund from "./Refund";
import TermsOfService from "./TermsOfService";
import Privacy from "./Privacy";
import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Home: Home,
    "funnel-1": Funnel1,
    funnelesp: FunnelEsp,
    "funnel-tt": FunnelTt,
    "funnel-vsl": FunnelVsl,
    "up1-soulmate": Up1Soulmate,
    "up2-soulmate": lazy(() => import("./Up2Soulmate")),
    "up3-soulmate": Up3Soulmate,
    refund: Refund,
    "terms-of-service": TermsOfService,
    privacy: Privacy,
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

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/funnel-1" element={<Funnel1 />} />
                <Route path="/funnelesp" element={<FunnelEsp />} />
                <Route path="/funnel-tt" element={<FunnelTt />} />
                <Route path="/funnel-vsl" element={<FunnelVsl />} />
                <Route path="/up1-soulmate" element={<Up1Soulmate />} />
                <Route path="/up2-soulmate" element={<Up2Soulmate />} />
                <Route path="/up3-soulmate" element={<Up3Soulmate />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy" element={<Privacy />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}
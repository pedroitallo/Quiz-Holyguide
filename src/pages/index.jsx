import Layout from "./Layout.jsx";

import metrics from "./metrics";

import admin from "./admin";

import quiz from "./quiz";

import Home from "./Home";

import funnel-1 from "./funnel-1";

import funnelesp from "./funnelesp";

import up-letter from "./up-letter";

import up-energy from "./up-energy";

import up-journey from "./up-journey";

import up-combo from "./up-combo";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    metrics: metrics,
    
    admin: admin,
    
    quiz: quiz,
    
    Home: Home,
    
    funnel-1: funnel-1,
    
    funnelesp: funnelesp,
    
    up-letter: up-letter,
    
    up-energy: up-energy,
    
    up-journey: up-journey,
    
    up-combo: up-combo,
    
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
                
                    <Route path="/" element={<metrics />} />
                
                
                <Route path="/metrics" element={<metrics />} />
                
                <Route path="/admin" element={<admin />} />
                
                <Route path="/quiz" element={<quiz />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/funnel-1" element={<funnel-1 />} />
                
                <Route path="/funnelesp" element={<funnelesp />} />
                
                <Route path="/up-letter" element={<up-letter />} />
                
                <Route path="/up-energy" element={<up-energy />} />
                
                <Route path="/up-journey" element={<up-journey />} />
                
                <Route path="/up-combo" element={<up-combo />} />
                
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
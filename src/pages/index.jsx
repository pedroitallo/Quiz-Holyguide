import Layout from "./Layout.jsx";

import metrics from "./metrics";

import admin from "./admin";

import quiz from "./quiz";

import Home from "./Home";

import Funnel1 from "./funnel-1";

import FunnelEsp from "./funnelesp";

import UpLetter from "./up-letter";

import UpEnergy from "./up-energy";

import UpJourney from "./up-journey";

import UpCombo from "./up-combo";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    metrics: metrics,
    
    admin: admin,
    
    quiz: quiz,
    
    Home: Home,
    
    "funnel-1": Funnel1,
    
    funnelesp: FunnelEsp,
    
    "up-letter": UpLetter,
    
    "up-energy": UpEnergy,
    
    "up-journey": UpJourney,
    
    "up-combo": UpCombo,
    
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
                
                <Route path="/funnel-1" element={<Funnel1 />} />
                
                <Route path="/funnelesp" element={<FunnelEsp />} />
                
                <Route path="/up-letter" element={<UpLetter />} />
                
                <Route path="/up-energy" element={<UpEnergy />} />
                
                <Route path="/up-journey" element={<UpJourney />} />
                
                <Route path="/up-combo" element={<UpCombo />} />
                
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
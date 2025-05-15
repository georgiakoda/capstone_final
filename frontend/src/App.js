import './App.css';
import Home from './components/Home';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HowTo from './components/HowTo';
import About from './components/about';
import KeywordHistory from './components/KeywordHistory';
import Results from './components/Results';

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useLocation } from 'react-router-dom';

function AppWrapper({ children }) {
  const location = useLocation();

  // Determine class based on current path
  const backgroundClass = location.pathname === '/' ? 'home-background' : 'smiley-background';

  return <div className={`App ${backgroundClass}`}>{children}</div>;
}


function App() {
  return (
    <Router>
      <AppWrapper>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/howto" element={<HowTo />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<KeywordHistory />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </AppWrapper>
    </Router>
  );
}


export default App;

import './App.css';
import Home from './components/Home';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HowTo from './components/HowTo';
import About from './components/about';
import KeywordHistory from './components/KeywordHistory';
import Results from './components/Results';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <Router>
    <div className="App">
      <NavBar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/howto" element={<HowTo />} />
  <Route path="/about" element={<About />} />
  <Route path="/history" element={<KeywordHistory />} />
  <Route path="/results" element={<Results />} />

</Routes>

    </div>
    </Router>
  );
}

export default App;

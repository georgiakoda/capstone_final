import './App.css';
import SearchBar from './components/SearchBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HowTo from './components/HowTo';
import About from './components/about';
import KeywordHistory from './components/KeywordHistory';
import Results from './components/Results';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const handleSearch = (query) => {
    console.log("searched term: ", query);
  };

  return (
    <Router>
    <div className="App">
      <NavBar />
      <Routes>
  <Route path="/" element={
    <header className="App-header">
      <div className="container my-5">
        <div className="p-5 text-center bg-body-tertiary rounded-3">
          <div className="p-3 p-lg-5 pt-lg-3">
            <h1 className="display-4 fw-bold lh-1 text-body-emphasis">
              Reddit Sentiment Analyzer
            </h1>
            <p className="lead text-dark">
              Enter a keyword below to search for Reddit posts. 
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </header>
  } />

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

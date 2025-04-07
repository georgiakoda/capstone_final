import './App.css';
import SearchBar from './components/SearchBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HowTo from './components/HowTo';
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
          {/* Define the default route for the homepage */}
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

          {/* Define the route for the "How to Use" page */}
          <Route path="/howto" element={<HowTo />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;

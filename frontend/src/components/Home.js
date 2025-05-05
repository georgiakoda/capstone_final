import React from 'react';
import SearchBar from './SearchBar';

function Home() {
  return (
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
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Home;

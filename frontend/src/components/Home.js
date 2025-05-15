import React from 'react';
import SearchBar from './SearchBar';

function Home() {
  return (
    <header className="App-header">
      <div className="overlay">
        <h1 className="display-4 fw-bold lh-1 text-light">
          Sentiment Analysis Tool
        </h1>
        <SearchBar />
      </div>
    </header>
  );
}

export default Home;

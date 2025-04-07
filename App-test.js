import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    fetch('/auth/reddit/status')
      .then((response) => response.json())
      .then((data) => setIsAuthenticated(data.isAuthenticated));
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Main />
      {!isAuthenticated && (
        <a href="/auth/reddit">Log in with Reddit</a>
      )}
      {isAuthenticated && <p>Welcome, user!</p>}
    </div>
  );
};

export default App;

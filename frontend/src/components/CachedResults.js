import React, { useEffect, useState } from 'react';
import CachedResultItem from './CachedResultItem';

function CachedResults() {
  const [cachedResults, setCachedResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/cached-results')
      .then((res) => res.json())
      .then((data) => setCachedResults(data))
      .catch((err) => console.error("Error loading cached results:", err));
  }, []);

  return (
    <div className="container px-4 pt-4 my-4">
      <h2 className="pb-2 border-bottom">All Cached Results</h2>
      {cachedResults.map((item) => (
        <CachedResultItem key={item.query_key} item={item} />
      ))}
    </div>
  );
}

export default CachedResults;

import React, { useEffect, useState } from 'react';
import CachedResultItem from './CachedResultItem';

function CachedResults() {
  const [cachedResults, setCachedResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/cached-results')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCachedResults(data);
        } else {
          console.error("❌ Unexpected response format:", data);
          setCachedResults([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading cached results:", err);
        setCachedResults([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container px-4 pt-4 my-4">
      <h2 className="pb-2 border-bottom">All Cached Results</h2>

      {loading && <p className="text-muted">Loading cached results...</p>}

      {!loading && Array.isArray(cachedResults) && cachedResults.map((item, idx) => {
        if (
          !item ||
          typeof item !== 'object' ||
          !item.data ||
          !Array.isArray(item.data.results)
        ) {
          console.warn(`⛔ Skipping malformed cached result at index ${idx}:`, item);
          return null;
        }

        return <CachedResultItem key={item.query_key} item={item} />;
      })}

    </div>
  );
}

export default CachedResults;

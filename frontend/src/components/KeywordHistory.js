import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KeywordHistory = () => {
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/keywords/')
      .then(res => setKeywords(res.data))
      .catch(err => console.error("Error fetching keywords:", err));
  }, []);

  return (
    <div className="container pt-5 my-4">
      <h2 className="pb-2 border-bottom">🔁 Keyword History</h2>

      {keywords.length === 0 ? (
        <p className="text-muted">No keywords found yet.</p>
      ) : (
        <ul className="list-group">
          {keywords.map((k) => (
            <li key={k._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span className="text-capitalize">{k.query}</span>
              <small className="text-muted">{new Date(k.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KeywordHistory;
//tasks:
//1)capture user input
//2)send user input to backend
//3)handle the response

import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState(""); //to store user input
  const [searchResults, setSearchResults] = useState([]); //to store search results
  const [keywordDetails, setKeywordDetails] = useState(null); // Store keyword and timestamp


  //Handle form submission
  const handleSubmit = async (e) => { //async because need to use await
    e.preventDefault();
    if (query.trim()) { //remove leading and trailing whitespaces
      //send keyword to FastAPI backend for sanitization and storage into DB
      try {
        const response = await fetch("http://localhost:8000/keywords/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        console.log("Keyword added:", result);

        if (result.search_results && result.search_results.length > 0) {
          console.log("Reddit Search Results:", result.search_results);
          setSearchResults(result.search_results);
        } else {
          console.log("No Reddit search results found.");
          setSearchResults([]); //reset if none found
        }

        setQuery("");

        
      } catch (error) {
        console.error("Error submitting keyword:", error);
      }
    }
  };


  return (
    <div> 
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

    {/* Display Keyword Details */}
    {keywordDetails && (
        <div>
          <h3>Keyword Added</h3>
          <p><strong>Keyword:</strong> {keywordDetails.query}</p>
          <p><strong>Timestamp:</strong> {new Date(keywordDetails.created_at).toLocaleString()}</p>
        </div>
      )}

    {/* Display search results */}
      <div>
        <h3>Search Results</h3>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
                <p>{result.selftext}</p>
                <p>Subreddit: {result.subreddit}</p>
                <p>Score: {result.score}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

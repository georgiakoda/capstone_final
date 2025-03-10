//tasks:
//1)capture user input
//2)send user input to backend
//3)handle the response

import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");


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

        // Uses the Reddit API endpoint to search for the entered term
        const redditResponse = await fetch(`http://localhost:8000/search/reddit/?q=${encodeURIComponent(query)}`);
        const redditResult = await redditResponse.json();

        // Right now it just prints the results in the console
        // It takes a few seconds to display the results so don't keep pressing the button if it doesn't show up right away
        console.log("Reddit Search Results:", redditResult.results);
        console.log("Rate Limit Info:", redditResult.rate_limit_info);




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
    </div>
  );
}

export default SearchBar;

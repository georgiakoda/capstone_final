//tasks:
//1)capture user input
//2)send user input to backend
//3)handle the response

import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [sentimentResults, setSentimentResults] = useState(null);

  //new states for optional sorting and subreddit search
  const [subreddit, setSubreddit] = useState(""); // New state for subreddit
  const [sort, setSort] = useState(""); // New state for sorting option


  //Handle form submission
  const handleSubmit = async (e) => { 
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

        await response.json();

        const searchParams = new URLSearchParams({
          q: query,
        });

        if (subreddit.trim()) {
          searchParams.append("subreddit", subreddit);
        }
        if (sort.trim()) {
          searchParams.append("sort", sort);
        }

        const combinedResponse = await fetch(
          `http://localhost:8000/analyze-reddit?${searchParams.toString()}`
        );
        const result = await combinedResponse.json();
        
        //console.log("Reddit Search Results:", result.results);
        console.log("Sentiment Results:", result.sentiment_results);
        
        setSentimentResults(result.sentiment_results);




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
          className="form-control mb-3"
        />
        <div className="d-flex gap-2 mb-3"> 

          <div className="input-group">
            <span className="input-group-text" id="inputGroup-sizing-default">r/</span>
            <input
              type="text"
              placeholder="Subreddit name (optional)"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="form-control flex-grow-1"  
            />
          </div>

          
        
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="form-select w-auto"  
        >
          <option value="">Sort by: </option>
          <option value="relevance">relevance</option>
          <option value="new">new</option>
          <option value="top">top</option>
          <option value="hot">hot</option>
          <option value="comments">comments</option>
        </select>
        <button type="submit" className="btn btn-primary btn-md w-auto">Search</button>
      </div>
      </form>
    </div>
  );
}

export default SearchBar;

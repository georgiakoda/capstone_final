import { useNavigate } from "react-router-dom";

import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [sentimentResults, setSentimentResults] = useState(null);
  const [subreddit, setSubreddit] = useState("");
  const [sort, setSort] = useState("new"); 
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);





  //Handle form submission
  const handleSubmit = async (e) => { 
    e.preventDefault();
    if (query.trim()) { //remove leading and trailing whitespaces
      if (limit < 10 || limit > 700) {
        alert("Please enter a limit between 10 and 700.");
        return;
      }
      //send keyword to FastAPI backend for sanitization and storage into DB
      try {
        const userId = "test-user-id";

        const response = await fetch("http://localhost:8000/keywords/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, user_id:userId }),
        });

        await response.json();

        const searchParams = new URLSearchParams({
          q: query,
          limit: limit.toString(),
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
        //console.log("Sentiment Results:", result.sentiment_results);
        
        setSentimentResults(result.sentiment_results);

        //allows the "results" page to access the search term, subreddit and analysis results
        navigate("/results", { 
          state: { 
            sentimentResults: result.sentiment_results, 
            query: query,
            subreddit: subreddit,
            results: result.results } 
          }
        );

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
          className="form-control mb-3 keyword-input"
        />

        <div className="d-flex gap-2 mb-3 align-items-center" style={{ justifyContent: 'flex-start' }}>

          <div className="input-group subreddit-input-group">
            <span className="input-group-text" id="inputGroup-sizing-default">r/</span>
            <input
              type="text"
              placeholder="Subreddit name (optional)"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              className="form-control subreddit-input"
            />
          </div>

          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="form-select w-auto"  
          >
            <option value="" disabled>Sort by:</option>
            <option value="new">new</option>
            <option value="relevance">relevance</option>
            <option value="top">top</option>
            <option value="hot">hot</option>
            <option value="comments">comments</option>

          </select>

          <input
            type="number"
            min={10}
            max={700}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="form-control limit-input"
            placeholder="Limit"
            style={{ width: "80px" }}
          />

          <button type="submit" className="btn btn-primary btn-md w-auto custom-btn">Search</button>

        </div>

      </form>

    </div>
  );
}

export default SearchBar;

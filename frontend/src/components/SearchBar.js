import React from "react";

function SearchBar() {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;

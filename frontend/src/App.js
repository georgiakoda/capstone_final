import './App.css';
import SearchBar from './components/SearchBar';

function App() {

  const handleSearch = (query) => {
    console.log("searched term: ", query);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1> Sentiment Analysis Tool</h1>
        <h4> Enter a search term below: </h4>
        <SearchBar onSearch={handleSearch} />
        
      </header>
    
      <div>
        
      </div>

    </div>
  );
}

export default App;

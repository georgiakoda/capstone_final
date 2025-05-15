import mongoose from './db.js';

const SearchTermSchema = new mongoose.Schema(
    {
    search_term: String,
    date_added: { type: Date, default: Date.now }
});

const SearchResultSchema = new mongoose.Schema(
    {
    search_term_id: mongoose.Schema.Types.ObjectId,
    search_date: { type: Date, default: Date.now },
    text_data: String,
    sentiment: Object
});

const SearchTerm = mongoose.model('SearchTerm', SearchTermSchema);
const SearchResult = mongoose.model('SearchResult', SearchResultSchema);

export { SearchTerm, SearchResult };

import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const HowTo = () => (
    <div className="container px-4 pt-4 my-4">
        <h2 className="pb-2 border-bottom">User Guide <i className="bi bi-book mx-2"></i></h2>
        
        <div className="row g-4 py-3">
            <div className="col-md-6">
                <div className="card h-100">
                    <div className="card-body">
                        <h3 className="card-title"><i className="bi bi-search mx-2"></i>Searching Keywords</h3>
                        <p className="card-text">
                            Enter any keyword or phrase in the search bar to analyze its sentiment across Reddit posts. 
                            The system will:
                        </p>
                        <ul>
                            <li>Search for relevant Reddit posts containing your keyword</li>
                            <li>Analyze the sentiment of each post</li>
                            <li>Display results with sentiment scores and visualizations</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="card h-100">
                    <div className="card-body">
                        <h3 className="card-title"><i className="bi bi-graph-up mx-2"></i>Understanding Results</h3>
                        <p className="card-text">
                            The sentiment analysis results show:
                        </p>
                        <ul>
                            <li>Overall sentiment score (positive, negative, or neutral)</li>
                            <li>Sentiment distribution across posts</li>
                            <li>Key phrases and their associated sentiments</li>
                            <li>Trend analysis over time</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title"><i className="bi bi-lightbulb mx-2"></i>Tips for Best Results</h3>
                        <ul>
                            <li>Use specific keywords for more accurate results</li>
                            <li>Sort by "new" to get more post results</li>
                            <li>Try different variations of your search term</li>
                            <li>Check the keyword history for previous searches</li>
                            <li>Look for patterns in sentiment across different time periods</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default HowTo;
import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useLocation } from "react-router-dom";

function Results() {
    const location = useLocation();
    const { sentimentResults, query, subreddit, results = [] } = location.state || {};
    const graphRef = useRef(null);
    const [expandedPostIndex, setExpandedPostIndex] = useState(null);

    //this handles the graph display
    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                if (!sentimentResults?.max_emotion_counts) {
                    console.error('No emotion data found');
                    return;
                }

                const response = await fetch("http://localhost:8000/emotion-graph", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        max_emotion_counts: sentimentResults.max_emotion_counts
                    })
                });

                if (!response.ok) {
                    const errorData = await response.text();
                    console.error("Response Error:", errorData);
                    throw new Error('Failed to fetch graph data');
                }

                const emotionData = await response.json();

                const emotionColors = {
                    anger: '#e02525',
                    sadness: '#55a0f1',
                    joy: '#6ee558',
                    disgust: '#9b9b9b',
                    fear: '#fca14b',
                    neutral: '#fce357',
                    surprise: '#bf84f7'
                };

                const emotions = Object.keys(emotionData);
                const colors = emotions.map(emotion => emotionColors[emotion] || 'blue');

                const data = [{
                    x: emotions,
                    y: Object.values(emotionData),
                    type: 'bar',
                    text: Object.values(emotionData),
                    textposition: 'auto',
                    marker: {
                        color: colors
                    }
                }];

                const layout = {
                    title: 'Emotion Counts',
                    xaxis: { title: 'Emotion' },
                    yaxis: { title: 'Count' }
                };

                Plotly.newPlot(graphRef.current, data, layout);
            } catch (error) {
                console.error("Error fetching graph:", error);
            }
        };

        fetchGraphData();
    }, [sentimentResults]);

    if (!sentimentResults) {
        return <p>No sentiment results found. Please run a search first.</p>;
    }

    const emotionCounts = sentimentResults.max_emotion_counts;

    const emotionEmojis = {
        anger: '😡',
        sadness: '😢',
        joy: '😀',
        disgust: '🤢',
        fear: '😨',
        neutral: '😐',
        surprise: '😲'
    };

    //this is for separating the post title from the body so it initially only shows the title
    //and then shows the body if you click the title
    const getPostTitle = (content) => content.split('\n\n')[0];
    const getPostBody = (content) => content.split('\n\n').slice(1).join('\n\n');

    return (
        <div className="container px-4 pt-4 my-4">
            <h2 className="pb-2 border-bottom">
                Search Analysis <i className="bi bi-bar-chart mx-2"></i>
            </h2>

            <h3 className="my-4">Results for "<strong>{query}</strong>" in r/{subreddit || 'all'}:</h3>

            <div ref={graphRef} />
            
            <div className="row mt-4">
                {emotionCounts && (
                <div className="col-md-4" id="emotion-count-display">
                    <h4>Emotion Counts:</h4>
                    <ul className="list-group mb-4">
                        {Object.entries(emotionCounts).map(([emotion, count]) => (
                            <li key={emotion} className="list-group-item">
                                <strong>{emotion} {emotionEmojis[emotion] || ''}:</strong> {count}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {results.length > 0 && (
                <div className="col-md-8" id="post-display">
                    <h4>Posts Found:</h4>
                    <ul className="list-group">
                        {results.map((post, index) => {
                            const title = getPostTitle(post.content);
                            const body = getPostBody(post.content);
                            const isExpanded = expandedPostIndex === index;

                            return (
                                <li
                                    key={index}
                                    className="list-group-item"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        setExpandedPostIndex(isExpanded ? null : index)
                                    }
                                >
                                    <strong>{title}</strong>
                                    {isExpanded && (
                                        <div className="mt-2">
                                            <p>{body}</p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            </div>
            

        </div>
    );
}

export default Results;

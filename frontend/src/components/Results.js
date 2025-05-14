import React, { useEffect, useState, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useLocation } from "react-router-dom";

function Results() {
    const location = useLocation();
    const sentimentResults = location.state?.sentimentResults;
    const graphRef = useRef(null);

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

                const data = [{
                    x: Object.keys(emotionData),
                    y: Object.values(emotionData),
                    type: 'bar',
                    text: Object.values(emotionData),
                    textposition: 'auto'
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

    return (
        <div className="container px-4 pt-4 my-4">
            <h2 className="pb-2 border-bottom">
                Search Analysis <i className="bi bi-bar-chart mx-2"></i>
            </h2>

            {emotionCounts ? (
                <div>
                    {Object.entries(emotionCounts).map(([emotion, count]) => (
                        <p key={emotion}>
                            <strong>{emotion}:</strong> {count}
                        </p>
                    ))}
                </div>
            ) : (
                <p>No emotion counts available.</p>
            )}

            <div ref={graphRef} />
        </div>
    );
}

export default Results;

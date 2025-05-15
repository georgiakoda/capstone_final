import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

const emotionEmojis = {
  anger: '😡',
  sadness: '😢',
  joy: '😀',
  disgust: '🤢',
  fear: '😨',
  neutral: '😐',
  surprise: '😲',
};

function getPostTitle(content) {
  return content.split('\n\n')[0];
}
function getPostBody(content) {
  return content.split('\n\n').slice(1).join('\n\n');
}

function CachedResultItem({ item }) {
  const graphRef = useRef(null);
  const [expandedPostIndex, setExpandedPostIndex] = useState(null);
  const { query_key, data } = item;
  const { results, sentiment_results, created_at } = data;

  const formattedDate = new Date(created_at).toLocaleString();

  // Draw graph
  useEffect(() => {
    const counts = sentiment_results?.max_emotion_counts;
    if (!counts) return;

    const emotionColors = {
      anger: '#e02525',
      sadness: '#55a0f1',
      joy: '#6ee558',
      disgust: '#9b9b9b',
      fear: '#fca14b',
      neutral: '#fce357',
      surprise: '#bf84f7'
    };

    const emotions = Object.keys(counts);
    const colors = emotions.map(e => emotionColors[e] || 'gray');

    const data = [{
      x: emotions,
      y: Object.values(counts),
      type: 'bar',
      text: Object.values(counts),
      textposition: 'auto',
      marker: { color: colors }
    }];

    const layout = {
      title: 'Emotion Counts',
      xaxis: { title: 'Emotion' },
      yaxis: { title: 'Count' }
    };

    Plotly.newPlot(graphRef.current, data, layout);
  }, [sentiment_results]);

  return (
    <div className="card mb-4 p-3 shadow">
      <h4 className="mb-2">🔎 <strong>{query_key}</strong></h4>
      <p className="text-muted mb-3">🕒 {formattedDate}</p>

      <div ref={graphRef} className="mb-4" />

      <h5>Posts Found:</h5>
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
              onClick={() => setExpandedPostIndex(isExpanded ? null : index)}
            >
              <strong>{emotionEmojis[post.max_emotion]} [{post.max_emotion}]</strong>: <strong>{title}</strong>
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
  );
}

export default CachedResultItem;

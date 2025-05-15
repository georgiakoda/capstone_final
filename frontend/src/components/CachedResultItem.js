import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js-dist-min';

const emotionEmojis = {
  anger: '😡',
  sadness: '😢',
  joy: '😀',
  disgust: '🤢',
  fear: '😨',
  neutral: '😐',
  surprise: '😲'
};

const getPostTitle = (content) => content.split('\n\n')[0];
const getPostBody = (content) => content.split('\n\n').slice(1).join('\n\n');

function CachedResultItem({ item }) {
  const graphRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const data = item.data;
  const emotionCounts = data.sentiment_results?.max_emotion_counts;
  const results = data.results || [];

  useEffect(() => {
    if (!emotionCounts || !graphRef.current) return;

    const emotions = Object.keys(emotionCounts);
    const values = Object.values(emotionCounts);
    const colors = emotions.map((emotion) =>
      ({
        anger: '#e02525',
        sadness: '#55a0f1',
        joy: '#6ee558',
        disgust: '#9b9b9b',
        fear: '#fca14b',
        neutral: '#fce357',
        surprise: '#bf84f7'
      }[emotion] || 'blue')
    );

    const graphData = [{
      x: emotions,
      y: values,
      type: 'bar',
      marker: { color: colors },
      text: values,
      textposition: 'auto'
    }];

    Plotly.newPlot(graphRef.current, graphData, {
      title: `Emotion Counts for: ${item.query_key}`,
      xaxis: { title: 'Emotion' },
      yaxis: { title: 'Count' }
    });
  }, [emotionCounts, item.query_key]);

  return (
    <div className="my-5">
      <div ref={graphRef} />
      <ul className="list-group mt-4">
        {results.map((post, index) => {
          const title = getPostTitle(post.content);
          const body = getPostBody(post.content);
          const isExpanded = expandedIndex === index;

          return (
            <li
              key={index}
              className="list-group-item"
              style={{ cursor: 'pointer' }}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <strong>{title}</strong>
              <br />
              <small>
                Subreddit: <code>r/{post.subreddit}</code> | Emotion: {post.max_emotion} {emotionEmojis[post.max_emotion]}
              </small>
              {isExpanded && <p className="mt-2">{body}</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CachedResultItem;

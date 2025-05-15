import React from "react";
import Plot from "react-plotly.js";

function EmotionChart({ emotionCounts }) {
  const emotions = Object.keys(emotionCounts);
  const counts = Object.values(emotionCounts);

  return (
    <Plot
      data={[
        {
          type: "bar",
          x: emotions,
          y: counts,
          marker: { color: "rgba(55, 128, 191, 0.7)" },
        },
      ]}
      layout={{
        title: "Emotion Distribution",
        xaxis: { title: "Emotion" },
        yaxis: { title: "Count" },
      }}
    />
  );
}

export default EmotionChart;

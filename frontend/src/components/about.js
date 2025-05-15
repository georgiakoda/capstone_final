import React from 'react';

const About = () => (
  <div className="container px-4 pt-5 my-4">
    <h2 className="pb-2 border-bottom">About Us</h2>

    <p className="lead">
      Hi, we are <strong>Georgia, Tam, Eva and Mohib</strong> 👋 — welcome to our capstone project:
      <strong> Reddit Sentiment Analyzer</strong>!
    </p>

    <p>
      This full-stack web application uses <strong>FastAPI, React, MongoDB</strong>,
      and a <strong>DistilRoBERTa NLP model</strong> to perform sentiment analysis on Reddit posts.
    </p>

    <h4 className="mt-4">🔍 How It Works</h4>
    <ul className="list-group list-group-flush mb-4">
      <li className="list-group-item">
        Users input a <strong>search term</strong>.
      </li>
      <li className="list-group-item">
        The app queries the <strong>Reddit API</strong> for recent posts and comments related to that term.
      </li>
      <li className="list-group-item">
        Retrieved text is sent to a <strong>DistilRoBERTa-based NLP model</strong> for sentiment analysis.
      </li>
      <li className="list-group-item">
        Results are <strong>stored in MongoDB</strong> and displayed to the user.
      </li>
      <li className="list-group-item">
        If the term was previously searched, both <strong>new and old results</strong> are shown to highlight any change over time.
      </li>
    </ul>

    <h4 className="mt-4">🤝 Team Members</h4>
    <ul className="team-list d-flex justify-content-center gap-3 mt-3">
      <li className="team-member">Mohib</li>
      <li className="team-member">Georgia</li>
      <li className="team-member">Eva</li>
      <li className="team-member">Tam</li>
    </ul>

  </div>
);

export default About;

import './NotFound.css'
import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="error-code">404</div>
      <div className="message">Oops! Page not found</div>
      <p className="description">
        The page you’re looking for doesn’t exist. Let’s get you back home.
      </p>
      <a href="/~iliasalt/ThessInfo/" className="home-button2">Go Home</a>
    </div>
  );
};

export default NotFound;
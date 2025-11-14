import React from 'react';
import './ReviewPage.css';
import Slidebar from './Slidebar.jsx';

function ReviewPage(props) {
  return (
    <div className="reviewPageContainer">
      <Slidebar presentationId={201} />
      <div className="reviewContainer"> </div>
    </div>
  );
}

export default ReviewPage;

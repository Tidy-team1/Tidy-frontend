import React from 'react';
import './Slidebar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function Slidebar(presentationId) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then((res) => setSlides(res.data.slides))
      .catch((err) => {
        console.error(err);
        setSlides([
          {
            index: 1,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide1.png',
          },
          {
            index: 2,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide2.png',
          },
          {
            index: 3,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide3.png',
          },
        ]);
      });
  }, [presentationId]);

  return (
    <div className="slidebar">
      {slides.map((slide) => (
        <div key={slide.index} className="eachSlide">
          <img
            key={slide.index}
            src={slide.thumbnailUrl}
            alt={`Slide${slide.index}`}
            /*</div>*onClick={() => onSlideSelect(slide.index)*/
          ></img>
          <span>{slide.index}</span>
        </div>
      ))}
    </div>
  );
}

export default Slidebar;

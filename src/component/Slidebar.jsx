/*import React from 'react';
import './Slidebar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://tidy-server.store:8080';

function Slidebar({presentationId, onSlideSelect}) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then((res) => setSlides(res.data.slides))
      .catch((err) => {
        console.error(err);
        setSlides([
          {
            slideIndex: 1,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide1.png',
          },
          {
            slideIndex: 2,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide2.png',
          },
          {
            slideIndex: 3,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide3.png',
          },
        ]);
      });
  }, [presentationId]);

  return (
    <div className="slidebar">
      {slides.map((slide) => (
        <div
          key={slide.index}
          className="eachSlide"
          onClick={() => onSlideSelect(slide.index)}
        >
          <img
            key={slide.index}
            src={slide.thumbnailUrl}
            alt={`Slide${slide.index}`}
          ></img>
          <span>{slide.index}</span>
        </div>
      ))}
    </div>
  );
}

export default Slidebar;*/

import React from 'react';
import './Slidebar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:8080';

function Slidebar({ presentationId, onSlideSelect }) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then((res) => setSlides(res.data.slides))
      .catch((err) => {
        console.error(err);
        setSlides([
          {
            slideIndex: 1,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide1.png',
          },
          {
            slideIndex: 2,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide2.png',
          },
          {
            slideIndex: 3,
            thumbnailUrl:
              'https://cdn.tidy.ai/presentations/201/thumbnails/slide3.png',
          },
        ]);
      });
  }, [presentationId]);

  return (
    <div className="slidebar">
      {slides.map((slide) => (
        <div
          key={slide.index}
          className="eachSlide"
          onClick={() => onSlideSelect(slide.index)}
        >
          <img
            key={slide.index}
            src={slide.thumbnailUrl}
            alt={`Slide${slide.index}`}
          ></img>
          <span>{slide.index}</span>
        </div>
      ))}
    </div>
  );
}

export default Slidebar;

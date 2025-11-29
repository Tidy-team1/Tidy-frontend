import React from 'react';
import './Slidebar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:8080';

function Slidebar({ presentationId, onSlideSelect }) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (!presentationId) return;
    console.log('pptId:', presentationId);
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then(async (res) => {
        const slideList = res.data.slides;

        //각 slide.thumbnailUrl 을 presigned URL로 변환
        const slidesWithRealUrl = await Promise.all(
          slideList.map(async (slide) => {
            const key = `${slide.thumbnailUrl}`;
            const { data } = await axios.get(`/files/presigned?key=${key}`);
            return {
              ...slide,
              realThumbnail: data.url,
            };
          })
        );

        setSlides(slidesWithRealUrl);
      })
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
          key={slide.id}
          className="eachSlide"
          onClick={() => {
            onSlideSelect(slide.slideIndex);
            console.log('slide.slideIndex: ', slide.slideIndex);
          }}
        >
          <img
            key={slide.slideIndex}
            src={slide.realThumbnail}
            alt={`Slide${slide.slideIndex}`}
          ></img>
          <p>{slide.slideIndex + 1}</p>
        </div>
      ))}
    </div>
  );
}

export default Slidebar;

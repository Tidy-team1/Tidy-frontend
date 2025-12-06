import React from 'react';
import './Slidebar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:8080';

function Slidebar({
  presentationId,
  slides: modifiedRealThumb,
  onSlideSelect,
}) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    if (!presentationId) return;
    console.log('pptId:', presentationId);

    if (modifiedRealThumb && modifiedRealThumb.length > 0) {
      setSlides(modifiedRealThumb);
      console.log('수정된 슬라이드 set됨');
      return;
    }

    axios //수정 전 초기 슬라이드 상태
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
        console.log('처음 슬라이드바:', slidesWithRealUrl);
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
  }, [presentationId, modifiedRealThumb]);

  return (
    <div className="slidebar">
      {slides.map((slide, idx) => {
        const index = slide.slideIndex ?? idx;
        console.log(slide.realThumbnail);
        return (
          <div
            key={index}
            className="eachSlide"
            onClick={() => {
              onSlideSelect(index);
              console.log('index:', index);
            }}
          >
            <img
              key={index}
              src={slide.realThumbnail}
              alt={`Slide${index}`}
            ></img>
            <p>{index + 1}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Slidebar;

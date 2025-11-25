import React from 'react';
import './ReviewPage.css';
import Slidebar from './Slidebar.jsx';
import axios from 'axios';
import { useEffect, useState } from 'react';
axios.defaults.baseURL = 'http://localhost:8080';

/*function ReviewPage(props) {
  const presentationId = 201; ////////////////////////////수정
  const [feedbacks, setFeedbacks] = useState({});
  const [scores, setScores] = useState({});
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [slideImages, setSlideImages] = useState({});

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/review/result`)
      .then((res) => {
        setFeedbacks(res.data.issues || []);
        setScores(res.data.score || {});
      })
      .catch((err) => console.error(err));
  }, []);

  /*슬라이드 큰 화면에 매핑
  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then((res) => {
        const map = {};
        res.data.slides.forEach((s) => {
          map[s.slideIndex] = s.thumbnailUrl.replace('thumbnails', 'slides');
        });
        setSlideImages(map);
      })
      .catch((err) => console.error(err));
  }, []);

  const currentSlideImg = selectedSlide ? slideImages[selectedSlide] : null;

  return (
    <div className="reviewPageContainer">
      <Slidebar
        presentationId={presentationId}
        onSlideSelect={(idx) => setSelectedSlide(idx)}
      />
      <div className="reviewContainer">
        <div className="saveContainer">
          <button className="saveButton">저장하기</button>
        </div>

        {feedbacks.length === 0 ? (
          <p>피드백이 없습니다.</p>
        ) : (
          feedbacks.map((feedback, idx) => (
            <div key={idx} className="slideNumber">
              <span onClick={() => setSelectedSlide(feedback.slideIndex)}>
                {feedback.slideIndex}p
              </span>
            </div>
          ))
        )}

        <div className="feedbackContainer">
          {feedbacks.map((feedback, idx) => (
            <div key={idx} className="feedbackcontent">
              <span>{feedback.issueType}</span>
              <label>
                <input
                  type="checkbox"
                  checked={checkedFeedback[feedback.id] || false}
                  onChange={() => handleCheck(feedback.id)}
                />
                {feedback.massage}
              </label>
              <span>→ {issue.suggestion}</span>
            </div>
          ))}
          <button className="modifyButton">수정하기</button>
        </div>

        <div className="slidePage">
          {currentSlideImg ? (
            <img src={currentSlideImg} alt={`slide ${selectedSlide}`} />
          ) : (
            <p>슬라이드를 선택하세요.</p>
          )}
        </div>

        <div className="ReviewPageBottom">
          <div className="gradeContainer">
            <div>
              가독성<br></br> <div></div>
            </div>
          </div>
          <button>직접편집</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;*/

function ReviewPage(props) {
  const presentationId = 201; ////////////////////////////수정
  const [feedbacks, setFeedbacks] = useState({});
  const [scores, setScores] = useState({});
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [slideImages, setSlideImages] = useState({});
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/review/result`)
      .then((res) => {
        const issues = res.data.issues || [];

        // 체크 여부를 함께 state에 저장
        const mapped = issues.map((item, idx) => ({
          id: idx, // 내부용 id
          slideIndex: item.slideIndex,
          elementId: item.elementId,
          issueType: item.issueType,
          message: item.message,
          suggestion: item.suggestion,
          checked: false, // 기본값
        }));
        setChecks(mapped);
        setFeedbacks(res.data.issues || []); /////쓰이나?
        setScores(res.data.score || {});
      })
      .catch((err) => console.error(err));
  }, [presentationId]);

  /*슬라이드 큰 화면에 매핑*/
  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then((res) => {
        const map = {};
        res.data.slides.forEach((s) => {
          map[s.slideIndex] = s.thumbnailUrl.replace('thumbnails', 'slides');
        });
        setSlideImages(map);
      })
      .catch((err) => console.error(err));
  }, []);

  const currentSlideImg = selectedSlide ? slideImages[selectedSlide] : null;

  const handleCheck = (id) => {
    setChecks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleModify = async () => {
    const selectedIssues = checks.filter((c) => c.checked);
    try {
      for (const issue of selectedIssues) {
        await axios.post(
          `/presentations/${presentationId}/slides/${issue.slideIndex}/elements/${issue.elementId}/apply`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="reviewPageContainer">
      <Slidebar
        presentationId={presentationId}
        onSlideSelect={(idx) => setSelectedSlide(idx)}
      />
      <div className="reviewContainer">
        <button className="saveButton">↓ 저장하기</button>

        <div className="feedbackContainer">
          <div class="feedback-buttons">
            <span class="style-button active">폰트 일관성</span>
            <span class="style-button">정렬, 대칭</span>
          </div>
          <div class="feedback-checks">
            {checks.map((item) => (
              <div key={item.id} className="check-item">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                ></input>
                <label>{item.text}</label>
              </div>
            ))}
            {/*<div class="check-item">
              <input type="checkbox"></input>
              <label>
                글자크기가 슬라이드 4의 본문만 11pt 입니다.
              </label>
            </div>
            <div class="check-item">
              <input type="checkbox" id="alignment-check" checked></input>
              <label>도형 정렬이 맞지 않습니다.</label>
            </div>*/}
          </div>
          <button class="modify-button" onClick={handleModify}>
            수정
          </button>
        </div>

        <div className="slidePage">
          {currentSlideImg ? (
            <img src={currentSlideImg} alt={`slide ${selectedSlide}`} />
          ) : (
            <p>슬라이드를 선택하세요.</p>
          )}
        </div>

        <div className="reviewPageBottom">
          <div class="score-section">
            <div class="score-item">
              <span class="score-label">가독성</span>
              <span class="score-value">45점</span>
            </div>
            <div class="score-item">
              <span class="score-label">심미성</span>
              <span class="score-value">90점</span>
            </div>
            <div class="score-item">
              <span class="score-label">일관성</span>
              <span class="score-value">50점</span>
            </div>
          </div>
          <div class="script-section">
            <button class="script-button">발표 대본 작성 ⊙</button>
            <button class="edit-button">직접 편집 ◱</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;

import React from 'react';
import './ReviewPage.css';
import Slidebar from './Slidebar.jsx';
import ChatIcon from './ChatIcon.jsx';
import ChatSidebar from './ChatSidebar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

function ReviewPage() {
  const location = useLocation();
  const { presentationId, taskId } = location.state;
  const [selectedSlide, setSelectedSlide] = useState(null); //슬라이드바에서 선택된 슬라이드
  const [slideImages, setSlideImages] = useState({}); //큰 화면에 매핑

  const [feedbacks, setFeedbacks] = useState([]);
  const [scores, setScores] = useState({});
  const [checks, setChecks] = useState([]); //체크한 피드백
  const [slideIds, setSlideIds] = useState([]); //피드백 뜬 슬라이드

  const [taskStatus, setTaskStatus] = useState('PRCESSING');
  const [loading, setLoading] = useState(false); //나중에 true로 바꿔야함!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const isTeam = location.state?.isTeam || false;
  const [chatOpen, setChatOpen] = useState(false);

  /*useEffect(() => {
    let intervalId;

    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${taskId}`);
        const status = res.data.status;

        setTaskStatus(status);

        if (status === 'DONE') {
          clearInterval(intervalId);
          setLoading(false);
        }
      } catch (err) {
        console.error('작업 상태 조회 실패:', err);
      }
    };

    fetchTask();
    intervalId = setInterval(fetchTask, 1500); //1.5초마다 폴링

    return () => clearInterval(intervalId);
  }, [taskId]);*/

  /*슬라이드 큰 화면에 매핑*/
  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then(async (res) => {
        const map = {};
        for (const s of res.data.slides) {
          const slideImgKey = s.thumbnailUrl;
          const presignedRes = await axios.get(
            `/files/presigned?key=${slideImgKey}`
          );
          map[s.slideIndex] = presignedRes.data.url;
        }

        setSlideImages(map);
      })
      .catch((err) => console.error(err));
  }, [presentationId]);

  const currentSlideImg =
    selectedSlide !== null ? slideImages[selectedSlide] : null;

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/feedbacks`)
      .then((res) => {
        console.log(res.data);
        const ids = Array.from(new Set(res.data.map((f) => f.slideId)));
        setSlideIds(ids);
      })
      .catch(console.error);
  }, [presentationId]);

  const handleSlideButtonClick = async (slideId) => {
    setSelectedSlide(slideId);
    try {
      const res = await axios.get(
        `/presentations/${presentationId}/slides/${slideId}/feedbacks`
      );
      const mapped = res.data.map((f) => ({
        id: f.id,
        type: f.type,
        message: f.message,
        details: f.details,
        checked: false, ///이거 필요함? setChceks에 같이 넘겨주는데
      }));
      setFeedbacks(mapped);
      setChecks(mapped.map((f) => ({ id: f.id, checked: false })));
      console.log('presentationId:', presentationId, 'slideId:', slideId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheck = (id) => {
    setChecks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  /*const handleModify = async () => {
    const selected = checks.filter((c) => c.checked);
    try {
      for (const item of selected) {
        await axios.post(
          `/presentations/${presentationId}/slides/${issue.slideIndex}/elements/${issue.elementId}/apply`
        );
      }
    } catch (error) {
      console.error(error);
    }
  };*/

  const uniqueTypes = Array.from(new Set(feedbacks.map((f) => f.type)));

  return (
    <div className="reviewPageContainer">
      {loading && (
        <div className="reviewOverlay">
          <div className="reviewLoader"></div>
          <p className="review-loading-text">슬라이드 검토 중...</p>
        </div>
      )}
      <Slidebar
        presentationId={presentationId}
        onSlideSelect={(idx) => setSelectedSlide(idx)}
      />
      <div>{isTeam && <ChatIcon onClick={() => setChatOpen(true)} />}</div>

      <div className="reviewContainer">
        <button
          className="saveButton"
          onClick={() => handleSlideButtonClick(2)}
        >
          ↓ 저장하기
        </button>
        <div className="feedback-slideId">
          {slideIds.map((id) => (
            <span
              key={id}
              className={`slide-button ${
                selectedSlide === id ? 'activie' : ''
              }`}
              onClick={() => handleSlideButtonClick(id)}
            >
              슬라이드{id}
            </span>
          ))}
        </div>
        <div className="feedbackContainer">
          <div className="feedback-type">
            {uniqueTypes.map((t, i) => (
              <span key={i} className="each-type">
                {t}dfd
              </span>
            ))}
          </div>

          <div className="feedback-checks">
            {feedbacks.map((f) => (
              <div key={f.id} className="check-item">
                <input
                  type="checkbox"
                  checked={checks.find((c) => c.id === f.id)?.checked || false} ///////////뭔뜻임 이상한데?
                  onChange={() => handleCheck(f.id)}
                />
                <label>
                  {f.message}
                  <br />
                  <span className="details">{f.details}</span>
                </label>
              </div>
            ))}
          </div>

          <button className="modify-button" /*onClick={handleModify}*/>
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
          <div className="score-section">
            <div className="score-item">
              <span className="score-label">가독성</span>
              <span className="score-value">45점</span>
            </div>
            <div className="score-item">
              <span className="score-label">심미성</span>
              <span className="score-value">90점</span>
            </div>
            <div className="score-item">
              <span className="score-label">일관성</span>
              <span className="score-value">50점</span>
            </div>
          </div>
          <div className="script-section">
            <button className="script-button">발표 대본 작성 ⊙</button>
            <button className="edit-button">직접 편집 ◱</button>
          </div>
        </div>
      </div>
      <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}

export default ReviewPage;

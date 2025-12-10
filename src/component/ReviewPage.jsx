import React from 'react';
import './ReviewPage.css';
import Slidebar from './Slidebar.jsx';
import ChatIcon from './ChatIcon.jsx';
import ChatSidebar from './ChatSidebar';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8080';

function ReviewPage() {
  const location = useLocation();
  const { presentationId, taskId: initialTaskId } = location.state;
  const [taskId, setTaskId] = useState(initialTaskId);
  const [selectedSlide, setSelectedSlide] = useState(null); //슬라이드바에서 선택된 슬라이드
  const [slideImages, setSlideImages] = useState({}); //큰 화면에 매핑

  const [feedbacks, setFeedbacks] = useState([]); //한 슬라이드의 피드백
  const [slideScores, setSlideScores] = useState([]);
  const [checks, setChecks] = useState([]); //체크한 피드백
  const [slideIds, setSlideIds] = useState([]); //피드백 뜬 슬라이드

  const [groupedFeedbacks, setGroupedFeedbacks] = useState({}); //모든 피드백

  const [taskStatus, setTaskStatus] = useState('PRCESSING');
  const [loading, setLoading] = useState(true);

  const isTeam = location.state?.isTeam || false;
  const [chatOpen, setChatOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef();
  const [overflow, setOverflow] = useState(false);

  const [activeBboxes, setActiveBboxes] = useState([]); //오버레이 표시
  const imgRef = useRef(null);

  const [slideSizes, setSlideSizes] = useState({}); // 원본 크기
  const [renderedSizes, setRenderedSizes] = useState({}); // 화면 표시 크기

  const [slidebarSlides, setSlidebarSlides] = useState([]);
  const [isModified, setIsModified] = useState(false);

  const [undoStack, setUndoStack] = useState([]); //반영된 피드백 저장 (수정 전 클릭때 필요)

  useEffect(() => {
    let intervalId;

    const fetchTask = async () => {
      try {
        const res = await axios.get(`/tasks/${taskId}`);
        const status = res.data.status;
        const taskType = res.data.taskType;
        console.log(taskType);
        console.log(status);

        setTaskStatus(status);

        if (status === 'DONE' && taskType === 'REVIEW_ANALYSIS') {
          clearInterval(intervalId);
          setLoading(false);
        }
        if (status === 'DONE' && taskType === 'MODIFY') {
          clearInterval(intervalId);
          const newVersion = res.data.newVersion;
          console.log('newVersion:', newVersion);

          if (newVersion) {
            await fetchNewVersionSlides(newVersion);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('작업 상태 조회 실패:', err);
      }
    };

    fetchTask();
    intervalId = setInterval(fetchTask, 1500); //1.5초마다 폴링

    return () => clearInterval(intervalId);
  }, [taskId]);

  /*슬라이드 큰 화면에 매핑*/
  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/slides`)
      .then(async (res) => {
        const map = {};
        const sizeMap = {};

        for (const s of res.data.slides) {
          const slideImgKey = s.thumbnailUrl;
          const presignedRes = await axios.get(
            `/files/presigned?key=${slideImgKey}`
          );
          map[s.slideIndex] = presignedRes.data.url;

          sizeMap[s.slideIndex] = {
            //원본 이미지 크기 저장
            width: s.width,
            height: s.height,
          };
        }

        setSlideImages(map);
        setSlideSizes(sizeMap);
      })
      .catch((err) => console.error(err));
  }, [presentationId]);

  const currentSlideImg =
    selectedSlide !== null ? slideImages[selectedSlide] : null;

  useEffect(() => {
    axios
      .get(`/presentations/${presentationId}/feedbacks`)
      .then((res) => {
        const fbList = res.data;
        console.log('피드백 정보:', res.data);
        // slideIndex 기준으로 그룹핑
        const grouped = fbList.reduce((acc, f) => {
          if (!acc[f.slideIndex]) acc[f.slideIndex] = [];
          acc[f.slideIndex].push({
            id: f.id,
            type: f.type,
            message: f.message,
            details: f.details,
            status: f.status,
            bboxLeft: f.bboxLeft,
            bboxTop: f.bboxTop,
            bboxWidth: f.bboxWidth,
            bboxHeight: f.bboxHeight,
            shapeId: f.shapeId,
            elementIndex: f.elementIndex,
            slideId: f.slideId,
            slideIndex: f.slideIndex,
          });
          return acc;
        }, {});
        setGroupedFeedbacks(grouped);

        const ids = Array.from(new Set(res.data.map((f) => f.slideIndex)));
        console.log('피드백 슬라이드:', ids);
        setSlideIds(ids);
      })
      .catch(console.error);
  }, [presentationId, taskStatus]); //task 끝나고 새 피드백

  const uniqueTypes = Array.from(new Set(feedbacks.map((f) => f.type)));

  useEffect(() => {
    // 피드백 컨테이너 오버플로우 체크
    if (containerRef.current) {
      const isOverflowing =
        containerRef.current.scrollHeight > containerRef.current.clientHeight;
      setOverflow(isOverflowing);
    }
  }, [feedbacks]);

  useEffect(() => {
    //랜더링 되자마자 젤 첫 피드백슬라이드 띄우기
    if (slideIds.length > 0 && selectedSlide === null) {
      const first = slideIds[0];
      handleSlideButtonClick(first);
      setSelectedSlide(first);
    }
  }, [slideIds]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await axios.get(`presentations/${presentationId}/scores`);
        setSlideScores(res.data.scores);
      } catch (err) {
        console.error('점수 불러오기 실패:', err);
      }
    };

    fetchScores();
  }, [presentationId]);

  const currentScore = slideScores.find((s) => s.slideIndex === selectedSlide);

  const readability = currentScore?.readabilityScore ?? '-';
  const aesthetic = currentScore?.aestheticScore ?? '-';
  const consistency = currentScore?.consistencyScore ?? '-';

  const handleSlideButtonClick = async (slideId) => {
    setSelectedSlide(slideId);
    const fb = groupedFeedbacks[slideId] || [];

    const mapped = fb.map((f) => ({
      ...f,
      checked: false,
    }));

    setFeedbacks(mapped);
    setChecks(mapped.map((f) => ({ id: f.id, checked: false })));
    setActiveBboxes([]);
    console.log('presentationId:', presentationId, 'slideId:', slideId);
  };

  const handleCheck = (id) => {
    setChecks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );

    const target = feedbacks.find((f) => f.id === id);
    if (!target) return;

    const slideIndex = target.slideIndex;
    const converted = convertBBoxToRendered(target, slideIndex);

    setActiveBboxes((prev) => {
      if (prev.some((b) => b.id === id)) {
        // 이미 표시 중이면 제거
        return prev.filter((b) => b.id !== id);
      }
      return [
        ...prev,
        {
          id: target.id,
          slideIndex: target.slideIndex,
          left: converted.left,
          top: converted.top,
          width: converted.width,
          height: converted.height,
        },
      ];
    });
  };

  const handleModify = async () => {
    const selectedFeedbackIds = checks
      .filter((c) => c.checked)
      .map((c) => c.id);

    if (selectedFeedbackIds.length === 0) {
      alert('수정할 항목을 선택하세요.');
      return;
    }
    try {
      const res = await axios.post(`/presentations/${presentationId}/apply`, {
        feedbackIds: selectedFeedbackIds,
      });
      const newTaskId = res.data.taskId;
      console.log('new taskId:', newTaskId);

      setTaskStatus('PROCESSING');
      setTaskId(newTaskId); //이후 fetchTask 수행됨
      setLoading(true);

      // 수정할 피드백들 저장
      const removedFeedbacks = feedbacks.filter((f) =>
        selectedFeedbackIds.includes(f.id)
      );
      const removedChecks = checks.filter((c) =>
        selectedFeedbackIds.includes(c.id)
      );
      const removedBboxes = activeBboxes.filter((b) =>
        selectedFeedbackIds.includes(b.id)
      );

      setUndoStack((prev) => [
        ...prev,
        {
          feedbacks: removedFeedbacks,
          checks: removedChecks,
          bboxes: removedBboxes,
        },
      ]);

      //수정 후 남겨야하는 피드백만 보여주기
      setFeedbacks((prev) =>
        prev.filter((f) => !selectedFeedbackIds.includes(f.id))
      );
      setChecks((prev) =>
        prev.filter((c) => !selectedFeedbackIds.includes(c.id))
      );
      setActiveBboxes((prev) =>
        prev.filter((b) => !selectedFeedbackIds.includes(b.id))
      );
      setIsModified(true);
    } catch (error) {
      console.error('수정요청 실패:', error);
    }
  };

  const fetchNewVersionSlides = async (newVersion) => {
    try {
      const res = await axios.get(
        `presentations/${presentationId}/versions/${newVersion}/slides`
      );

      const slides = res.data.slides;
      const keys = slides.map((s) => s.imageKey);
      console.log(keys);

      const batchRes = await axios.post(`/files/presigned/batch`, {
        keys: keys,
      });

      const urlMap = batchRes.data.urls;

      //Slidebar에 전달할 props
      const mappedSlides = slides.map((slide) => ({
        ...slide,
        slideIndex: slide.index,
        realThumbnail: urlMap[slide.imageKey], //urlMap응답에서 실제주소만 가져옴
      }));
      console.log(mappedSlides);
      setSlidebarSlides([...mappedSlides]);

      //큰 화면에도 매핑 이미지 업데이트
      const newSlideImages = {};
      mappedSlides.forEach((s) => {
        newSlideImages[s.slideIndex] = s.realThumbnail;
      });
      setSlideImages(newSlideImages);
    } catch (err) {
      console.error('수정된 슬라이드표시 실패:', err);
    }
  };

  const undoSlides = async () => {
    try {
      const undoRes = await axios.post(`presentations/${presentationId}/undo`);
      const version = undoRes.data.currentVersion;
      const undoKeys = undoRes.data.slideKeys;

      const batchRes = await axios.post(`/files/presigned/batch`, {
        keys: undoKeys,
      });
      const urlMap = batchRes.data.urls;
      const mappedSlides = undoKeys.map((key, index) => ({
        imageKey: key,
        slideIndex: index,
        realThumbnail: urlMap[key],
      }));
      setSlidebarSlides(mappedSlides);
      const newSlideImages = {};
      mappedSlides.forEach((s) => {
        newSlideImages[s.slideIndex] = s.realThumbnail;
      });
      setSlideImages(newSlideImages);

      let last = null; //undo스택 pop대상
      let newStackLen = null;
      setUndoStack((prev) => {
        if (prev.length === 0) {
          newStackLen = 0;
          return prev;
        }
        last = prev[prev.length - 1];
        newStackLen = prev.length - 1;
        const newStack = prev.slice(0, -1); //UndoStack에서 pop 한 스택 저장

        return newStack;
      });

      if (last) {
        setFeedbacks([...last.feedbacks]);
        setChecks([...last.checks]);
        setActiveBboxes([...last.bboxes]);
      }

      //if (newStackLen == 0) setIsModified(false);
      //setIsModified적용 안될수 있어서 useEffect로 자동 동기화
    } catch (err) {
      console.error('수정 전으로 실패:', err);
    }
  };

  useEffect(() => {
    setIsModified(undoStack.length > 0);
  }, [undoStack]);

  const mergeUnique = (prev, added) => {
    //피드백 중복 제거 함수
    const map = new Map();
    prev.forEach((item) => map.set(item.id, item));
    added.forEach((item) => map.set(item.id, item));
    return [...map.values()];
  };

  function convertBBoxToRendered(bbox, slideIndex) {
    const original = slideSizes[slideIndex]; // { width: ?, height: ? }
    const rendered = renderedSizes[slideIndex]; // { width: ?, height: ? }
    if (!original || !rendered) return { left: 0, top: 0, width: 0, height: 0 }; // null 대신 기본값 반환

    const scaleX = rendered.width / original.width;
    const scaleY = rendered.height / original.height;

    return {
      left: bbox.bboxLeft * scaleX,
      top: bbox.bboxTop * scaleY,
      width: bbox.bboxWidth * scaleX,
      height: bbox.bboxHeight * scaleY,
    };
  }

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
        slides={slidebarSlides} //수정반영된 슬라이드들 다시 전달
        onSlideSelect={(idx) => {
          setSelectedSlide(idx);
          handleSlideButtonClick(idx);
        }}
      />
      <div>{isTeam && <ChatIcon onClick={() => setChatOpen(true)} />}</div>

      <button className="saveButton" onClick={() => handleSlideButtonClick(2)}>
        ↓ 저장하기
      </button>
      <div className="reviewContainer">
        <div className="feedback-slideId">
          {slideIds.map((id) => (
            <span
              key={id}
              className={`slide-button ${selectedSlide === id ? 'active' : ''}`}
              onClick={() => {
                handleSlideButtonClick(id);
                setExpanded(false);
              }}
            >
              슬라이드{id + 1}
            </span>
          ))}
        </div>
        <div
          ref={containerRef}
          className={`feedbackContainer${expanded ? ' expanded' : ''}`}
        >
          <div className="feedback-type">
            {uniqueTypes.map((t, i) => (
              <span key={i} className="each-type">
                {t}
              </span>
            ))}
          </div>

          <div className="feedback-checks">
            {feedbacks.map((f) => (
              <div key={f.id} className="check-item">
                <input
                  type="checkbox"
                  checked={checks.find((c) => c.id === f.id)?.checked || false}
                  onChange={() => handleCheck(f.id)}
                />
                <label>
                  {f.message}
                  <div className="details">{f.details}</div>
                </label>
              </div>
            ))}
          </div>
          <div className="modify-button-container">
            <button
              type="button"
              className="modify-button"
              onClick={() => handleModify()}
            >
              수정
            </button>
            {isModified ? (
              <button
                type="button"
                className="before-button"
                onClick={() => undoSlides()}
              >
                수정 전
              </button>
            ) : null}
          </div>

          {expanded && (
            <button
              className="expand-btn expanded-btn"
              onClick={() => {
                setExpanded(false);
                setOverflow(true);
              }}
            >
              ▲
            </button>
          )}
        </div>
        {overflow && !expanded && (
          <button
            className="expand-btn collapsed-btn"
            onClick={() => setExpanded(true)}
          >
            ▼
          </button>
        )}

        <div className="slidePage" style={{ position: 'relative' }}>
          <img
            ref={imgRef}
            src={slideImages[selectedSlide]}
            onLoad={(e) => {
              const rect = e.target.getBoundingClientRect();
              setRenderedSizes((prev) => ({
                ...prev,
                [selectedSlide]: { width: rect.width, height: rect.height },
              }));
            }}
          />
          {/* activeBboxes 를 이용해 Overlay 렌더 */}
          {activeBboxes
            .filter((b) => b.slideIndex === selectedSlide)
            .map((b) => (
              <div
                key={b.id}
                className="bbox-overlay"
                style={{
                  position: 'absolute',
                  border: '3px solid red',
                  left: b.left,
                  top: b.top,
                  width: b.width,
                  height: b.height,
                  pointerEvents: 'none',
                }}
              />
            ))}
        </div>

        <div className="reviewPageBottom">
          <div className="score-section">
            <div className="score-item">
              <span className="score-label">가독성</span>
              <span className="score-value">{readability}점</span>
            </div>
            <div className="score-item">
              <span className="score-label">심미성</span>
              <span className="score-value">{aesthetic}점</span>
            </div>
            <div className="score-item">
              <span className="score-label">일관성</span>
              <span className="score-value">{consistency}점</span>
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

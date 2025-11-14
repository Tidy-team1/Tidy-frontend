import React, { useState, useCallback } from 'react';
import './SelectReview.css';
import { useNavigate } from 'react-router-dom';

// 검토 항목의 계층적 데이터 구조 정의
const reviewItems = [
  { id: 'all', label: '전체 선택', type: 'parent' },
  {
    id: 'text',
    label: '텍스트',
    type: 'parent',
    children: [
      { id: 'spelling_grammar', label: '맞춤법, 오타', type: 'child' },
      { id: 'font_consistency', label: '폰트 일관성', type: 'child' },
    ],
  },
  { id: 'shape_image_alignment', label: '도형, 이미지', type: 'parent' },
  { id: 'layout_alignment', label: '정렬, 대칭 등', type: 'parent' },
  { id: 'theme', label: '테마', type: 'parent' },
  {
    id: 'aiFeedback',
    label: 'AI 피드백 제공',
    type: 'parent',
    children: [
      { id: 'readability', label: '가독성', type: 'child' },
      { id: 'color_contrast', label: '색상 대비', type: 'child' },
      { id: 'design_feedback', label: '디자인 피드백', type: 'child' },
    ],
  },
];

// 모든 항목의 key 목록을 단일 배열로 추출
const allKeys = reviewItems.flatMap((item) => [
  item.id,
  ...(item.children ? item.children.map((child) => child.id) : []),
]);

// 부모-자식 관계를 쉽게 찾기 위한 맵 생성
const parentChildMap = reviewItems.reduce((acc, parent) => {
  if (parent.children) {
    parent.children.forEach((child) => {
      acc[child.id] = parent.id;
    });
  }
  return acc;
}, {});

function SelectReview(props) {
  // 🐛 수정: allkeys -> allKeys (대문자 K)
  const [checkedItems, setCheckedItems] = useState(() =>
    allKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const handleCheck = useCallback((key) => {
    setCheckedItems((prev) => {
      let newState = { ...prev };
      const isCurrentlyChecked = prev[key];

      // 1. 체크한 항목 상태변경
      newState[key] = !isCurrentlyChecked;

      // 2. '전체 선택' 로직 처리
      if (key === 'all') {
        const allChecked = !isCurrentlyChecked;
        return allKeys.reduce((acc, k) => ({ ...acc, [k]: allChecked }), {});
      }

      // 3. 부모-자식 연동 로직
      const currentItem = reviewItems.find((item) => item.id === key);

      if (currentItem && currentItem.children) {
        // A. 부모 체크 시: 자식 전체 토글 (부모와 같은 상태로)
        currentItem.children.forEach((child) => {
          newState[child.id] = newState[key];
        });
      }

      // B. 자식 체크 시: 부모 상태 동기화
      const parentId = parentChildMap[key];
      if (parentId) {
        const parentItem = reviewItems.find((item) => item.id === parentId);
        if (parentItem && parentItem.children) {
          const allChildrenChecked = parentItem.children.every(
            (child) => newState[child.id]
          );
          const someChildrenChecked = parentItem.children.some(
            (child) => newState[child.id]
          );

          // 모든 자식이 체크되었으면 부모도 체크
          if (allChildrenChecked) {
            newState[parentId] = true;
          } else {
            // 하나라도 체크가 풀렸거나, 아예 체크된 게 없으면 부모는 해제
            newState[parentId] = false;
            // '전체 선택' 항목도 해제
            newState['all'] = false;
          }
        }
      }

      // 4. 모든 항목이 체크되었는지 확인하여 '전체 선택' 동기화
      const allExceptAllChecked = allKeys
        .filter((k) => k !== 'all')
        .every((k) => newState[k]);
      newState['all'] = allExceptAllChecked;

      return newState;
    });
  }, []);

  // 이미지 구조를 반영한 최종 렌더링
  const renderItem = (item) => (
    <React.Fragment key={item.id}>
      <label className={`checklist-item ${item.type}`}>
        <input
          type="checkbox"
          checked={checkedItems[item.id] || false}
          onChange={() => handleCheck(item.id)}
        />
        {item.label}
        {item.id === 'text' && <span className="icon">A</span>}
        {item.id === 'shape_image_alignment' && (
          <span className="icon">🖼️</span>
        )}
        {item.id === 'layout_alignment' && <span className="icon">📐</span>}
      </label>
      {/* 자식 항목을 감싸는 컨테이너 */}
      {item.children && (
        <div className="sub-checklist">
          {item.children.map((child) => (
            <label key={child.id} className={`checklist-item ${child.type}`}>
              <input
                type="checkbox"
                checked={checkedItems[child.id] || false}
                onChange={() => handleCheck(child.id)}
              />
              {child.label}
            </label>
          ))}
        </div>
      )}
    </React.Fragment>
  );
  const navigate = useNavigate();
  const goToReview = () => {
    navigate('/review');
  };

  return (
    <>
      <div className="selectContainer">
        <p>검토하려는 항목을 선택하세요.</p>
        <div className="checklist-layout">
          {/* 1. 전체 선택 */}
          {renderItem(reviewItems[0])}

          {/* 2. 텍스트 그룹 (2열 레이아웃) */}
          <div className="group-wrapper text-group">
            {renderItem(reviewItems[1])}
          </div>

          {/* 3. 단일 항목들 (2열 레이아웃) */}
          <div className="single-items-group">
            {reviewItems.slice(2, 5).map(renderItem)}
          </div>

          {/* 4. AI 피드백 그룹 (2열 레이아웃) */}
          <div className="group-wrapper ai-group">
            {renderItem(reviewItems[5])}
          </div>
        </div>
      </div>
      <button className="reviewBtn" onClick={goToReview}>
        검토하기
      </button>
    </>
  );
}

export default SelectReview;

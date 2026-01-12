// BookmarkButton.tsx

import { useState, useEffect } from "react";
import { isBookmarked} from "./Bookmark";
import bookmark from "../../assets/icons/bookmark.png"
import fillMark from "../../assets/icons/fill_bookmark.png"

type BookmarkButtonProps = {
  city: string;
  lat?: number;
  lon?: number;
  onClick?: () => void;
  active?: boolean;
  showBookmarked?: boolean; // 검색 위치 즐겨찾기용
};

export default function BookmarkButton({
  city,
  lat = 0,
  lon = 0,
  onClick,
  active = false,
  showBookmarked = false,
}: BookmarkButtonProps) {
  
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // 현재 도시가 즐겨찾기에 있는지 확인
    setBookmarked(isBookmarked(city));
  }, [city]);

  const handleClick = () => {
    if (onClick) onClick(); // Selected에서 즐겨찾기 모달 열기 또는 해제 처리
    setBookmarked(isBookmarked(city)); // 즐겨찾기 아이콘 상태 갱신
  };

  // 아이콘 결정
  let icon = bookmark;
  if (active) icon = fillMark;          // 홈 상단 메뉴 열림
  else if (showBookmarked && bookmarked) icon = fillMark; // 검색 위치 즐겨찾기 등록됨

  // alt 결정
  let altText = "";
  if (active) altText = "즐겨찾기 목록 닫기";
  else if (showBookmarked && bookmarked) altText = "즐겨찾기 해제";
  else if (showBookmarked && !bookmarked) altText = "즐겨찾기 등록";
  else altText = "즐겨찾기 목록 열기";

  return (
    <button onClick={handleClick}>
      <img
        src={icon}
        alt={altText}
        style={{ width: 24, height: 24 }}
      />
    </button>
  );
}

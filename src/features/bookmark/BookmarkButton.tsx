// BookmarkButton.tsx

import { useState, useEffect } from "react";
import { toggleBookmark, isBookmarked} from "./Bookmark";
import type { BookmarkItem } from "./Bookmark";
import bookmark from "../../assets/icons/bookmark.png"
import fillMark from "../../assets/icons/fill_bookmark.png"

type BookmarkButtonProps = {
  city: string;
  lat?: number;
  lon?: number;
  onClick?: () => void;
};

export default function BookmarkButton({ city, lat = 0, lon = 0 , onClick}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // 현재 도시가 즐겨찾기에 있는지 확인
    setBookmarked(isBookmarked(city));
  }, [city]);

  const handleClick = () => {
    if (onClick) onClick(); // Selected에서 즐겨찾기 모달 열기 또는 해제 처리
    setBookmarked(isBookmarked(city)); // 즐겨찾기 아이콘 상태 갱신
  };

  return (
    <button onClick={handleClick}>
      <img 
        src={bookmarked ? fillMark : bookmark} 
        alt={bookmarked ? "즐겨찾기 됨" : "즐겨찾기 안됨"} 
        style={{ width: 24, height: 24 }}
      />
    </button>
  );
}

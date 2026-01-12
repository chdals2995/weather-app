// Home.tsx

import { useState } from "react";
import SearchBar from "../features/search/SearchBar";
import Selected from "../features/weather/Selected";
import Current from "../features/weather/Current";
import BookmarkButton from "../features/bookmark/BookmarkButton";
import BookmarkList from "../features/bookmark/BookmarkList";

export default function Home(){
    const [selectedLocation, setSelectedLocation] = useState("");

    const [showBookmarkList, setShowBookmarkList] = useState(false);

    // 즐겨찾기 클릭 시 선택
    const handleSelectBookmark = (city: string) => {
        setSelectedLocation(city);
        setShowBookmarkList(false); // 목록 닫기
    };

    // 좌측 현위치 버튼 클릭 → 기본 홈 상태
    const handleCurrentClick = () => {
        setShowBookmarkList(false);
        setSelectedLocation(""); // 선택된 검색 위치 초기화
    };

    return(
        <div className="h-screen flex flex-col">
            {/* 최상단 메뉴 */}
            <section className="w-full flex justify-between border-2 border-red-500">
                <div className="w-10 border-2 border-red-500">현위치</div>
                <div className="w-10 border-2 border-red-500"
                onClick={() => setShowBookmarkList(!showBookmarkList)}>
                    {/* BookmarkButton 예시: 현재 선택된 도시 없으면 빈 문자열 */}
                    <BookmarkButton city={selectedLocation || ""} 
                    active={showBookmarkList} // 즐겨찾기 목록 열림 여부
                    onClick={() => setShowBookmarkList(!showBookmarkList)}/>
                </div>
            </section>

            {/* 즐겨찾기 목록 */}
                {showBookmarkList ? (
                    <section className="w-full border-2 border-blue-500 p-2 bg-gray-50">
                        <BookmarkList onSelect={handleSelectBookmark} />
                    </section>
                ) : (
                <>
                    {/* 상단 (사용자 위치 현재 날씨/ 즐겨찾기 날씨) */}
                    <section className="w-full h-100 border-2 border-red-500">
                        <Current/>
                    </section>
                    {/* 검색창 */}
                    <section className="w-full h-20 border-2 border-red-500">
                        <SearchBar onSearch={setSelectedLocation}/>
                    </section>
                    {/* 하단 (검색한 위치 날씨) */}
                    <section className="w-full h-100 border-2 border-red-500">
                        <Selected location={selectedLocation}/>
                    </section>
                </>
            )}
        </div>
    );
}
// Home.tsx

import { useState } from "react";
import SearchBar from "../features/search/SearchBar";
import Selected from "../features/weather/Selected";
import Current from "../features/weather/Current";

export default function Home(){
    const [selectedLocation, setSelectedLocation] = useState("");


    return(
        <div className="h-screen flex flex-col">
            {/* 최상단 메뉴 */}
            <section className="w-full flex justify-between border-2 border-red-500">
                <div className="w-10 border-2 border-red-500">현위치</div>
                <div className="w-10 border-2 border-red-500">즐겨찾기</div>
            </section>
            {/* 상단 */}
            <section className="w-full h-100 border-2 border-red-500">
                <Current/>
            </section>
            {/* 검색 */}
            <section className="w-full h-20 border-2 border-red-500">
                <SearchBar onSearch={setSelectedLocation}/>
            </section>
            {/* 하단 */}
            <section className="w-full h-100 border-2 border-red-500">
                <Selected location={selectedLocation}/>
            </section>
        </div>
    );
}
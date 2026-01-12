// Selected.tsx

import { useEffect, useState } from "react";
import WeatherInfo from "../weather/WeatherInfo";
import HourlyWeather from "../weather/HourlyWeather";
import { getForecastByCity } from "../../shared/Weather";

import BookmarkButton from "../bookmark/BookmarkButton";
import BookmarkModal from "../bookmark/BookmarkModal";
import { getBookmarks, addBookmark, removeBookmark } from "../bookmark/Bookmark";
import type { BookmarkItem } from "../bookmark/Bookmark";

type SelectedProps = {
  location?: string | null;
};

type WeatherState = {
  temp: number;
  tempMin: number;
  tempMax: number;
  main: string;
};

type HourlyItem = {
  time: string;
  temp: number;
  main: string;
};

export default function Selected({ location }: SelectedProps) {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherState | null>(null);
  const [hourly, setHourly] = useState<HourlyItem[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false); // 1️⃣ 즐겨찾기 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태

  const cityMap: Record<string, string> = {
  "서울특별시": "Seoul",
  "부산광역시": "Busan",
  "대구광역시": "Daegu",
  "인천광역시": "Incheon",
  "광주광역시": "Gwangju",
  "대전광역시": "Daejeon",
  "울산광역시": "Ulsan",
  "세종특별자치시": "Sejong",
  "경기도": "Gyeonggi",
  "강원도": "Gangwon",
  "충청북도": "Chungcheongbuk",
  "충청남도": "Chungcheongnam",
  "전라북도": "Jeonbuk",
  "전라남도": "Jeonnam",
  "경상북도": "Gyeongbuk",
  "경상남도": "Gyeongnam",
  "제주특별자치도": "Jeju"
};

  // 시간 표시 함수
  function formatTime(dt: number) {
    const date = new Date(dt * 1000);
    return `${date.getHours()}시`;
  }

  // 2️⃣ 즐겨찾기 상태 초기화
  useEffect(() => {
    if (!city) return;
    setIsBookmarked(getBookmarks().some(b => b.city === city));
  }, [city]);

  // 날씨 정보 가져오기
  useEffect(() => {
    if (!location) return;

    async function fetchWeather() {
      try {
        const cityKor = location!.split("-")[0]; // 한글 주소 영문 변환
        const cityEng = cityMap[cityKor] || cityKor; // 없으면 한글 그대로

        // API 호출
        const forecastData = await getForecastByCity(cityEng);

        // 도시명(영문)
        setCity(forecastData.city.name);

        // 현재 날씨: 첫 번째 데이터
        const nowData = forecastData.list[0];
        setWeather({
          temp: nowData.main.temp,
          tempMin: Math.min(...forecastData.list.slice(0, 8).map((i: any) => i.main.temp_min)),
          tempMax: Math.max(...forecastData.list.slice(0, 8).map((i: any) => i.main.temp_max)),
          main: nowData.weather[0].main,
        });

        // 2️⃣ 3시간 단위 시간대별 날씨 (24시간)
        const now = Math.floor(Date.now() / 1000);

        const list = forecastData.list
          .filter((item: any) => item.dt >= now)
          .slice(0, 8) // 3시간 단위 8개 = 24시간
          .map((item: any) => ({
            time: formatTime(item.dt),
            temp: Math.round(item.main.temp),
            main: item.weather[0].main,
          }));

        setHourly(list);
      } catch (err) {
        console.error("검색 위치 조회 실패", err);
      }
    }

    fetchWeather();
  }, [location]);

  // 모달 열기
  const handleBookmarkClick = () => {

    if (isBookmarked) {
    // 이미 즐겨찾기 되어있으면 바로 해제
    removeBookmark(city);
    setIsBookmarked(false);
  } else {
    // 즐겨찾기 안 되어 있으면 모달 열기
    setShowModal(true);
  }
  };

  // 모달에서 저장
  const handleSaveBookmark = (alias: string) => {
    if (!weather) return;

    const item: BookmarkItem = {
      city,
      alias,
      lat: 0,
      lon: 0,
      temp: weather.temp,
      weather: weather.main,
    };

    addBookmark(item);
    setIsBookmarked(true);
    setShowModal(false); // 저장 후 모달 닫기
  };

  if (!location) return <div>해당 장소의 정보가 제공되지 않습니다.</div>;

  return (
    <div>
        <div className="flex justify-between">
            <p>검색한 위치: {city}</p>
            <BookmarkButton city={city} onClick={handleBookmarkClick} />
        </div>

      {weather && (
        <WeatherInfo
          city={city}
          temp={weather.temp}
          tempMin={weather.tempMin}
          tempMax={weather.tempMax}
          main={weather.main}
        />
      )}

      <section>
        <HourlyWeather hourly={hourly} />
      </section>

      {/* 모달 */}
      {showModal && (
        <BookmarkModal
          initialName={city}
          onClose={() => setShowModal(false)}
          onSave={handleSaveBookmark}
        />
      )}
    </div>
  );
}

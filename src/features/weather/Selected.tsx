// Selected.tsx

import { useEffect, useState } from "react";
import WeatherInfo from "../weather/WeatherInfo";
import HourlyWeather from "../weather/HourlyWeather";
import { getForecastByCity } from "../../shared/Weather";

import BookmarkButton from "../bookmark/BookmarkButton";
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
    const bookmarks = getBookmarks();
    const exists = bookmarks.some((b) => b.city === city);
    setIsBookmarked(exists);
  }, [city]);

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

  // 3️⃣ 즐겨찾기 토글 핸들러
  const handleBookmarkToggle = () => {
    if (!weather || !city) return;

    const item: BookmarkItem = {
      city,
      lat: 0,
      lon: 0,
  };

    if (isBookmarked) {
      removeBookmark(city);
    } else {
      addBookmark(item);
    }
    setIsBookmarked(!isBookmarked);
  };

  if (!location) return <div>해당 장소의 정보가 제공되지 않습니다.</div>;

  return (
    <div>
        <div className="flex justify-between">
            <p>검색한 위치: {city}</p>
            <BookmarkButton city={city} />
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
    </div>
  );
}

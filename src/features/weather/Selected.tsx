// Selected.tsx

import { useEffect, useState } from "react";
import WeatherInfo from "../weather/WeatherInfo";
import HourlyWeather from "../weather/HourlyWeather";
import { getForecastByCoord } from "../../shared/Weather";

import BookmarkButton from "../bookmark/BookmarkButton";
import BookmarkModal from "../bookmark/BookmarkModal";
import { getBookmarks, addBookmark, removeBookmark } from "../bookmark/Bookmark";
import type { BookmarkItem } from "../bookmark/Bookmark";
import { cityCoords } from "../../shared/CityMaps";

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
  const [alias, setAlias] = useState<string | null>(null);

  // 시간 표시 함수
  function formatTime(dt: number) {
    const date = new Date(dt * 1000);
    return `${date.getHours()}시`;
  }

  // 2️⃣ 즐겨찾기 상태 초기화
  useEffect(() => {
    if (!location) return;
    const bookmark = getBookmarks().find(b => b.location === location);

  if (bookmark) {
    setIsBookmarked(true);

    if (bookmark.alias && bookmark.alias !== bookmark.city) {
      setAlias(bookmark.alias);
    } else {
      setAlias(null);
    }
  } else {
    setIsBookmarked(false);
    setAlias(null);
  }
}, [location]);

  // 날씨 정보 가져오기
  useEffect(() => {
    if (!location) return;

    async function fetchWeather() {
      try {
        // location: "서울특별시-강남구-역삼동" 형태
        const parts = location!.split("-");

        const cityKor = parts[0]; // 도 / 광역시
        const guKor = parts[1];   // 시 / 군 / 구
        const dongKor = parts[2]; // 동 / 읍 / 면

        // ✅ 화면에 보여줄 이름 (항상 한글)
      const displayCity = parts.slice(0, 2).join(" ");

        // ⬇️ 가장 하위 행정단위부터 좌표 찾기
      const coord =
        (dongKor && cityCoords[dongKor]) ||
        (guKor && cityCoords[guKor]) ||
        cityCoords[cityKor];

      if (!coord) {
        console.error("좌표를 찾을 수 없음:", location);
        return;
      }

      // ✅ 좌표 기반으로만 호출
      const forecastData = await getForecastByCoord(coord.lat, coord.lon);

      // 도시명
      setCity(displayCity);

        // 현재 날씨
        const nowData = forecastData.list[0];

        const range = forecastData.list.slice(0, 8);
        const tempMin = Math.min(...range.map((i: any) => i.main.temp_min));
        const tempMax = Math.max(...range.map((i: any) => i.main.temp_max));

        setWeather({
          temp: Math.round(nowData.main.temp),
          tempMin: Math.round(tempMin),
          tempMax: Math.round(tempMax),
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
    if (!location) return;

    if (isBookmarked) {
    // 이미 즐겨찾기 되어있으면 바로 해제
    removeBookmark(location);
    setIsBookmarked(false);
  } else {
    // 즐겨찾기 안 되어 있으면 모달 열기
    setShowModal(true);
  }
  };

  // 모달에서 저장
  const handleSaveBookmark = (alias: string) => {
    if (!weather || !location) return;

    const item: BookmarkItem = {
      city,
      location,
      alias,
      lat: 0,
      lon: 0,
      temp: Math.round(weather.temp),
      tempMin: Math.round(weather.tempMin),
      tempMax: Math.round(weather.tempMax),
      weather: weather.main,
    };

    addBookmark(item) // 즐겨찾기 저장
    setIsBookmarked(true); // 버튼 상태 갱신
    setShowModal(false); // 저장 후 모달 닫기
  };

  if (!location) return <div>해당 장소의 정보가 제공되지 않습니다.</div>;

  return (
    <div>
        <div className="flex justify-between">
            <p className="text-sm">검색한 위치 : {city}</p>
            <BookmarkButton
              city={city}
              onClick={handleBookmarkClick}
              bookmarked={isBookmarked}
            />
          </div>

      {weather && (
        <WeatherInfo
          city={city}
          alias={alias ?? undefined}
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

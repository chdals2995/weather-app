// Weather.ts (API)

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
// openweathermap api기본 주소 - 유지보수를 위해 공통 도메인 분리

if (!API_KEY) {
  console.error("❌ VITE_WEATHER_API_KEY가 없습니다 (.env 확인)");
}

// 현재 위치(위도, 경도) 기준 현재 날씨
export async function getCurrentByCoord(lat: number, lon: number ) {

  const res = await fetch(

    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );    // 위도(lat), 경도(lon), 섭씨 단위(metric), API 키

  if (!res.ok) {
    throw new Error("현재 위치 날씨 조회 실패");
  }

  return res.json();
}

// 도시명 기준 현재 날씨 (검색 / 즐겨찾기용)
export async function getCurrentByCity(city: string) {
  const res = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("해당 위치 날씨 조회 실패");
  }

  return res.json();
}

// 3시간 단위 예보 (최대 5일치)
export async function getForecastByCoord(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/forecast?&lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("시간대별 날씨 조회 실패");
  }

  return res.json();
}

// 도시명 기준 3시간 단위 예보 (검색/즐겨찾기)
export async function getForecastByCity(city: string) {
  const res = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("도시별 시간대별 날씨 조회 실패");
  }

  return res.json();
}
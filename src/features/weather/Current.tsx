// Current.tsx

import { useEffect, useState } from "react";
import WeatherInfo from "./WeatherInfo";
import HourlyWeather from "./HourlyWeather";
import { getCurrentByCoord, getForecastByCoord } from "../../shared/Weather";
import { cityCoords } from "../../shared/CityMaps";


export default function Current() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<null | {
    temp: number;
    tempMin: number;
    tempMax: number;
    main: string;
  }>(null);

  const [hourly, setHourly] = useState<{ time: string; temp: number; main: string }[]>([]);

    // 시간 표시 함수
  function formatTime(dt: number) {
    const date = new Date(dt * 1000);
    return `${date.getHours()}시`;
  }

  useEffect(() => {
    // 사용자 현재 위치
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      // 한글 도시명
      let cityKor = "";

      Object.entries(cityCoords).forEach(([name, coord]) => {
        if (
          Math.abs(coord.lat - latitude) < 0.05 &&
          Math.abs(coord.lon - longitude) < 0.05
        ) {
          cityKor = name;
        }
      });

      setCity(cityKor);

      // 현재 위치 날씨 기온
      const currentData = await getCurrentByCoord(latitude, longitude);

      const forecastData = await getForecastByCoord(latitude, longitude);

      const temps = forecastData.list.slice(0, 8);
      const tempMin = Math.min(...temps.map((i: any) => i.main.temp_min));
      const tempMax = Math.max(...temps.map((i: any) => i.main.temp_max));

      setWeather({
        temp: Math.round(currentData.main.temp),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        main: currentData.weather[0].main,
      });

      // 3시간대별 날씨
      const hourlyData = await getForecastByCoord(latitude, longitude);
      const now = Math.floor(Date.now() / 1000);

        const list = hourlyData.list
            .filter((item: any) => item.dt >= now)
            .slice(0, 8) // 3시간 단위 8개 = 24시간
            .map((item: any) => ({
                time: formatTime(item.dt),
                temp: Math.round(item.main.temp),
                main: item.weather[0].main,
            }));

      setHourly(list);
    });
  }, []);

    return(
        <div>
            <p>나의 위치 : {city}</p>

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
// WeatherInfo.tsx

import sun from "../../assets/icons/sun.png"
import moon from "../../assets/icons/moon.png"
import clouds from "../../assets/icons/clouds.png"
import rain from "../../assets/icons/rain.png"
import thunder from "../../assets/icons/thunder.png"
import snow from "../../assets/icons/snow.png"

type WeatherInfoProps = {
  city: string;
  alias?: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  main: string;
};

// 아이콘
function mapWeatherMainToIcon(main: string, isDay: boolean = true) {
  switch (main) {
    case "Clear":
      return isDay ? sun : moon;
    case "Clouds":
      return clouds;
    case "Rain":
    case "Drizzle":
      return rain;
    case "Snow":
      return snow;
    case "Thunderstorm":
      return thunder;
    case "Mist":
    case "Fog":
    case "Haze":
      return clouds;
    default:
      return sun;
  }
}

export default function WeatherInfo({
  city,
  alias,
  temp,
  tempMin,
  tempMax,
  main,
}: WeatherInfoProps) {
    return(
        <div>
            {/* 현재 위치의 날씨 표시 */}
            <div>
                <span>
                    {tempMin}°c / {tempMax}°c
                </span>
                {alias && alias !== city && (
                <span className="text-sm text-gray-500">
                  {alias}
                </span>
              )}
            </div>
            <div>
                <img src={mapWeatherMainToIcon(main)} alt={main} />
                <span>{temp}°c</span>
            </div>
        </div>
    );
}
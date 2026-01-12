// HourlyWeather.tsx

import sun from "../../assets/icons/sun.png"
import moon from "../../assets/icons/moon.png"
import clouds from "../../assets/icons/clouds.png"
import rain from "../../assets/icons/rain.png"
import thunder from "../../assets/icons/thunder.png"
import snow from "../../assets/icons/snow.png"

type HourlyItem = {
  time: string;
  temp: number;
  main: string;
};

type HourlyWeatherProps = {
  hourly: HourlyItem[];
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

export default function HourlyWeather({ hourly }: HourlyWeatherProps) {
  return (
    <ul className="border flex justify-around mt-12">
      {hourly.map((item,idx) => (
        <li key={`${item.time}-${idx}`}
        className="border flex-col justify-between flex">
          <span className="block">{item.time}</span>
          <img
            src={mapWeatherMainToIcon(item.main)} alt={item.time} 
            className="block"
          />
          <span className="block">{item.temp}°</span>
        </li>
      ))}
    </ul>
  );
}
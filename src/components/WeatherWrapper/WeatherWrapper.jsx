import React, { useState, useEffect } from "react";
import { FaTemperatureLow } from "react-icons/fa";
import { LuWind } from "react-icons/lu";
import styles from "../WeatherWrapper/WeatherWrapper.module.sass";
export default function Weather(props) {
  const [tempUnit, setTempUnit] = useState("celsius");
  const [windUnit, setWindUnit] = useState("kmh");
  const [weather, setWeather] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = () => {
    setIsFetching(true);
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=wind_speed_10m,temperature_2m&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}`,
    )
      .then((response) => response.json())
      .then((data) => setWeather(data.current))
      .catch((e) => setError(e))
      .finally(() => setIsFetching(false));
  };

  const celsius = weather?.temperature_2m;
  const fahrenheit = celsius * (9 / 5) + 32;
  const kmh = weather?.wind_speed_10m;
  const ms = kmh / 3.6;

  const temp = tempUnit === "celsius" ? `${celsius} °C` : `${fahrenheit} °F`;
  const wind = windUnit === "kmh" ? `${kmh} Km/h` : `${ms.toFixed(1)} M/s`;

  useEffect(() => {
    loadWeather();
    const id = setInterval(loadWeather, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {error && <div>Oops... Error</div>}
      {isFetching && <div>Loading. Please wait... </div>}
      {!error && !isFetching && weather && (
        <div className={styles.container}>
          <div className={styles.leftContainer}>
            <div className={styles.left}>
              <span className={styles.titleLeft}>Wind speed unit</span>
              <select
                className={styles.select}
                name="wind"
                id="wind"
                value={windUnit}
                onChange={(e) => setWindUnit(e.target.value)}
              >
                <option value="kmh">Km/h</option>
                <option value="ms">M/s</option>
              </select>
            </div>
            <div className={styles.left}>
              <span className={styles.titleLeft}>Temperature unit</span>
              <select
                className={styles.select}
                name="temp"
                id="temp"
                value={tempUnit}
                onChange={(e) => setTempUnit(e.target.value)}
              >
                <option value="celsius">°C</option>
                <option value="fahrenheit">°F</option>
              </select>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <h2 className={styles.title}>Current Weather</h2>
            <div>
              <p className={styles.result}>
                <FaTemperatureLow />
                {temp}
              </p>
              <p className={styles.result}>
                <LuWind />
                {wind}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

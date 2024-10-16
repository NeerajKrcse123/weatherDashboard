import { Droplet, Sun, Thermometer, Wind } from "lucide-react";
import React, { useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WeatherIcon = ({ iconCode, size = "medium" }) => {
  const iconSize = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-20 h-20",
  };

  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

  return (
    <img src={iconUrl} alt="weather icon" className={`${iconSize[size]}`} />
  );
};

const WeatherDisplay = ({ weather, forecast }) => {
  const [units, setUnits] = useState("metric");

  const getWindDirection = (deg) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatChartData = () => {
    if (!forecast) return [];
    return forecast.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
      }),
      temp:
        units === "metric"
          ? Math.round(item.main.temp)
          : Math.round((item.main.temp * 9) / 5 + 32),
    }));
  };

  const convertTemperature = (temp) => {
    return units === "metric"
      ? Math.round(temp)
      : Math.round((temp * 9) / 5 + 32);
  };

  const toggleUnits = () => {
    setUnits((prevUnits) => (prevUnits === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-2">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-semibold text-white">
              {weather.name}, {weather.sys.country}
            </h2>
            <button
              onClick={toggleUnits}
              className="bg-slate-100 hover:bg-slate-600 text-black hover:text-white duration-300 rounded md:px-4 px-2 py-2"
            >
              Switch to {units === "metric" ? "F" : "C"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <WeatherIcon iconCode={weather.weather[0].icon} size="large" />
              <div className="ml-4">
                <p className="text-6xl font-bold text-white">
                  {convertTemperature(weather.main.temp)}°
                  {units === "metric" ? "C" : "F"}
                </p>
                <p className="text-xl text-gray-300 capitalize">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Thermometer className="text-yellow-400 mr-2" />
              <p className="text-gray-300">
                Feels like: {convertTemperature(weather.main.feels_like)}°
                {units === "metric" ? "C" : "F"}
              </p>
            </div>
            <div className="flex items-center">
              <Droplet className="text-blue-400 mr-2" />
              <p className="text-gray-300">
                Humidity: {weather.main.humidity}%
              </p>
            </div>
            <div className="flex items-center">
              <Wind className="text-green-400 mr-2" />
              <p className="text-gray-300">
                Wind: {Math.round(weather.wind.speed)}{" "}
                {units === "metric" ? "m/s" : "mph"}{" "}
                {getWindDirection(weather.wind.deg)}
              </p>
            </div>
            <div className="flex items-center">
              <Sun className="text-orange-400 mr-2" />
              <p className="text-gray-300">
                UV Index: {Math.round(weather.uvi || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-4">
            24-Hour Forecast
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={formatChartData()}>
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-6">
          <h3 className="text-2xl font-semibold text-white mb-4">
            5-Day Forecast
          </h3>
          <div className="space-y-4">
            {forecast &&
              forecast.list
                .filter((item, index) => index % 8 === 0)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between text-gray-300"
                  >
                    <p>
                      {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </p>
                    <div className="flex items-center">
                      <WeatherIcon
                        iconCode={item.weather[0].icon}
                        size="medium"
                      />
                      <p className="ml-2">
                        {convertTemperature(item.main.temp)}°
                        {units === "metric" ? "C" : "F"}
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;

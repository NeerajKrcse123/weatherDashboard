import axios from "axios";
import { useEffect, useState } from "react";
import { CitySearch } from "./CitySearch";
import { FavoriteCities } from "./FavoriteCities";
import WeatherDisplay from "./WeatherDisplay";
const API_KEY = "1508f71a907a647da00160d95b697cf9";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

export default function WeatherDashboard() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [units, setUnits] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const lastCity = localStorage.getItem("lastCity");
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    if (lastCity) {
      setCity(lastCity);
      fetchWeather(lastCity);
    }
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get(
          `${API_BASE_URL}/weather?q=${cityName}&units=${units}&appid=${API_KEY}`
        ),
        axios.get(
          `${API_BASE_URL}/forecast?q=${cityName}&units=${units}&appid=${API_KEY}`
        ),
      ]);

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      setCity(cityName);
      localStorage.setItem("lastCity", cityName);

      return true;
    } catch (error) {
      setError("Failed to fetch weather data. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleUnits = () => {
    const newUnits = units === "metric" ? "imperial" : "metric";
    setUnits(newUnits);
    if (city) fetchWeather(city);
  };

  const addToFavorites = (cityName) => {
    const existingFavorite = favorites.find((fav) => fav.name === cityName);
    if (existingFavorite) {
      alert(`${cityName} is already in your favorites.`);
      return;
    }

    const newFavorite = { id: Date.now(), name: cityName };
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const updateFavorite = (cityId, newCityName) => {
    const updatedFavorites = favorites.map((fav) =>
      fav.id === cityId ? { ...fav, name: newCityName } : fav
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (cityId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== cityId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  return (
    <div className="bg-slate-800 min-h-screen p-8">
      <h1 className="text-4xl text-white font-bold mb-4">Weather Dashboard</h1>
      <CitySearch
        city={city}
        setCity={setCity}
        fetchWeather={fetchWeather}
        addToFavorites={addToFavorites}
      />
      <FavoriteCities
        favorites={favorites}
        currentCity={city}
        removeFromFavorites={removeFromFavorites}
        fetchWeather={fetchWeather}
        updateFavorite={updateFavorite}
        clearFavorites={clearFavorites}
      />
      {loading && (
        <div className="text-center text-white text-2xl mt-10">Loading...</div>
      )}
      {!loading && error && (
        <div className="text-center text-red-500 text-2xl mt-10">{error}</div>
      )}
      {!loading && weather && forecast && (
        <WeatherDisplay
          weather={weather}
          forecast={forecast}
          units={units}
          toggleUnits={toggleUnits}
        />
      )}
    </div>
  );
}

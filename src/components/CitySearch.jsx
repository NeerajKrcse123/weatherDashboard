import { useState } from "react";

export const CitySearch = ({ fetchWeather, addToFavorites }) => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setLoading(true);
      const isValidCity = await fetchWeather(inputValue);
      if (isValidCity) {
        const confirmAdd = window.confirm(
          `Do you want to add ${inputValue} to your favorite cities?`
        );
        if (confirmAdd) {
          addToFavorites(inputValue);
        }
      }
      setLoading(false);
      setInputValue("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="mb-8 flex space-x-4">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter city name"
        className="w-full px-4 py-2 rounded-md text-gray-900"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-slate-100 hover:bg-slate-600 text-black hover:text-white duration-300 px-4 py-2 rounded-md mt-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Search"}
      </button>
    </form>
  );
};

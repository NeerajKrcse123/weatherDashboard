import { Edit, MapPin, Trash2 } from "lucide-react";
import React, { useState } from "react";
export const FavoriteCities = ({
  favorites,
  currentCity,
  fetchWeather,
  removeFromFavorites,
  updateFavorite,
  clearFavorites,
  favoritesLoading,
}) => {
  const [isEditing, setIsEditing] = useState(null);
  const [updatedCity, setUpdatedCity] = useState("");

  const handleUpdateCity = (cityId) => {
    updateFavorite(cityId, updatedCity);
    setIsEditing(null);
  };

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold text-white mb-4">
        Favorite Cities
      </h3>
      {favorites.length === 0 ? (
        <div className="text-gray-400 text-lg">
          No favorite cities added yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {favorites.map((favorite) => (
            <li
              key={favorite.id}
              className="flex justify-between items-center text-white"
            >
              {isEditing === favorite.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={updatedCity}
                    onChange={(e) => setUpdatedCity(e.target.value)}
                    className="text-black px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => handleUpdateCity(favorite.id)}
                    className="bg-yellow-400 text-black px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  className={`flex items-center space-x-2 ${
                    favorite.name === currentCity
                      ? "font-bold text-yellow-400"
                      : ""
                  }`}
                  onClick={() => fetchWeather(favorite.name)}
                >
                  <MapPin className="text-yellow-400" />
                  <span>{favorite.name}</span>
                </button>
              )}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(favorite.id);
                    setUpdatedCity(favorite.name);
                  }}
                  className="text-blue-500"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => removeFromFavorites(favorite.id)}
                  className="text-red-500"
                >
                  {favoritesLoading ? (
                    <div className="loader"></div>
                  ) : (
                    <Trash2 />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {favorites.length > 0 && (
        <button
          onClick={clearFavorites}
          className="mt-4 text-red-500 hover:underline"
        >
          Clear All Favorites
        </button>
      )}
    </div>
  );
};

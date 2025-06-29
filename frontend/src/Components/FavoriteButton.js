import React from "react";
import { useFavorite } from "../hooks/useFavorite";
import "./FavoriteButton.css";

const FavoriteButton = ({ productId, className = "" }) => {
  const { isFavorite, loading, toggleFavorite } = useFavorite(productId);

  return (
    <button
      className={`favorite-button ${
        isFavorite ? "favorited" : ""
      } ${className}`}
      onClick={toggleFavorite}
      disabled={loading}
      title={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <svg
        className="heart-icon"
        viewBox="0 0 24 24"
        fill={isFavorite ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {loading && <div className="loading-spinner"></div>}
    </button>
  );
};

export default FavoriteButton;

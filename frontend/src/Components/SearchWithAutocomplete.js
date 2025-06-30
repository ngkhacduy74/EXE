import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../Services/api.service";

const LOCAL_KEY = "searchHistory";

function saveSearchHistory(keyword) {
  if (!keyword.trim()) return;
  let history = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  history = [
    keyword.trim(),
    ...history.filter((k) => k !== keyword.trim()),
  ].slice(0, 10);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(history));
}

function getSearchHistory(filter = "") {
  let history = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  if (filter) {
    history = history.filter((k) =>
      k.toLowerCase().includes(filter.toLowerCase())
    );
  }
  return history;
}

const SearchWithAutocomplete = ({
  placeholder = "Tìm kiếm sản phẩm...",
  onSearch,
  className = "",
  size = "lg",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load suggestions khi component mount hoặc searchQuery thay đổi
  useEffect(() => {
    if (showDropdown) {
      setSuggestions(getSearchHistory(searchQuery).slice(0, 5));
      // Gọi API lấy sản phẩm theo tên
      if (searchQuery.trim()) {
        getProducts({ search: searchQuery.trim() })
          .then((res) => {
            let products = res.data?.data || [];
            setProductSuggestions(products.slice(0, 5));
          })
          .catch(() => setProductSuggestions([]));
      } else {
        setProductSuggestions([]);
      }
    }
  }, [searchQuery, showDropdown]);

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  // Handle key navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchHistory(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    saveSearchHistory(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/products?search=${encodeURIComponent(suggestion)}`);
    }
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Handle product suggestion click
  const handleProductClick = (product) => {
    saveSearchHistory(product.name);
    navigate(`/product/${product.id}`);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xóa lịch sử
  const handleClearHistory = () => {
    localStorage.removeItem(LOCAL_KEY);
    setSuggestions([]);
  };

  return (
    <div className={`search-autocomplete ${className}`} ref={searchRef}>
      <style>{`
        .search-autocomplete { position: relative; }
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          background: white;
          border: 1px solid #dee2e6;
          border-top: none;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          max-height: 350px;
          overflow-y: auto;
        }
        .suggestion-item, .product-suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f8f9fa;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
        }
        .suggestion-item:hover, .suggestion-item.selected, .product-suggestion-item:hover {
          background-color: #f8f9fa;
        }
        .suggestion-item:last-child, .product-suggestion-item:last-child { border-bottom: none; }
        .product-thumb {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 6px;
          margin-right: 12px;
        }
        .product-info {
          flex: 1;
        }
        .product-price {
          color: #16a34a;
          font-weight: 600;
          font-size: 15px;
        }
        .clear-history-btn {
          display: block;
          width: 100%;
          text-align: center;
          padding: 8px 0;
          color: #dc3545;
          background: none;
          border: none;
          cursor: pointer;
        }
      `}</style>
      <InputGroup size={size}>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setShowDropdown(true);
            setSuggestions(getSearchHistory(searchQuery).slice(0, 5));
          }}
        />
        <InputGroup.Text
          as="button"
          type="button"
          onClick={handleSearch}
          style={{ cursor: "pointer" }}
        >
          <Search size={18} />
        </InputGroup.Text>
      </InputGroup>
      {showDropdown && (suggestions.length > 0 || productSuggestions.length > 0) && (
        <div className="search-dropdown" ref={dropdownRef}>
          {/* Gợi ý sản phẩm thực tế */}
          {productSuggestions.map((product, index) => (
            <div
              key={product.id || index}
              className="product-suggestion-item"
              onClick={() => handleProductClick(product)}
            >
              <img
                src={Array.isArray(product.image) ? product.image[0] : product.image || "/images/frigde.png"}
                alt={product.name}
                className="product-thumb"
                onError={e => e.target.src = "/images/frigde.png"}
              />
              <div className="product-info">
                <div>{product.name}</div>
                <div className="product-price">
                  {product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : "Chưa có giá"}
                </div>
              </div>
            </div>
          ))}
          {/* Gợi ý lịch sử tìm kiếm */}
          {suggestions.map((item, index) => (
            <div
              key={item + index}
              className={`suggestion-item${selectedIndex === index ? " selected" : ""}`}
              onClick={() => handleSuggestionClick(item)}
            >
              {item}
            </div>
          ))}
          {suggestions.length > 0 && (
            <button className="clear-history-btn" onClick={handleClearHistory}>
              Xóa lịch sử tìm kiếm
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchWithAutocomplete;

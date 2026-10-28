import React from "react";

const SearchFilterBar = ({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue = "",
  onFilterChange,
  filterOptions = [],
  filterLabel = "All",
}) => {
  const handleClear = () => {
    onSearchChange("");
    onFilterChange("");
  };

  return (
    <div className="search-filter-bar">
      {/* Search */}
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        placeholder={searchPlaceholder}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
      />

      {/* Filter */}
      {filterOptions.length > 0 && (
        <select
          className="filter-select"
          value={filterValue}
          onChange={(e) =>
            onFilterChange(e.target.value)
          }
        >
          <option value="">
            {filterLabel || "All"}
          </option>

          {filterOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Clear */}
      {(searchTerm || filterValue) && (
        <button
          type="button"
          className="btn-clear"
          onClick={handleClear}
        >
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchFilterBar;
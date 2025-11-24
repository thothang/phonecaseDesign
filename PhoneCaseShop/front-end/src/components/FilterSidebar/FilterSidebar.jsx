import React from "react";

export default function FilterSidebar({
  phoneModels,
  selectedModel,
  setSelectedModel,
  priceRange,
  setPriceRange,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortOrder,
  setSortOrder,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="w-72 p-6 border-r border-gray-200 bg-white space-y-6">

      {/* Search */}
      <div>
        <h3 className="font-semibold mb-2">Tìm kiếm</h3>
        <input
          type="text"
          placeholder="Tên loại ốp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Phone Model Filter */}
      <div>
        <h3 className="font-semibold mb-2">Dòng máy</h3>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {phoneModels.map((model) => (
            <option key={model} value={model}>
              {model === "all" ? "Tất cả" : model}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-2">Khoảng giá</h3>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="all">Tất cả</option>
          <option value="under300">Dưới 300,000đ</option>
          <option value="300to500">300,000 – 500,000đ</option>
          <option value="above500">Trên 500,000đ</option>
        </select>
      </div>

      {/* Custom Min/Max Price */}
      <div>
        <h3 className="font-semibold mb-2">Giá tùy chọn</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 border p-2 rounded"
          />
        </div>
      </div>

      {/* Sort Price */}
      <div>
        <h3 className="font-semibold mb-2">Sắp xếp</h3>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="none">Không sắp xếp</option>
          <option value="asc">Giá tăng dần</option>
          <option value="desc">Giá giảm dần</option>
        </select>
      </div>
    </div>
  );
}

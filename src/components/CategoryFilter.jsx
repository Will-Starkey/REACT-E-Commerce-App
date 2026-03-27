import { useCategories } from '../hooks/useProducts'
import './CategoryFilter.css'

export default function CategoryFilter({ selected, onChange }) {
  const { data: categories, isLoading } = useCategories()

  return (
    <div className="category-filter">
      <label className="category-filter-label" htmlFor="category-select">
        Filter by Category
      </label>
      <div className="category-filter-select-wrap">
        <select
          id="category-select"
          className="category-filter-select"
          value={selected}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        >
          <option value="">All Products</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
        <svg
          className="category-filter-chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  )
}

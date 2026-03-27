import ProductCard from './ProductCard'
import { useAllProducts, useProductsByCategory } from '../hooks/useProducts'
import './ProductList.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton-shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '90%', height: '0.65rem' }} />
        <div className="skeleton-line skeleton-shimmer" style={{ width: '70%', height: '0.65rem' }} />
        <div className="skeleton-footer">
          <div className="skeleton-price skeleton-shimmer" />
          <div className="skeleton-btn skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function ProductList({ category }) {
  const allQuery = useAllProducts()
  const categoryQuery = useProductsByCategory(category)

  const { data, isLoading, isError, error } = category ? categoryQuery : allQuery

  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="product-list-error">
        <p>Failed to load products.</p>
        <small>{error?.message}</small>
      </div>
    )
  }

  if (!data?.length) {
    return <p className="product-list-empty">No products found in this category.</p>
  }

  return (
    <div className="product-grid">
      {data.map((product, i) => (
        <div key={product.id} style={{ animationDelay: `${i * 60}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

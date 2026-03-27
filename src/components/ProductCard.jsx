import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import './ProductCard.css'

const PLACEHOLDER = 'https://via.placeholder.com/400x400/1a1714/c9a84c?text=LUXE'

function StarRating({ rate, count }) {
  const filled = Math.round(rate)
  return (
    <div className="product-rating">
      <div className="product-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star ${i < filled ? 'star--filled' : ''}`}>
            ★
          </span>
        ))}
      </div>
      <span className="product-rating-count">({count})</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const [imgSrc, setImgSrc] = useState(product.image)
  const [added, setAdded] = useState(false)

  function handleAddToCart() {
    dispatch(addToCart(product))
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="product-card">
      <div className="product-card-image-wrap">
        <img
          className="product-card-image"
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(PLACEHOLDER)}
          loading="lazy"
        />
        <span className="product-card-category">{product.category}</span>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        <p className="product-card-description">{product.description}</p>

        <StarRating rate={product.rating?.rate ?? 0} count={product.rating?.count ?? 0} />

        <div className="product-card-footer">
          <span className="product-card-price">${product.price.toFixed(2)}</span>
          <button
            className={`product-card-btn ${added ? 'product-card-btn--added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Added
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

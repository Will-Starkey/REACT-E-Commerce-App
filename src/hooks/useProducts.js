import { useQuery } from '@tanstack/react-query'

const BASE = 'https://fakestoreapi.com'

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetchJSON(`${BASE}/products`),
  })
}

export function useProductsByCategory(category) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => fetchJSON(`${BASE}/products/category/${encodeURIComponent(category)}`),
    enabled: !!category,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchJSON(`${BASE}/products/categories`),
  })
}

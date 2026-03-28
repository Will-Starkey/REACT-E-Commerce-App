import { useQuery } from '@tanstack/react-query'
import { getAllProducts, getProductsByCategory } from '../firebase/productService'

export function useAllProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
  })
}

export function useProductsByCategory(category) {
  return useQuery({
    queryKey: ['products', category],
    queryFn: () => getProductsByCategory(category),
    enabled: !!category,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const products = await getAllProducts()
      const cats = [...new Set(products.map((p) => p.category).filter(Boolean))]
      return cats.sort()
    },
  })
}

import { collection, doc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config'

const FAKESTORE_URL = 'https://fakestoreapi.com/products'
const META_DOC = '_meta'
const SENTINEL_ID = 'seeded'

export async function seedProducts(onProgress) {
  // Check sentinel — never seed twice
  const sentinelRef = doc(db, META_DOC, SENTINEL_ID)
  const sentinel = await getDocs(collection(db, META_DOC))
  const alreadySeeded = sentinel.docs.some((d) => d.id === SENTINEL_ID)

  if (alreadySeeded) {
    return { skipped: true, message: 'Products already seeded.' }
  }

  onProgress?.('Fetching products from FakeStore API…')
  const res = await fetch(FAKESTORE_URL)
  if (!res.ok) throw new Error('Failed to fetch from FakeStore API')
  const products = await res.json()

  onProgress?.(`Writing ${products.length} products to Firestore…`)
  let written = 0
  for (const p of products) {
    const ref = doc(collection(db, 'products'))
    await setDoc(ref, {
      id: ref.id,
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      rating: { rate: p.rating?.rate ?? 0, count: p.rating?.count ?? 0 },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    written++
    onProgress?.(`Written ${written} / ${products.length}`)
  }

  // Write sentinel
  await setDoc(sentinelRef, { seededAt: serverTimestamp(), count: written })
  return { skipped: false, message: `${written} products seeded successfully.` }
}

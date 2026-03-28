import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const ORDERS = 'orders'

export async function createOrder(userId, items, totalPrice, totalCount) {
  const ref = await addDoc(collection(db, ORDERS), {
    userId,
    items: items.map(({ id, title, price, image, count }) => ({
      id,
      title,
      price,
      image,
      count,
    })),
    totalPrice: Math.round(totalPrice * 100) / 100,
    totalCount,
    status: 'confirmed',
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserOrders(userId) {
  const q = query(
    collection(db, ORDERS),
    where('userId', '==', userId)
  )
  const snap = await getDocs(q)
  const orders = snap.docs.map((d) => ({ ...d.data(), orderId: d.id }))
  // Sort client-side — avoids needing a Firestore composite index
  return orders.sort((a, b) => {
    const aTime = a.createdAt?.toMillis?.() ?? 0
    const bTime = b.createdAt?.toMillis?.() ?? 0
    return bTime - aTime
  })
}

export async function getOrderById(orderId) {
  const snap = await getDoc(doc(db, ORDERS, orderId))
  return snap.exists() ? { ...snap.data(), orderId: snap.id } : null
}

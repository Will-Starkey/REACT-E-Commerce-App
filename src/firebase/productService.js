import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const PRODUCTS = 'products'

export async function getAllProducts() {
  const snap = await getDocs(collection(db, PRODUCTS))
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
}

export async function getProductsByCategory(category) {
  const q = query(collection(db, PRODUCTS), where('category', '==', category))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }))
}

export async function createProduct(data) {
  const ref = await addDoc(collection(db, PRODUCTS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  // Write the Firestore-generated ID back into the document
  await updateDoc(ref, { id: ref.id })
  return ref.id
}

export async function updateProduct(id, data) {
  await updateDoc(doc(db, PRODUCTS, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS, id))
}

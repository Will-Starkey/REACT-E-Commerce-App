import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const USERS = 'users'

export async function createUserDoc(uid, email, name) {
  await setDoc(doc(db, USERS, uid), {
    uid,
    email,
    name,
    address: { street: '', city: '', state: '', zip: '', country: '' },
    isAdmin: false,
    createdAt: serverTimestamp(),
  })
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, USERS, uid))
  return snap.exists() ? snap.data() : null
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, USERS, uid), data)
}

export async function deleteUserDoc(uid) {
  await deleteDoc(doc(db, USERS, uid))
}

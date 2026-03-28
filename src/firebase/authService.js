import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { auth } from './config'
import { createUserDoc, deleteUserDoc } from './userService'

export async function registerUser(email, password, name) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await createUserDoc(user.uid, email, name)
  return user
}

export async function loginUser(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  return user
}

export async function logoutUser() {
  await signOut(auth)
}

export async function deleteUserAccount(password) {
  const user = auth.currentUser
  if (!user) throw new Error('No user signed in')
  // Re-authenticate before deletion (Firebase requirement)
  const credential = EmailAuthProvider.credential(user.email, password)
  await reauthenticateWithCredential(user, credential)
  await deleteUserDoc(user.uid)
  await user.delete()
}

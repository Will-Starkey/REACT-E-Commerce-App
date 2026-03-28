import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'
import { getUserDoc } from '../firebase/userService'
import { setUser, clearAuth } from '../store/authSlice'

export default function AuthProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getUserDoc(firebaseUser.uid)
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: userDoc?.name ?? '',
              isAdmin: userDoc?.isAdmin ?? false,
            })
          )
        } catch {
          // Firestore read failed — still mark user as authenticated
          dispatch(
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: '',
              isAdmin: false,
            })
          )
        }
      } else {
        dispatch(clearAuth())
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  return children
}

import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // Holds full Firestore user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(true);  // Set loading to true when useEffect starts
      if (firebaseUser) {
        // Fetch extra user info from Firestore
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          console.log('1. User data:', docSnap.data());
        }
         else {
          console.warn('1. No user document found in Firestore.');
        }
        setLoading(false);  // Make sure this is set after data fetching
      } else {
        setUserData(null);
        setLoading(false);
        console.log('1. No user is signed in.');
      }

       console.log('2. Loading state set to false');
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

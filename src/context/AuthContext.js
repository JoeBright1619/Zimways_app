import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { authAPI } from '../services/api.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        try {
          // Fetch extra user info from Firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
            console.log('1. User data:', docSnap.data());
          } else {
            console.warn('1. No user document found in Firestore.');
          }

          // Get backend user data using our API service
          const idToken = await firebaseUser.getIdToken();
          try {
            const backendData = await authAPI.login(firebaseUser.email, idToken);
            setBackendUser(backendData.data);
            setUser(firebaseUser); // Only set Firebase user if backend auth succeeds
            console.log('2. Backend user data:', backendData.data);
          } catch (error) {
            console.error('3. Failed to get backend user:', error);
            // If backend auth fails, sign out from Firebase
            await signOut(auth);
            setUser(null);
            setUserData(null);
            setBackendUser(null);
          }
        } catch (error) {
          console.error('4. Error fetching user data:', error);
          // On any error, sign out
          await signOut(auth);
          setUser(null);
          setUserData(null);
          setBackendUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setBackendUser(null);
        setLoading(false);
        console.log('5. No user is signed in.');
      }
    });

    return () => unsub();
  }, []);

  // Login function that handles both Firebase and backend authentication
  const login = async (email, password) => {
    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get fresh token for backend auth
      const idToken = await userCredential.user.getIdToken(true);
      
      try {
        // Backend Authentication
        const response = await authAPI.login(email, idToken);
        
        // Set the backend user data and Firebase user
        setBackendUser(response.data);
        setUser(userCredential.user);
        return { success: true };
        
      } catch (error) {
        await signOut(auth);
        console.error('Backend authentication failed:', error);
        throw new Error('Backend authentication failed. Please try again later.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function that handles both Firebase and backend registration
  const register = async (userData) => {
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Get default profileURL from Firebase user or use a default avatar
      const profileUrl = userCredential.user.profileUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

      // Save additional user data to Firestore
      const userDocData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address || '',
        profileUrl: profileUrl,
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDocData);

      // Get token for backend auth
      const idToken = await userCredential.user.getIdToken();

      try {
        // Register with backend - send both UID and current token
        const backendResponse = await authAPI.register({
          ...userDocData,
          password: userData.password,
          firebaseUid: userCredential.user.uid,  // Permanent identifier - will be stored
          firebaseToken: idToken,                // Temporary token - used only for authentication
          profileUrl: profileUrl
        });

        setBackendUser(backendResponse.data);
        return { success: true };
      } catch (error) {
        // If backend registration fails, delete the Firebase user
        await userCredential.user.delete();
        throw error;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function that handles both Firebase and backend logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setBackendUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // 2FA verification function
  const verify2FA = async (userId, code, secret) => {
    try {
      const response = await authAPI.verify2FA(userId, { code, secret });
      if (response.valid) {
        setBackendUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('2FA verification error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        userData,
        backendUser,
        loading,
        login,
        register,
        logout,
        verify2FA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

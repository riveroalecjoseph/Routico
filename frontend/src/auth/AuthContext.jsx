import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Sign up function for business owners
  const signUp = async (email, password, userData) => {
    let firebaseUser = null;
    
    try {
      console.log('Starting registration process for:', email);
      
      // Step 1: Create Firebase user first
      console.log('Step 1: Creating Firebase user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;
      console.log('Firebase user created successfully:', firebaseUser.uid);

      // Step 2: Create user in MySQL database
      console.log('Step 2: Creating MySQL user...');
      const formData = new FormData();
      formData.append('fullName', userData.fullName);
      formData.append('email', email);
      formData.append('phone', userData.phone);
      formData.append('password', password);
      
      if (userData.companyDocument) {
        formData.append('companyDocument', userData.companyDocument);
        console.log('Company document attached:', userData.companyDocument.name);
      }

      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        body: formData, // Send as FormData for file upload
      });

      console.log('MySQL registration response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('MySQL registration failed:', errorData);
        throw new Error(errorData.error || 'Failed to create user in database');
      }

      // Step 3: If database creation succeeds, return success
      console.log('Registration completed successfully');
      
      // Step 4: Fetch user data from database to set role and status
      try {
        const userResponse = await fetch(`http://localhost:3001/api/auth/user/${encodeURIComponent(email)}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserRole(userData.role);
          setUserStatus({
            account_status: userData.account_status,
            active_status: userData.active_status
          });
          console.log('User data fetched after registration:', userData);
        }
      } catch (fetchError) {
        console.error('Error fetching user data after registration:', fetchError);
      }
      
      return userCredential;
      
    } catch (error) {
      console.error('Registration error occurred:', error);
      
      // Rollback: If database creation fails, delete Firebase user
      if (firebaseUser) {
        try {
          console.log('Rolling back Firebase user due to error...');
          await firebaseUser.delete();
          console.log('Firebase user deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting Firebase user:', deleteError);
        }
      }
      
      // Re-throw the original error
      throw error;
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    try {
      // Try admin login first (backend authentication)
      try {
        const adminResponse = await fetch('http://localhost:3001/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (adminResponse.ok) {
          const data = await adminResponse.json();
          // For admins, set user context without Firebase
          setUser({ email: email, uid: data.user.userId });
          setJwt(data.token);
          setIsAdmin(true);
          setUserRole(data.user.role);
          setUserStatus({
            account_status: data.user.accountStatus,
            active_status: data.user.activeStatus
          });
          return { user: { email } };
        }
      } catch (adminError) {
        console.log('Admin login not available, trying Firebase...');
      }

      // Fall back to Firebase authentication for regular users
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(false);
      setJwt(null);
      
      // Fetch user data from your database using email
      const response = await fetch(`http://localhost:3001/api/auth/user/${encodeURIComponent(email)}`);
      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.role);
        setUserStatus({
          account_status: userData.account_status,
          active_status: userData.active_status
        });
      } else {
        console.error('Failed to fetch user data from database');
      }
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      setUserStatus(null);
      setJwt(null);
      setIsAdmin(false);
    } catch (error) {
      throw error;
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user role from database using email
        try {
          const response = await fetch(`http://localhost:3001/api/auth/user/${encodeURIComponent(firebaseUser.email)}`);
          
          if (response.ok) {
            const userData = await response.json();
            setUserRole(userData.role);
            setUserStatus({
              account_status: userData.account_status,
              active_status: userData.active_status
            });
          } else {
            console.error('Failed to fetch user data from database');
            setUserRole(null);
            setUserStatus(null);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserRole(null);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setUserStatus(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userRole,
    userStatus,
    signUp,
    signIn,
    logout,
    loading,
    isAdmin,
    getToken: () => jwt
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
